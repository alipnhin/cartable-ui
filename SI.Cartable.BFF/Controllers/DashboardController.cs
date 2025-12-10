using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Models.Dashboard;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : BaseController
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// دریافت پیشرفت تراکنش‌ها برای داشبورد
    /// </summary>
    [HttpPost("transaction-progress")]
    public async Task<IActionResult> GetTransactionProgress(
        [FromBody] DashboardFilterParams filterParams,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _dashboardService.GetTransactionProgressAsync(filterParams, accessToken);
        return ToActionResult(result);
    }
}
