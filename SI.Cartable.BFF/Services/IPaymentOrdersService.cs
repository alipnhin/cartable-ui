using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.PaymentOrders;

namespace SI.Cartable.BFF.Services;

public interface IPaymentOrdersService
{
    Task<ServiceResult<PagedListResponse<PaymentListDto>>> SearchPaymentOrdersAsync(
        CartableFilterParams filterParams,
        string accessToken);

    Task<ServiceResult<WithdrawalOrderDetails>> GetWithdrawalOrderDetailsAsync(
        string id,
        string accessToken);

    Task<ServiceResult<TransactionStatisticsResponseDto>> GetWithdrawalStatisticsAsync(
        string id,
        string accessToken);

    Task<ServiceResult<PagedListResponse<WithdrawalTransaction>>> GetWithdrawalTransactionsAsync(
        TransactionFilterParams filterParams,
        string accessToken);

    Task<ServiceResult<WithdrawalTransaction>> GetTransactionDetailsAsync(
        string transactionId,
        string accessToken);

    Task<ServiceResult<string>> InquiryOrderByIdAsync(
        string orderId,
        string accessToken);

    Task<ServiceResult<WithdrawalTransaction>> InquiryTransactionByIdAsync(
        string transactionId,
        string accessToken);

    Task<ServiceResult<string>> SendToBankAsync(
        string orderId,
        string accessToken);

    Task<ServiceResult<byte[]>> ExportOrderTransactionsToExcelAsync(
        string orderId,
        string accessToken);
}
