using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Models.AccountGroups;
using SI.Cartable.BFF.Models.Accounts;
using SI.Cartable.BFF.Models.Select;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[Route("api/[controller]")]
public class AccountsController : BaseController
{
    private readonly IAccountService _accountService;
    private readonly ILogger<AccountsController> _logger;

    public AccountsController(
        IAccountService accountService,
        ILogger<AccountsController> logger)
    {
        _accountService = accountService;
        _logger = logger;
    }

    /// <summary>
    /// دریافت لیست حساب‌ها
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAccountsList(
        [FromQuery] string? accountGroupId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountService.GetAccountsListAsync(accessToken, accountGroupId);
        return ToActionResult(result);
    }

    /// <summary>
    /// دریافت جزئیات یک حساب
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAccountDetail(
        string id,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountService.GetAccountDetailAsync(id, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// تغییر حداقل تعداد امضا
    /// </summary>
    [HttpPost("change-minimum-signature")]
    public async Task<IActionResult> ChangeMinimumSignature(
        [FromBody] ChangeMinimumSignatureRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountService.ChangeMinimumSignatureAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// اضافه کردن امضادار جدید
    /// </summary>
    [HttpPost("add-signer")]
    public async Task<IActionResult> AddSigner(
        [FromBody] AddSignerRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountService.AddSignerAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// دریافت لیست کاربران برای انتخاب امضادار
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetUsersList(
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountService.GetUsersListAsync(accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// غیرفعال کردن امضادار
    /// </summary>
    [HttpPost("signers/{signerId}/disable")]
    public async Task<IActionResult> DisableSigner(
        string signerId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountService.DisableSignerAsync(signerId, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// فعال کردن امضادار
    /// </summary>
    [HttpPost("signers/{signerId}/enable")]
    public async Task<IActionResult> EnableSigner(
        string signerId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountService.EnableSignerAsync(signerId, accessToken);
        return ToActionResult(result);
    }



    [HttpPost("AccountSelect")]
    public async Task<IActionResult> AccountSelect(
        [FromBody] SelectRequest request,
       [FromQuery] string? accountGroupId,
       [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountService.AccountSelectAsync(request,accountGroupId, accessToken);
        return ToActionResult(result);
    }
}
