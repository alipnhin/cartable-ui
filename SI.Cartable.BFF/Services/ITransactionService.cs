using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Transactions;

namespace SI.Cartable.BFF.Services;

public interface ITransactionService
{
    Task<ServiceResult<PagedListResponse<TransactionItem>>> GetTransactionsListAsync(
        TransactionsRequest request,
        string accessToken);

    Task<ServiceResult<byte[]>> ExportTransactionsToExcelAsync(
        TransactionsRequest request,
        string accessToken);
}
