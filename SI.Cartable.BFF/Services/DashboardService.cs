using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Dashboard;

namespace SI.Cartable.BFF.Services;

public class DashboardService : IDashboardService
{
    private readonly ITadbirPayService _tadbirPayService;

    public DashboardService(ITadbirPayService tadbirPayService)
    {
        _tadbirPayService = tadbirPayService;
    }

    public async Task<ServiceResult<TransactionProgressResponse>> GetTransactionProgressAsync(
        DashboardFilterParams filterParams,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<TransactionProgressResponse>(
            "v1-Cartable/Withdrawal/transaction-progress",
            accessToken,
            filterParams);

        if (!response.Success)
        {
            return ServiceResult<TransactionProgressResponse>.Fail(
                response.ErrorMessage ?? "خطا در دریافت پیشرفت تراکنش‌ها",
                response.StatusCode);
        }

        return ServiceResult<TransactionProgressResponse>.Success(
            response.Data ?? new TransactionProgressResponse());
    }
}
