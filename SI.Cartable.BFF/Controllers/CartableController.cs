using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Models.Cartable;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CartableController : BaseController
{
    private readonly ICartableService _cartableService;

    public CartableController(ICartableService cartableService)
    {
        _cartableService = cartableService;
    }

    /// <summary>
    /// واکشی لیست درخواست‌های در انتظار تایید امضادار
    /// </summary>
    [HttpPost("approver-cartable")]
    public async Task<IActionResult> GetApproverCartable(
        [FromBody] CartableFilterParams filterParams,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _cartableService.GetApproverCartableAsync(filterParams, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// ارسال کد OTP برای عملیات تکی (تایید یا رد)
    /// </summary>
    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOperationOtp(
        [FromBody] SendOperationOtpRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _cartableService.SendOperationOtpAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// تایید یا رد تکی دستور پرداخت
    /// </summary>
    [HttpPost("approve")]
    public async Task<IActionResult> ApprovePayment(
        [FromBody] ApproveRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _cartableService.ApprovePaymentAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// ارسال کد OTP برای عملیات گروهی (تایید یا رد)
    /// </summary>
    [HttpPost("send-batch-otp")]
    public async Task<IActionResult> SendBatchOperationOtp(
        [FromBody] SendBatchOperationOtpRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _cartableService.SendBatchOperationOtpAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// تایید یا رد گروهی دستورات پرداخت
    /// </summary>
    [HttpPost("batch-approve")]
    public async Task<IActionResult> BatchApprovePayments(
        [FromBody] BatchApproveRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _cartableService.BatchApprovePaymentsAsync(request, accessToken);
        return ToActionResult(result);
    }
}
