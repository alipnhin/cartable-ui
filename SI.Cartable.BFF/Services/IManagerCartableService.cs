using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Services;

public interface IManagerCartableService
{
    Task<ServiceResult<PagedListResponse<PaymentListDto>>> GetManagerCartableAsync(
        CartableFilterParams filterParams,
        string accessToken);

    Task<ServiceResult<string>> SendManagerOperationOtpAsync(
        SendOperationOtpRequest request,
        string accessToken);

    Task<ServiceResult<string>> ManagerApprovePaymentAsync(
        ApproveRequest request,
        string accessToken);

    Task<ServiceResult<string>> SendManagerBatchOperationOtpAsync(
        SendBatchOperationOtpRequest request,
        string accessToken);

    Task<ServiceResult<string>> ManagerBatchApprovePaymentsAsync(
        BatchApproveRequest request,
        string accessToken);
}
