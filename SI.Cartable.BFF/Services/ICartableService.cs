using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Services;

public interface ICartableService
{
    Task<ServiceResult<PagedListResponse<PaymentListDto>>> GetApproverCartableAsync(
        CartableFilterParams filterParams,
        string accessToken);

    Task<ServiceResult<string>> SendOperationOtpAsync(
        SendOperationOtpRequest request,
        string accessToken);

    Task<ServiceResult<string>> ApprovePaymentAsync(
        ApproveRequest request,
        string accessToken);

    Task<ServiceResult<string>> SendBatchOperationOtpAsync(
        SendBatchOperationOtpRequest request,
        string accessToken);

    Task<ServiceResult<string>> BatchApprovePaymentsAsync(
        BatchApproveRequest request,
        string accessToken);
}
