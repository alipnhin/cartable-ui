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
export const getAccountGroups = async (): Promise<AccountGroup[]> => {
  const response = await apiClient.get<AccountGroup[]>("/AccountGroups");
  return response.data.map((g) => ({
    ...g,
    id: g.id === EMPTY_GUID ? "all" : g.id,
  }));
};

/**
 * واکشی لیست گروه‌ها با فیلتر و صفحه‌بندی
 */
export const filterAccountGroups = async (
  params: FilterAccountGroupsParams
): Promise<FilterAccountGroupsResponse> => {
  const response = await apiClient.post<FilterAccountGroupsResponse>(
    "/AccountGroups/filter",
    params
  );

  return response.data;
};

/**
 * واکشی جزئیات یک گروه حساب
 */
export const getAccountGroupById = async (
  id: string
): Promise<AccountGroupDetail> => {
  const response = await apiClient.get<AccountGroupDetail>(
    `/AccountGroups/${id}`
  );

  return response.data;
};

/**
 * ایجاد گروه حساب جدید
 */
export const createAccountGroup = async (
  params: CreateAccountGroupParams
): Promise<string> => {
  const response = await apiClient.post<string>("/AccountGroups", params);

  return response.data; // شناسه گروه ثبت شده
};

/**
 * ویرایش گروه حساب
 */
export const editAccountGroup = async (
  params: EditAccountGroupParams
): Promise<string> => {
  const response = await apiClient.put<string>("/AccountGroups", params);

  return response.data;
};

/**
 * تغییر وضعیت گروه حساب
 */
export const changeAccountGroupStatus = async (
  params: ChangeAccountGroupStatusParams
): Promise<string> => {
  const response = await apiClient.put<string>(
    "/AccountGroups/status",
    params
  );

  return response.data;
};

/**
 * حذف گروه حساب
 */
export const deleteAccountGroup = async (id: string): Promise<string> => {
  const response = await apiClient.delete<string>(`/AccountGroups/${id}`);

  return response.data;
};

/**
 * افزودن حساب‌ها به گروه
 */
export const addGroupAccounts = async (
  params: AddGroupAccountsParams
): Promise<string> => {
  const response = await apiClient.post<string>(
    "/AccountGroups/accounts",
    params
  );

  return response.data;
};

/**
 * حذف حساب از گروه
 */
export const removeGroupAccount = async (itemId: string): Promise<string> => {
  const response = await apiClient.delete<string>(
    `/AccountGroups/accounts/${itemId}`
  );

  return response.data;
};
