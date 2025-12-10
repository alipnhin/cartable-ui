using SI.Cartable.BFF.Models;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SI.Cartable.BFF.Services;

public class TadbirPayService : ITadbirPayService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<TadbirPayService> _logger;
    private readonly JsonSerializerOptions _jsonOptions;
    public TadbirPayService(
        HttpClient httpClient,
        ILogger<TadbirPayService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;

        _jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            ReferenceHandler = ReferenceHandler.IgnoreCycles,
            Converters = { new JsonStringEnumConverter() },
            PropertyNameCaseInsensitive = true 
        };
    }

    public async Task<TadbirPayResponse<T>> GetAsync<T>(string endpoint, string accessToken)
    {
        return await ExecuteAsync<T>(accessToken, async () =>
            await _httpClient.GetAsync(endpoint));
    }

    public async Task<TadbirPayResponse<T>> PostAsync<T>(string endpoint, string accessToken, object? body = null)
    {
        return await ExecuteAsync<T>(accessToken, async () =>
            await _httpClient.PostAsJsonAsync(endpoint, body));
    }

    public async Task<TadbirPayResponse<T>> PutAsync<T>(string endpoint, string accessToken, object? body = null)
    {
        return await ExecuteAsync<T>(accessToken, async () =>
            await _httpClient.PutAsJsonAsync(endpoint, body));
    }

    public async Task<TadbirPayResponse<T>> DeleteAsync<T>(string endpoint, string accessToken)
    {
        return await ExecuteAsync<T>(accessToken, async () =>
            await _httpClient.DeleteAsync(endpoint));
    }

    private async Task<TadbirPayResponse<T>> ExecuteAsync<T>(string accessToken, Func<Task<HttpResponseMessage>> action)
    {
        try
        {
            // اضافه کردن Authorization header
            _httpClient.DefaultRequestHeaders.Remove("Authorization");
            if (!string.IsNullOrEmpty(accessToken))
            {
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
            }

            var response = await action();
            var statusCode = (int)response.StatusCode;

            if (response.IsSuccessStatusCode)
            {
                var data = await response.Content.ReadFromJsonAsync<T>(_jsonOptions);
                return new TadbirPayResponse<T>
                {
                    Success = true,
                    Data = data,
                    StatusCode = statusCode
                };
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("TadbirPay request failed with status {StatusCode}: {Error}",
                    statusCode, errorContent);

                return new TadbirPayResponse<T>
                {
                    Success = false,
                    ErrorMessage = errorContent,
                    StatusCode = statusCode
                };
            }
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP request exception occurred");
            return new TadbirPayResponse<T>
            {
                Success = false,
                ErrorMessage = $"Network error: {ex.Message}",
                StatusCode = 0
            };
        }
        catch (TaskCanceledException ex)
        {
            _logger.LogError(ex, "Request timeout");
            return new TadbirPayResponse<T>
            {
                Success = false,
                ErrorMessage = "Request timeout",
                StatusCode = 408
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error occurred");
            return new TadbirPayResponse<T>
            {
                Success = false,
                ErrorMessage = $"Unexpected error: {ex.Message}",
                StatusCode = 500
            };
        }
    }
}
