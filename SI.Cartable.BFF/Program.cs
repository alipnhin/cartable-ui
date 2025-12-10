using AspNetCoreRateLimit;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Polly;
using Polly.Extensions.Http;
using SI.Cartable.BFF.Configuration;
using SI.Cartable.BFF.Extensions;
using SI.Cartable.BFF.Services;
using System.Reflection;
using System.Text.Json;
using TPG.SI.SplunkLogger;
using TPG.SI.SplunkLogger.Utils.HttpClientLogger;

var builder = WebApplication.CreateBuilder(args);

// Configure settings
builder.Services.Configure<TadbirPaySettings>(
    builder.Configuration.GetSection("TadbirPay"));
builder.Services.Configure<IdentityServerSettings>(
    builder.Configuration.GetSection("IdentityServer"));

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000", "https://newecartable.etadbirco.ir" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("CartablePolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add Authentication with JWT Bearer
var identityServerSettings = builder.Configuration.GetSection("IdentityServer").Get<IdentityServerSettings>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = identityServerSettings?.Authority;
        options.Audience = identityServerSettings?.Audience;
        options.RequireHttpsMetadata = identityServerSettings?.RequireHttpsMetadata ?? true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = identityServerSettings?.ValidateIssuer ?? true,
            ValidateAudience = identityServerSettings?.ValidateAudience ?? true,
            ValidateLifetime = identityServerSettings?.ValidateLifetime ?? true,
            ValidateIssuerSigningKey = true
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"Authentication failed: {context.Exception.Message}");
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("Token validated successfully");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Add Rate Limiting
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.Configure<IpRateLimitPolicies>(builder.Configuration.GetSection("IpRateLimitPolicies"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();

// Add HttpClient for TadbirPayService (NO RETRY - SAFE FOR PAYMENT)
var tadbirPaySettings = builder.Configuration.GetSection("TadbirPay").Get<TadbirPaySettings>();
builder.Services.AddHttpClient<ITadbirPayService, TadbirPayService>(client =>
{
    client.BaseAddress = new Uri(tadbirPaySettings?.BaseUrl ?? "https://pay.etadbir.com/api/");
    client.Timeout = TimeSpan.FromSeconds(tadbirPaySettings?.TimeoutSeconds ?? 90);
})
    .AddPolicyHandler(GetCircuitBreakerPolicy()) 
    .AddEnhancedLogging(options =>
    {
        options.ClientName = "TadbirPay";
        options.LogHeaders = true;
        options.RequestBodyLoggingMode = RequestBodyLoggingMode.Always;
        options.SensitiveHeaders = new[] {
            "Authorization", "X-Api-Key", "Api-Key",
            "X-Auth-Token", "Session-Token", "Bearer",
            "X-Access-Token"
        };
    });

// Add HttpClient for UserProfileService
builder.Services.AddHttpClient<IUserProfileService, UserProfileService>();

// Register application services
builder.Services.AddScoped<IPaymentOrdersService, PaymentOrdersService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ICartableService, CartableService>();
builder.Services.AddScoped<IAccountGroupService, AccountGroupService>();
builder.Services.AddScoped<IUserProfileService, UserProfileService>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IBadgeService, BadgeService>();
builder.Services.AddScoped<IManagerCartableService, ManagerCartableService>();

// Add FluentValidation
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
builder.Services.AddFluentValidationAutoValidation();

// Add Controllers
builder.Services.AddControllers()
 .AddJsonOptions(o =>
 {
     // camelCase
     o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;

     // Ignore cycles
     o.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;

     // Enum as string
     o.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
 });
// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Logging.EnableEnrichment();
builder.Logging.AddSplunkLogger(builder.Configuration);
builder.Services.AddHealthChecks();
var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Cartable BFF API v1");
    });
    app.UseHttpsRedirection();
}


app.UseGlobalExceptionHandler();
// Use Rate Limiting (before CORS and Authentication)
app.UseIpRateLimiting();

// Use CORS
app.UseCors("CartablePolicy");

// Use Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");
app.Run();

// Polly retry policy
static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .WaitAndRetryAsync(
            retryCount: 3,
            sleepDurationProvider: retryAttempt => TimeSpan.FromSeconds(Math.Pow(2, retryAttempt)),
            onRetry: (outcome, timespan, retryAttempt, context) =>
            {
                Console.WriteLine($"Retrying request (attempt {retryAttempt}) after {timespan.TotalSeconds} seconds");
            });
}

// Polly circuit breaker policy
static IAsyncPolicy<HttpResponseMessage> GetCircuitBreakerPolicy()
{
    return HttpPolicyExtensions
        .HandleTransientHttpError()
        .CircuitBreakerAsync(
            handledEventsAllowedBeforeBreaking: 5,
            durationOfBreak: TimeSpan.FromSeconds(30),
            onBreak: (outcome, timespan) =>
            {
                Console.WriteLine($"Circuit breaker opened for {timespan.TotalSeconds} seconds");
            },
            onReset: () =>
            {
                Console.WriteLine("Circuit breaker reset");
            });
}



