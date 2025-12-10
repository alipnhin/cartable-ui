using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserProfileController : BaseController
{
    private readonly IUserProfileService _userProfileService;

    public UserProfileController(IUserProfileService userProfileService)
    {
        _userProfileService = userProfileService;
    }

    /// <summary>
    /// دریافت اطلاعات پروفایل کاربر از Identity Server
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetUserInfo(
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);

        if (string.IsNullOrEmpty(accessToken))
        {
            return Unauthorized(new { error = "No access token provided" });
        }

        var result = await _userProfileService.GetUserInfoAsync(accessToken);
        return ToActionResult(result);
    }
}
