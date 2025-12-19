using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.AccountGroups;

namespace SI.Cartable.BFF.Services;

public interface IAccountGroupService
{
    Task<ServiceResult<List<AccountGroup>>> GetAccountGroupsAsync(string accessToken);

    Task<ServiceResult<PagedListResponse<AccountGroup>>> FilterAccountGroupsAsync(
        FilterAccountGroupsParams filterParams,
        string accessToken);

    Task<ServiceResult<AccountGroupDetail>> GetAccountGroupByIdAsync(
        string id,
        string accessToken);

    Task<ServiceResult> CreateAccountGroupAsync(
        CreateAccountGroupParams request,
        string accessToken);

    Task<ServiceResult> EditAccountGroupAsync(
        EditAccountGroupParams request,
        string accessToken);

    Task<ServiceResult> ChangeAccountGroupStatusAsync(
        ChangeAccountGroupStatusParams request,
        string accessToken);

    Task<ServiceResult> DeleteAccountGroupAsync(
        string id,
        string accessToken);

    Task<ServiceResult> AddGroupAccountsAsync(
        AddGroupAccountsParams request,
        string accessToken);

    Task<ServiceResult> RemoveGroupAccountAsync(
        string itemId,
        string accessToken);
}
