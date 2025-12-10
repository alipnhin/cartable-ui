using SI.Cartable.BFF.Models.UserProfile;
using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Configuration;
using Microsoft.Extensions.Options;
using System.Net.Http.Json;

namespace SI.Cartable.BFF.Services;

public class UserProfileService : IUserProfileService
{
    private readonly HttpClient _httpClient;
    private readonly IdentityServerSettings _settings;
    private readonly ILogger<UserProfileService> _logger;

    public UserProfileService(
        HttpClient httpClient,
        IOptions<IdentityServerSettings> settings,
        ILogger<UserProfileService> logger)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<ServiceResult<UserInfoResponse>> GetUserInfoAsync(string accessToken)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get,
                $"{_settings.Authority}/connect/userinfo");

            request.Headers.Add("Authorization", $"Bearer {accessToken}");

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("Failed to fetch user info: {StatusCode}", response.StatusCode);
                return ServiceResult<UserInfoResponse>.Fail(
                    "خطا در دریافت اطلاعات کاربر",
                    (int)response.StatusCode);
            }

            var userInfo = await response.Content.ReadFromJsonAsync<UserInfoResponse>();

            return ServiceResult<UserInfoResponse>.Success(
                userInfo ?? new UserInfoResponse());
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "HTTP error fetching user info");
            return ServiceResult<UserInfoResponse>.Fail(
                $"خطای شبکه: {ex.Message}",
                500);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unexpected error fetching user info");
            return ServiceResult<UserInfoResponse>.Fail(
                $"خطای غیرمنتظره: {ex.Message}",
                500);
        }
    }
}
