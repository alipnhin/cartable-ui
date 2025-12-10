using Microsoft.AspNetCore.Mvc;
using SI.Cartable.BFF.Models.Transactions;
using SI.Cartable.BFF.Services;

namespace SI.Cartable.BFF.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionController : BaseController
{
    private readonly ITransactionService _transactionService;

    public TransactionController(ITransactionService transactionService)
    {
        _transactionService = transactionService;
    }

    /// <summary>
    /// دریافت لیست تراکنش‌ها با فیلترهای پیشرفته
    /// </summary>
    [HttpPost("paged")]
    public async Task<IActionResult> GetTransactionsList(
        [FromBody] TransactionsRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _transactionService.GetTransactionsListAsync(request, accessToken);
        return ToActionResult(result);
    }

    /// <summary>
    /// خروجی اکسل از لیست تراکنش‌ها
    /// </summary>
    [HttpPost("export")]
    public async Task<IActionResult> ExportTransactionsToExcel(
        [FromBody] TransactionsRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        var accessToken = ExtractToken(authorization);
        var result = await _transactionService.ExportTransactionsToExcelAsync(request, accessToken);

        if (result.IsFailure)
        {
            return ToActionResult(result);
        }

        return File(result.Data, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            $"transactions_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx");
    }
}
