using SI.Cartable.BFF.Models;

namespace SI.Cartable.BFF.Services;

public interface ITadbirPayService
{
    Task<TadbirPayResponse<T>> GetAsync<T>(string endpoint, string accessToken);
    Task<TadbirPayResponse> GetAsync(string endpoint, string accessToken);
    Task<TadbirPayResponse<T>> PostAsync<T>(string endpoint, string accessToken, object? body = null);
    Task<TadbirPayResponse> PostAsync(string endpoint, string accessToken, object? body = null);
    Task<TadbirPayResponse<T>> PutAsync<T>(string endpoint, string accessToken, object? body = null);
    Task<TadbirPayResponse> PutAsync(string endpoint, string accessToken, object? body = null);
    Task<TadbirPayResponse<T>> DeleteAsync<T>(string endpoint, string accessToken);
    Task<TadbirPayResponse> DeleteAsync(string endpoint, string accessToken);



}
