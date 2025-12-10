using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Badge;

namespace SI.Cartable.BFF.Services;

public class BadgeService : IBadgeService
{
    private readonly ITadbirPayService _tadbirPayService;

    public BadgeService(ITadbirPayService tadbirPayService)
    {
        _tadbirPayService = tadbirPayService;
    }

    public async Task<ServiceResult<MenuCountsResponse>> GetMenuCountsAsync(string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<MenuCountsResponse>(
            "v1/Badge/MenuCounts",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<MenuCountsResponse>.Fail(
                response.ErrorMessage ?? "خطا در دریافت تعداد آیتم‌های منو",
                response.StatusCode);
        }

        return ServiceResult<MenuCountsResponse>.Success(
            response.Data ?? new MenuCountsResponse());
    }
}
