/**
 * Account Group Service
 * سرویس مدیریت گروه‌های حساب
 */

import apiClient from "@/lib/api-client";
import {
  AccountGroup,
  AccountGroupDetail,
  CreateAccountGroupParams,
  EditAccountGroupParams,
  FilterAccountGroupsParams,
  FilterAccountGroupsResponse,
  ChangeAccountGroupStatusParams,
  AddGroupAccountsParams,
} from "@/types/account-group-types";

const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";

/**
 * واکشی لیست گروه‌های حساب (برای سلکت)
 */
export const getAccountGroups = async (
  accessToken: string
): Promise<AccountGroup[]> => {
  const response = await apiClient.get<AccountGroup[]>(
    "/v1-Cartable/ManageAccount/GetAccountGroups",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data.map((g) => ({
    ...g,
    id: g.id === EMPTY_GUID ? "all" : g.id,
  }));
};

/**
 * واکشی لیست گروه‌ها با فیلتر و صفحه‌بندی
 */
export const filterAccountGroups = async (
  params: FilterAccountGroupsParams,
  accessToken: string
): Promise<FilterAccountGroupsResponse> => {
  const response = await apiClient.post<FilterAccountGroupsResponse>(
    "/v1-Cartable/ManageAccount/FilterAccountGroups",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    }
  );

  return response.data;
};

/**
 * واکشی جزئیات یک گروه حساب
 */
export const getAccountGroupById = async (
  id: string,
  accessToken: string
): Promise<AccountGroupDetail> => {
  const response = await apiClient.get<AccountGroupDetail>(
    `/v1-Cartable/ManageAccount/GetAccountGroupById/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * ایجاد گروه حساب جدید
 */
export const createAccountGroup = async (
  params: CreateAccountGroupParams,
  accessToken: string
): Promise<string> => {
  const response = await apiClient.post<string>(
    "/v1-Cartable/ManageAccount/CreateAccountGroup",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    }
  );

  return response.data; // شناسه گروه ثبت شده
};

/**
 * ویرایش گروه حساب
 */
export const editAccountGroup = async (
  params: EditAccountGroupParams,
  accessToken: string
): Promise<string> => {
  const response = await apiClient.put<string>(
    "/v1-Cartable/ManageAccount/EditAccountGroup",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    }
  );

  return response.data;
};

/**
 * تغییر وضعیت گروه حساب
 */
export const changeAccountGroupStatus = async (
  params: ChangeAccountGroupStatusParams,
  accessToken: string
): Promise<string> => {
  const response = await apiClient.put<string>(
    "/v1-Cartable/ManageAccount/ChangeAccountGroupStatus",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    }
  );

  return response.data;
};

/**
 * حذف گروه حساب
 */
export const deleteAccountGroup = async (
  id: string,
  accessToken: string
): Promise<string> => {
  const response = await apiClient.delete<string>(
    `/v1-Cartable/ManageAccount/DeleteAccountGroups/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * افزودن حساب‌ها به گروه
 */
export const addGroupAccounts = async (
  params: AddGroupAccountsParams,
  accessToken: string
): Promise<string> => {
  const response = await apiClient.post<string>(
    "/v1-Cartable/ManageAccount/AddGroupAccounts",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json-patch+json",
      },
    }
  );

  return response.data;
};

/**
 * حذف حساب از گروه
 */
export const removeGroupAccount = async (
  itemId: string,
  accessToken: string
): Promise<string> => {
  const response = await apiClient.delete<string>(
    `/v1-Cartable/ManageAccount/RemoveItem/${itemId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
