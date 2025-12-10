using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.PaymentOrders;
using System.Net.Http.Json;

namespace SI.Cartable.BFF.Services;

public class PaymentOrdersService : IPaymentOrdersService
{
    private readonly ITadbirPayService _tadbirPayService;

    public PaymentOrdersService(ITadbirPayService tadbirPayService)
    {
        _tadbirPayService = tadbirPayService;
    }

    public async Task<ServiceResult<PagedListResponse<PaymentListDto>>> SearchPaymentOrdersAsync(
        CartableFilterParams filterParams,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<PagedListResponse<PaymentListDto>>(
            "v1-Cartable/Withdrawal/Search",
            accessToken,
            filterParams);

        if (!response.Success)
        {
            return ServiceResult<PagedListResponse<PaymentListDto>>.Fail(
                response.ErrorMessage ?? "خطا در جستجوی دستورات پرداخت",
                response.StatusCode);
        }

        return ServiceResult<PagedListResponse<PaymentListDto>>.Success(
            response.Data);
    }

    public async Task<ServiceResult<WithdrawalOrderDetails>> GetWithdrawalOrderDetailsAsync(
        string id,
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<WithdrawalOrderDetails>(
            $"v1-Cartable/Withdrawal/{id}/find",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<WithdrawalOrderDetails>.Fail(
                response.ErrorMessage ?? "خطا در دریافت جزئیات دستور پرداخت",
                response.StatusCode);
        }

        return ServiceResult<WithdrawalOrderDetails>.Success(
            response.Data ?? new WithdrawalOrderDetails());
    }

    public async Task<ServiceResult<TransactionStatisticsResponseDto>> GetWithdrawalStatisticsAsync(
        string id,
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<TransactionStatisticsResponseDto>(
            $"v1-Cartable/Withdrawal/{id}/statistics/complete",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<TransactionStatisticsResponseDto>.Fail(
                response.ErrorMessage ?? "خطا در دریافت آمار دستور پرداخت",
                response.StatusCode);
        }

        return ServiceResult<TransactionStatisticsResponseDto>.Success(
            response.Data ?? new TransactionStatisticsResponseDto());
    }

    public async Task<ServiceResult<string>> InquiryOrderByIdAsync(
        string orderId,
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<string>(
            $"v1-Cartable/Withdrawal/InquiryById/{orderId}",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در استعلام دستور پرداخت",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "استعلام با موفقیت انجام شد");
    }

    public async Task<ServiceResult<string>> SendToBankAsync(
        string orderId,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            $"v1-Cartable/Withdrawal/SendToBank/{orderId}",
            accessToken,
            null);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در ارسال به بانک",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "دستور با موفقیت به بانک ارسال شد");
    }

    public async Task<ServiceResult<PagedListResponse<WithdrawalTransaction>>> GetWithdrawalTransactionsAsync(
        TransactionFilterParams filterParams,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<PagedListResponse<WithdrawalTransaction>>(
            "v1-Cartable/Withdrawal/GetWithdrawalTransactions",
            accessToken,
            filterParams);

        if (!response.Success)
        {
            return ServiceResult<PagedListResponse<WithdrawalTransaction>>.Fail(
                response.ErrorMessage ?? "خطا در دریافت لیست تراکنش‌ها",
                response.StatusCode);
        }

        return ServiceResult<PagedListResponse<WithdrawalTransaction>>.Success(
            response.Data );
    }

    public async Task<ServiceResult<WithdrawalTransaction>> GetTransactionDetailsAsync(
        string transactionId,
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<WithdrawalTransaction>(
            $"v1-Cartable/Withdrawal/FindTransaction/{transactionId}",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<WithdrawalTransaction>.Fail(
                response.ErrorMessage ?? "خطا در دریافت جزئیات تراکنش",
                response.StatusCode);
        }

        return ServiceResult<WithdrawalTransaction>.Success(
            response.Data ?? new WithdrawalTransaction());
    }

    public async Task<ServiceResult<WithdrawalTransaction>> InquiryTransactionByIdAsync(
        string transactionId,
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<WithdrawalTransaction>(
            $"v1-Cartable/Withdrawal/TransactionInquiryById/{transactionId}",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<WithdrawalTransaction>.Fail(
                response.ErrorMessage ?? "خطا در استعلام تراکنش",
                response.StatusCode);
        }

        return ServiceResult<WithdrawalTransaction>.Success(
            response.Data ?? new WithdrawalTransaction());
    }

    public async Task<ServiceResult<byte[]>> ExportOrderTransactionsToExcelAsync(
        string orderId,
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<byte[]>(
            $"v1-Cartable/Withdrawal/ExportTransaction/{orderId}",
            accessToken);

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
