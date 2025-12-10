using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Dashboard;

namespace SI.Cartable.BFF.Services;

public interface IDashboardService
{
    Task<ServiceResult<TransactionProgressResponse>> GetTransactionProgressAsync(
        DashboardFilterParams filterParams,
        string accessToken);
}
