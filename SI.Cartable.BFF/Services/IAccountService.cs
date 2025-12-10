using SI.Cartable.BFF.Models.Accounts;
using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Select;

namespace SI.Cartable.BFF.Services;

public interface IAccountService
{
    Task<ServiceResult<List<AccountListItem>>> GetAccountsListAsync(
        string accessToken,
        string? accountGroupId = null);

    Task<ServiceResult<AccountDetailResponse>> GetAccountDetailAsync(
        string id,
        string accessToken);

    Task<ServiceResult<string>> ChangeMinimumSignatureAsync(
        ChangeMinimumSignatureRequest request,
        string accessToken);

    Task<ServiceResult<string>> AddSignerAsync(
        AddSignerRequest request,
        string accessToken);

    Task<ServiceResult<List<UserSelectItem>>> GetUsersListAsync(
        string accessToken);

    Task<ServiceResult<string>> DisableSignerAsync(
        string signerId,
        string accessToken);

    Task<ServiceResult<string>> EnableSignerAsync(
        string signerId,
        string accessToken);

    Task<ServiceResult<SelectResponse>> AccountSelectAsync(
        SelectRequest request,
        string? accountGroupId,
        string accessToken);
}
