using SI.Cartable.BFF.Models.UserProfile;
using SI.Cartable.BFF.Models.Common;

namespace SI.Cartable.BFF.Services;

public interface IUserProfileService
{
    Task<ServiceResult<UserInfoResponse>> GetUserInfoAsync(string accessToken);
}
