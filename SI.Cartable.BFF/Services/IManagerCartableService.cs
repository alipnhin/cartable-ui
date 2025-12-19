using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Services;

public interface IManagerCartableService
{
    Task<ServiceResult<PagedListResponse<PaymentListDto>>> GetManagerCartableAsync(
        CartableFilterParams filterParams,
        string accessToken);

    Task<ServiceResult> SendManagerOperationOtpAsync(
        SendOperationOtpRequest request,
        string accessToken);

    Task<ServiceResult> ManagerApprovePaymentAsync(
        ApproveRequest request,
        string accessToken);

    Task<ServiceResult> SendManagerBatchOperationOtpAsync(
        SendBatchOperationOtpRequest request,
        string accessToken);

    Task<ServiceResult> ManagerBatchApprovePaymentsAsync(
        BatchApproveRequest request,
        string accessToken);
}
