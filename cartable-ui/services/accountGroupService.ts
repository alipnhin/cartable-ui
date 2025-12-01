/**
 * Account Group Service
 * سرویس مدیریت گروه‌های حساب
 *
 * این سرویس شامل توابع مربوط به واکشی و مدیریت گروه‌های حساب است.
 * در حال حاضر از داده‌های موک استفاده می‌شود و بعد از آماده شدن API، کد فراخوانی سرویس باید از حالت کامنت خارج شود.
 *
 * @module services/accountGroupService
 */

import apiClient from "@/lib/api-client";
import { AccountGroup } from "@/types/account";

/**
 * واکشی لیست گروه‌های حساب
 *
 * این تابع لیست تمام گروه‌های حساب را از سرور دریافت می‌کند.
 * در حال حاضر از داده‌های موک استفاده می‌شود.
 *
 * @param accessToken - توکن دسترسی کاربر
 * @returns لیست گروه‌های حساب
 *
 * @example
 * ```tsx
 * const { data: session } = useSession();
 * const groups = await getAccountGroups(session.accessToken);
 * ```
 */
const EMPTY_GUID = "00000000-0000-0000-0000-000000000000";
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
  // Normalize here
  return response.data.map((g) => ({
    ...g,
    id: g.id === EMPTY_GUID ? "all" : g.id,
  }));
};

/**
 * واکشی جزئیات یک گروه حساب
 *
 * این تابع اطلاعات کامل یک گروه حساب را بر اساس شناسه آن دریافت می‌کند.
 *
 * @param id - شناسه گروه حساب
 * @param accessToken - توکن دسترسی کاربر
 * @returns جزئیات گروه حساب
 *
 * @example
 * ```tsx
 * const groupDetails = await getAccountGroupById("group_1", token);
 * ```
 */
export const getAccountGroupById = async (
  id: string,
  accessToken: string
): Promise<AccountGroup> => {
  const response = await apiClient.get<AccountGroup>(
    `/v1-Cartable/ManageAccount/GetAccountGroupById/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
