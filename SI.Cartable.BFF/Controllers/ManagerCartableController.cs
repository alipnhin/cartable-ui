using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Models.Cartable;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ManagerCartableController : BaseController
{
    private readonly IManagerCartableService _managerCartableService;

    public ManagerCartableController(IManagerCartableService managerCartableService)
    {
        _managerCartableService = managerCartableService;
    }

    /// <summary>
    /// واکشی لیست درخواست‌های در انتظار تایید مدیر
    /// </summary>
    [HttpPost("manager-cartable")]
    public async Task<IActionResult> GetManagerCartable(
        [FromBody] CartableFilterParams filterParams,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _managerCartableService.GetManagerCartableAsync(filterParams, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// ارسال کد OTP برای عملیات تکی (تایید یا لغو)
    /// </summary>
    [HttpPost("send-otp")]
    public async Task<IActionResult> SendManagerOperationOtp(
        [FromBody] SendOperationOtpRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _managerCartableService.SendManagerOperationOtpAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// تایید یا لغو تکی دستور پرداخت توسط مدیر
    /// </summary>
    [HttpPost("approve")]
    public async Task<IActionResult> ManagerApprovePayment(
        [FromBody] ApproveRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _managerCartableService.ManagerApprovePaymentAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// ارسال کد OTP برای عملیات گروهی (تایید یا لغو)
    /// </summary>
    [HttpPost("send-batch-otp")]
    public async Task<IActionResult> SendManagerBatchOperationOtp(
        [FromBody] SendBatchOperationOtpRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _managerCartableService.SendManagerBatchOperationOtpAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// تایید یا لغو گروهی دستورات پرداخت توسط مدیر
    /// </summary>
    [HttpPost("batch-approve")]
    public async Task<IActionResult> ManagerBatchApprovePayments(
        [FromBody] BatchApproveRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _managerCartableService.ManagerBatchApprovePaymentsAsync(request, accessToken);
        return ToActionResult(result);
    }
}
