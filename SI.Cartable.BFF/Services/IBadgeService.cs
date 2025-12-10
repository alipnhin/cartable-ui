using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Badge;

namespace SI.Cartable.BFF.Services;

public interface IBadgeService
{
    Task<ServiceResult<MenuCountsResponse>> GetMenuCountsAsync(string accessToken);
}
