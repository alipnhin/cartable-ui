using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Polly;
using Polly.Extensions.Http;
using SI.Cartable.BFF.Configuration;
using SI.Cartable.BFF.Services;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Configure settings
builder.Services.Configure<TadbirPaySettings>(
    builder.Configuration.GetSection("TadbirPay"));
builder.Services.Configure<IdentityServerSettings>(
    builder.Configuration.GetSection("IdentityServer"));

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:3000" };

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

// Add HttpClient for TadbirPayService with Polly retry policy
var tadbirPaySettings = builder.Configuration.GetSection("TadbirPay").Get<TadbirPaySettings>();
builder.Services.AddHttpClient<ITadbirPayService, TadbirPayService>(client =>
{
    client.BaseAddress = new Uri(tadbirPaySettings?.BaseUrl ?? "https://si-lab-tadbirpay.etadbir.com/api/");
    client.Timeout = TimeSpan.FromSeconds(tadbirPaySettings?.TimeoutSeconds ?? 30);
})
    .AddPolicyHandler(GetRetryPolicy())
    .AddPolicyHandler(GetCircuitBreakerPolicy());

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

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Cartable BFF API v1");
    });
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("CartablePolicy");

// Use Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

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
