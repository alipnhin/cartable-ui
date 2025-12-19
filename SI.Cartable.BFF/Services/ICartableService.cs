using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Services;

public interface ICartableService
{
    Task<ServiceResult<PagedListResponse<PaymentListDto>>> GetApproverCartableAsync(
        CartableFilterParams filterParams,
        string accessToken);

    Task<ServiceResult> SendOperationOtpAsync(
        SendOperationOtpRequest request,
        string accessToken);

    Task<ServiceResult> ApprovePaymentAsync(
        ApproveRequest request,
        string accessToken);

    Task<ServiceResult> SendBatchOperationOtpAsync(
        SendBatchOperationOtpRequest request,
        string accessToken);

    Task<ServiceResult> BatchApprovePaymentsAsync(
        BatchApproveRequest request,
        string accessToken);
}
