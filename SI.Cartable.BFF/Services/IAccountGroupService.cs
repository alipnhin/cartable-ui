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

    Task<ServiceResult<string>> CreateAccountGroupAsync(
        CreateAccountGroupParams request,
        string accessToken);

    Task<ServiceResult<string>> EditAccountGroupAsync(
        EditAccountGroupParams request,
        string accessToken);

    Task<ServiceResult<string>> ChangeAccountGroupStatusAsync(
        ChangeAccountGroupStatusParams request,
        string accessToken);

    Task<ServiceResult<string>> DeleteAccountGroupAsync(
        string id,
        string accessToken);

    Task<ServiceResult<string>> AddGroupAccountsAsync(
        AddGroupAccountsParams request,
        string accessToken);

    Task<ServiceResult<string>> RemoveGroupAccountAsync(
        string itemId,
        string accessToken);
}
