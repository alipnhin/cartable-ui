using SI.Cartable.BFF.Models.Accounts;
using SI.Cartable.BFF.Models.Common;
using SI.Cartable.BFF.Models.Select;

namespace SI.Cartable.BFF.Services;

public class AccountService : IAccountService
{
    private readonly ITadbirPayService _tadbirPayService;

    public AccountService(ITadbirPayService tadbirPayService)
    {
        _tadbirPayService = tadbirPayService;
    }

    public async Task<ServiceResult<List<AccountListItem>>> GetAccountsListAsync(
        string accessToken,
        string? accountGroupId = null)
    {
        var url = "v1-Cartable/ManageAccount/GetList";
        if (!string.IsNullOrEmpty(accountGroupId) && accountGroupId != "all")
        {
            url += $"?accountGroupId={accountGroupId}";
        }

        var response = await _tadbirPayService.GetAsync<List<AccountListItem>>(url, accessToken);

        if (!response.Success)
        {
            return ServiceResult<List<AccountListItem>>.Fail(
                response.ErrorMessage ?? "خطا در دریافت لیست حساب‌ها",
                response.StatusCode);
        }

        return ServiceResult<List<AccountListItem>>.Success(
            response.Data ?? new List<AccountListItem>());
    }

    public async Task<ServiceResult<AccountDetailResponse>> GetAccountDetailAsync(
        string id,
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<AccountDetailResponse>(
            $"v1-Cartable/ManageAccount/{id}/find",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<AccountDetailResponse>.Fail(
                response.ErrorMessage ?? "خطا در دریافت جزئیات حساب",
                response.StatusCode);
        }

        return ServiceResult<AccountDetailResponse>.Success(
            response.Data ?? new AccountDetailResponse());
    }

    public async Task<ServiceResult<string>> ChangeMinimumSignatureAsync(
        ChangeMinimumSignatureRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            "v1-Cartable/ManageAccount/ChangeMinimumSignature",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در تغییر حداقل تعداد امضا",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "حداقل تعداد امضا با موفقیت تغییر یافت");
    }

    public async Task<ServiceResult<string>> AddSignerAsync(
        AddSignerRequest request,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            "v1-Cartable/ManageAccount",
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در افزودن امضادار",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "امضادار با موفقیت اضافه شد");
    }

    public async Task<ServiceResult<List<UserSelectItem>>> GetUsersListAsync(
        string accessToken)
    {
        var response = await _tadbirPayService.GetAsync<List<UserSelectItem>>(
            "v1-Cartable/ManageAccount/GetUsers",
            accessToken);

        if (!response.Success)
        {
            return ServiceResult<List<UserSelectItem>>.Fail(
                response.ErrorMessage ?? "خطا در دریافت لیست کاربران",
                response.StatusCode);
        }

        return ServiceResult<List<UserSelectItem>>.Success(
            response.Data ?? new List<UserSelectItem>());
    }

    public async Task<ServiceResult<string>> DisableSignerAsync(
        string signerId,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            $"v1-Cartable/ManageAccount/DisableApproverStatus/{signerId}",
            accessToken,
            null);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در غیرفعال کردن امضادار",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "امضادار با موفقیت غیرفعال شد");
    }

    public async Task<ServiceResult<string>> EnableSignerAsync(
        string signerId,
        string accessToken)
    {
        var response = await _tadbirPayService.PostAsync<string>(
            $"v1-Cartable/ManageAccount/EnableApproverStatus/{signerId}",
            accessToken,
            null);

        if (!response.Success)
        {
            return ServiceResult<string>.Fail(
                response.ErrorMessage ?? "خطا در فعال کردن امضادار",
                response.StatusCode);
        }

        return ServiceResult<string>.Success(
            response.Data ?? "امضادار با موفقیت فعال شد");
    }



    public async Task<ServiceResult<SelectResponse>> AccountSelectAsync(
        SelectRequest request,
        string? accountGroupId,
        string accessToken)
    {

        var url = "v1-Cartable/ManageAccount/SelectData";
        if (!string.IsNullOrEmpty(accountGroupId) && accountGroupId != "all")
        {
            url += $"?accountGroupId={accountGroupId}";
        }

        var response = await _tadbirPayService.PostAsync<SelectResponse>(
            url,
            accessToken,
            request);

        if (!response.Success)
        {
            return ServiceResult<SelectResponse>.Fail(
                response.ErrorMessage ?? "خطا در تغییر حداقل تعداد امضا",
                response.StatusCode);
        }

        return ServiceResult<SelectResponse>.Success(
            response.Data ?? new SelectResponse());
    }


}
