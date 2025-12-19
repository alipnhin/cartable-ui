using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.AccountGroups;

namespace SI.Cartable.BFF.Services;

public class AccountGroupService : IAccountGroupService
{
    private readonly ITadbirPayService _tadbirPayService;
    private const string EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

    public AccountGroupService(ITadbirPayService tadbirPayService)
    {
        _tadbirPayService = tadbirPayService;
    }

    public async Task<ServiceResult<List<AccountGroup>>> GetAccountGroupsAsync(string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<List<AccountGroup>>(
            "v1-Cartable/ManageAccount/GetAccountGroups",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<List<AccountGroup>>.Fail(
                response.ErrorMessage ?? "خطا در دریافت لیست گروه‌های حساب",
                response.StatusCode);
        }

        var groups = response.Data ?? new List<AccountGroup>();

        // Replace empty GUID with "all"
        //var processedGroups = groups.Select(g => new AccountGroup
        //{
        //    Id = g.Id == EMPTY_GUID ? "all" : g.Id,
        //    Title = g.Title,
        //    Description = g.Description,
        //    Color = g.Color,
        //    Icon = g.Icon,
        //    IsActive = g.IsActive,
        //    AccountCount = g.AccountCount
        //}).ToList();

        return ServiceResult<List<AccountGroup>>.Success(groups);
    }

    public async Task<ServiceResult<PagedListResponse<AccountGroup>>> FilterAccountGroupsAsync(
        FilterAccountGroupsParams filterParams,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<PagedListResponse<AccountGroup>>(
            "v1-Cartable/ManageAccount/FilterAccountGroups",
            accessToken,
            filterParams);

        if (!response.Success)
        {
            return ServiceResult<PagedListResponse<AccountGroup>>.Fail(
                response.ErrorMessage ?? "خطا در فیلتر گروه‌های حساب",
                response.StatusCode);
        }

        return ServiceResult<PagedListResponse<AccountGroup>>.Success(response.Data);
    }

    public async Task<ServiceResult<AccountGroupDetail>> GetAccountGroupByIdAsync(
        string id,
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<AccountGroupDetail>(
            $"v1-Cartable/ManageAccount/GetAccountGroupById/{id}",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<AccountGroupDetail>.Fail(
                response.ErrorMessage ?? "خطا در دریافت جزئیات گروه حساب",
                response.StatusCode);
        }

        return ServiceResult<AccountGroupDetail>.Success(
            response.Data ?? new AccountGroupDetail());
    }

    public async Task<ServiceResult<string>> CreateAccountGroupAsync(
        CreateAccountGroupParams request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            "v1-Cartable/ManageAccount/CreateAccountGroup",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در ایجاد گروه حساب",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "گروه حساب با موفقیت ایجاد شد");
    }

    public async Task<ServiceResult> EditAccountGroupAsync(
        EditAccountGroupParams request,
        string accessToken)
    {
        var response = await _tadbirPayService.PutAsync(
            "v1-Cartable/ManageAccount/EditAccountGroup",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در ویرایش گروه حساب",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "گروه حساب با موفقیت ویرایش شد");
    }

    public async Task<ServiceResult> ChangeAccountGroupStatusAsync(
        ChangeAccountGroupStatusParams request,
        string accessToken)
    {
        var response = await _tadbirPayService.PutAsync(
            "v1-Cartable/ManageAccount/ChangeAccountGroupStatus",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در تغییر وضعیت گروه حساب",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "وضعیت گروه حساب با موفقیت تغییر یافت");
    }

    public async Task<ServiceResult> DeleteAccountGroupAsync(
        string id,
        string accessToken)
    {
        var response = await _tadbirPayService.DeleteAsync(
            $"v1-Cartable/ManageAccount/DeleteAccountGroups/{id}",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در حذف گروه حساب",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "گروه حساب با موفقیت حذف شد");
    }

    public async Task<ServiceResult> AddGroupAccountsAsync(
        AddGroupAccountsParams request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync(
            "v1-Cartable/ManageAccount/AddGroupAccounts",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در افزودن حساب‌ها به گروه",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "حساب‌ها با موفقیت به گروه اضافه شدند");
    }

    public async Task<ServiceResult> RemoveGroupAccountAsync(
        string itemId,
        string accessToken)
    {
        var response = await _tadbirPayService.DeleteAsync(
            $"v1-Cartable/ManageAccount/RemoveItem/{itemId}",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult.Fail(
                response.Message ?? "خطا در حذف حساب از گروه",
                response.StatusCode);
        }

        return ServiceResult.Success(
            response.Message ?? "حساب با موفقیت از گروه حذف شد");
    }
}
