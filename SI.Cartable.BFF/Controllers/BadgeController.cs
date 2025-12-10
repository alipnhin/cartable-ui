using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BadgeController : BaseController
{
    private readonly IBadgeService _badgeService;

    public BadgeController(IBadgeService badgeService)
    {
        _badgeService = badgeService;
    }

    /// <summary>
    /// دریافت تعداد آیتم‌های منو برای نمایش Badge
    /// </summary>
    [HttpGet("menu-counts")]
    public async Task<IActionResult> GetMenuCounts(
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _badgeService.GetMenuCountsAsync(accessToken);
        return ToActionResult(result);
    }
}
