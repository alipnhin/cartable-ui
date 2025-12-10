namespace SI.Cartable.BFF.Middlewares;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;
using TPG.SI.SplunkLogger.Utils;

public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;
    private const string _appModule = "Global Exception Handler";
    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogErrorSplunk(
                "Unhandled exception occurred.", appModule: _appModule,
                metaData: new
                {
                    Exception = ex,
                    Path = context.Request.Path,
                    TraceId = context.TraceIdentifier
                });


            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var response = new
        {
            success = false,
            traceId = context.TraceIdentifier,
            message = "An unexpected error occurred."
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        return context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}

