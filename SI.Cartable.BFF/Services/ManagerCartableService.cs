using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.PaymentOrders;
using SI.Cartable.BFF.Models.Cartable;

namespace SI.Cartable.BFF.Services;

public class ManagerCartableService : IManagerCartableService
{
    private readonly ITadbirPayService _tadbirPayService;

    public ManagerCartableService(ITadbirPayService tadbirPayService)
    {
        _tadbirPayService = tadbirPayService;
    }

    public async Task<ServiceResult<PagedListResponse<PaymentListDto>>> GetManagerCartableAsync(
        CartableFilterParams filterParams,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<PagedListResponse<PaymentListDto>>(
            "v1-Cartable/Manager/ManagerCartable",
            accessToken,
            filterParams);

        if (!response.Success)
        {
            return ServiceResult<PagedListResponse<PaymentListDto>>.Fail(
                response.ErrorMessage ?? "خطا در دریافت کارتابل مدیر",
                response.StatusCode);
        }

        return ServiceResult<PagedListResponse<PaymentListDto>>.Success(
            response.Data );
    }

    public async Task<ServiceResult<string>> SendManagerOperationOtpAsync(
        SendOperationOtpRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            "v1-Cartable/Manager/SendOperationOtp",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در ارسال کد یکبار مصرف",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "کد یکبار مصرف با موفقیت ارسال شد");
    }

    public async Task<ServiceResult<string>> ManagerApprovePaymentAsync(
        ApproveRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            "v1-Cartable/Manager/Approve",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در تایید پرداخت",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "پرداخت با موفقیت تایید شد");
    }

    public async Task<ServiceResult<string>> SendManagerBatchOperationOtpAsync(
        SendBatchOperationOtpRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            "v1-Cartable/Manager/SendBatchOperationOtp",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در ارسال کد یکبار مصرف گروهی",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "کد یکبار مصرف گروهی با موفقیت ارسال شد");
    }

    public async Task<ServiceResult<string>> ManagerBatchApprovePaymentsAsync(
        BatchApproveRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            "v1-Cartable/Manager/BatchApprove",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در تایید گروهی پرداخت‌ها",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "پرداخت‌ها با موفقیت به صورت گروهی تایید شدند");
    }
}
