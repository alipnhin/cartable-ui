using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentOrdersController : BaseController
{
    private readonly IPaymentOrdersService _paymentOrdersService;
    private readonly ILogger<PaymentOrdersController> _logger;

    public PaymentOrdersController(
        IPaymentOrdersService paymentOrdersService,
        ILogger<PaymentOrdersController> logger)
    {
        _paymentOrdersService = paymentOrdersService;
        _logger = logger;
    }

    /// <summary>
    /// جستجو و واکشی لیست دستورات پرداخت با فیلترهای پیشرفته
    /// </summary>
    [HttpPost("search")]
    public async Task<IActionResult> SearchPaymentOrders(
        [FromBody] CartableFilterParams filterParams,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.SearchPaymentOrdersAsync(filterParams, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// دریافت جزئیات کامل دستور پرداخت
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetOrderDetails(
        string id,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.GetWithdrawalOrderDetailsAsync(id, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// دریافت آمار کامل دستور پرداخت
    /// </summary>
    [HttpGet("{id}/statistics")]
    public async Task<IActionResult> GetOrderStatistics(
        string id,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.GetWithdrawalStatisticsAsync(id, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// استعلام دستور پرداخت
    /// </summary>
    [HttpGet("{id}/inquiry")]
    public async Task<IActionResult> InquiryOrder(
        string id,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.InquiryOrderByIdAsync(id, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// ارسال دستور پرداخت به بانک
    /// </summary>
    [HttpPost("{id}/send-to-bank")]
    public async Task<IActionResult> SendToBank(
        string id,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.SendToBankAsync(id, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// دریافت لیست تراکنش‌های یک دستور پرداخت با فیلتر
    /// </summary>
    [HttpPost("transactions")]
    public async Task<IActionResult> GetWithdrawalTransactions(
        [FromBody] TransactionFilterParams filterParams,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.GetWithdrawalTransactionsAsync(filterParams, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// دریافت جزئیات یک تراکنش
    /// </summary>
    [HttpGet("transactions/{transactionId}")]
    public async Task<IActionResult> GetTransactionDetails(
        string transactionId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.GetTransactionDetailsAsync(transactionId, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// استعلام تراکنش
    /// </summary>
    [HttpGet("transactions/{transactionId}/inquiry")]
    public async Task<IActionResult> InquiryTransaction(
        string transactionId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.InquiryTransactionByIdAsync(transactionId, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// خروجی اکسل تراکنش‌های یک دستور پرداخت
    /// </summary>
    [HttpGet("{orderId}/transactions/export")]
    public async Task<IActionResult> ExportOrderTransactions(
        string orderId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _paymentOrdersService.ExportOrderTransactionsToExcelAsync(orderId, accessToken);

        if (!result.IsSuccess)
        {
            return ToActionResult(result);
        }

        return File(result.Data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"transactions_{orderId}_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx");
    }

}
