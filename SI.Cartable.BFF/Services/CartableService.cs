using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Services;

public class CartableService : ICartableService
{
    private readonly ITadbirPayService _tadbirPayService;

    public CartableService(ITadbirPayService tadbirPayService)
    {
        _tadbirPayService = tadbirPayService;
    }

    public async Task<ServiceResult<PagedListResponse<PaymentListDto>>> GetApproverCartableAsync(
        CartableFilterParams filterParams,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<PagedListResponse<PaymentListDto>>(
            "v1-Cartable/Approver/ApproverCartable",
            accessToken,
            filterParams);

        if (!response.Success)
        {
            return ServiceResult<PagedListResponse<PaymentListDto>>.Fail(
                response.ErrorMessage ?? "خطا در دریافت کارتابل تاییدکننده",
                response.StatusCode);
        }

        return ServiceResult<PagedListResponse<PaymentListDto>>.Success(
            response.Data );
    }

    public async Task<ServiceResult> SendOperationOtpAsync(
        SendOperationOtpRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync(
            "v1-Cartable/Approver/SendOperationOtp",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در ارسال کد یکبار مصرف",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "کد یکبار مصرف با موفقیت ارسال شد");
    }

    public async Task<ServiceResult> ApprovePaymentAsync(
        ApproveRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync(
            "v1-Cartable/Approver/Approve",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در تایید پرداخت",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "پرداخت با موفقیت تایید شد");
    }

    public async Task<ServiceResult> SendBatchOperationOtpAsync(
        SendBatchOperationOtpRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync(
            "v1-Cartable/Approver/SendBatchOperationOtp",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در ارسال کد یکبار مصرف گروهی",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "کد یکبار مصرف گروهی با موفقیت ارسال شد");
    }

    public async Task<ServiceResult> BatchApprovePaymentsAsync(
        BatchApproveRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync(
            "v1-Cartable/Approver/BatchApprove",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در تایید گروهی پرداخت‌ها",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "پرداخت‌ها با موفقیت به صورت گروهی تایید شدند");
    }
}
