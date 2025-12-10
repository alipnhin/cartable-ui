using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Models.AccountGroups;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountGroupsController : BaseController
{
    private readonly IAccountGroupService _accountGroupService;
    private readonly ILogger<AccountGroupsController> _logger;
    private const string _appMudole = "Account Groups API";
    public AccountGroupsController(
        IAccountGroupService accountGroupService,
        ILogger<AccountGroupsController> logger)
    {
        _accountGroupService = accountGroupService;
        _logger = logger;
    }

    /// <summary>
    /// دریافت لیست گروه‌های حساب (برای سلکت)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAccountGroups(
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.GetAccountGroupsAsync(accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// جستجو و فیلتر گروه‌های حساب
    /// </summary>
    [HttpPost("filter")]
    public async Task<IActionResult> FilterAccountGroups(
        [FromBody] FilterAccountGroupsParams filterParams,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.FilterAccountGroupsAsync(filterParams, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// دریافت جزئیات گروه حساب
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAccountGroupById(
        string id,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.GetAccountGroupByIdAsync(id, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// ایجاد گروه حساب جدید
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateAccountGroup(
        [FromBody] CreateAccountGroupParams request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.CreateAccountGroupAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// ویرایش گروه حساب
    /// </summary>
    [HttpPut]
    public async Task<IActionResult> EditAccountGroup(
        [FromBody] EditAccountGroupParams request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.EditAccountGroupAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// تغییر وضعیت گروه حساب
    /// </summary>
    [HttpPut("status")]
    public async Task<IActionResult> ChangeAccountGroupStatus(
        [FromBody] ChangeAccountGroupStatusParams request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.ChangeAccountGroupStatusAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// حذف گروه حساب
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAccountGroup(
        string id,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.DeleteAccountGroupAsync(id, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// افزودن حساب‌ها به گروه
    /// </summary>
    [HttpPost("accounts")]
    public async Task<IActionResult> AddGroupAccounts(
        [FromBody] AddGroupAccountsParams request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.AddGroupAccountsAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// حذف حساب از گروه
    /// </summary>
    [HttpDelete("accounts/{itemId}")]
    public async Task<IActionResult> RemoveGroupAccount(
        string itemId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _accountGroupService.RemoveGroupAccountAsync(itemId, accessToken);
        return ToActionResult(result);
    }

    
}
