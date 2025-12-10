using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Transactions;

namespace SI.Cartable.BFF.Services;

public class TransactionService : ITransactionService
{
    private readonly ITadbirPayService _tadbirPayService;

    public TransactionService(ITadbirPayService tadbirPayService)
    {
        _tadbirPayService = tadbirPayService;
    }

    public async Task<ServiceResult<PagedListResponse<TransactionItem>>> GetTransactionsListAsync(
        TransactionsRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<PagedListResponse<TransactionItem>>(
            "v1-Cartable/Withdrawal/withdrawal-transactions/paged",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<PagedListResponse<TransactionItem>>.Fail(
                response.ErrorMessage ?? "خطا در دریافت لیست تراکنش‌ها",
                response.StatusCode);
        }

        return ServiceResult<PagedListResponse<TransactionItem>>.Success(
            response.Data );
    }

    public async Task<ServiceResult<byte[]>> ExportTransactionsToExcelAsync(
        TransactionsRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<byte[]>(
            "v1-Cartable/Withdrawal/withdrawal-transactions/export",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<byte[]>.Fail(
                response.ErrorMessage ?? "خطا در خروجی اکسل تراکنش‌ها",
                response.StatusCode);
        }

        return ServiceResult<byte[]>.Success(
            response.Data ?? Array.Empty<byte>());
    }
}
