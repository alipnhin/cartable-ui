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
export const getAccountGroups = async (
  accessToken: string
): Promise<AccountGroup[]> => {
  // TODO: فعال‌سازی فراخوانی API بعد از آماده شدن
  /*
  const response = await apiClient.get<AccountGroup[]>(
    "/v1-Cartable/AccountGroup/GetList",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
  */

  // داده‌های موک برای تست
  // این داده‌ها بعد از آماده شدن API باید حذف شوند
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ACCOUNT_GROUPS);
    }, 300); // شبیه‌سازی تاخیر شبکه
  });
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
  // TODO: فعال‌سازی فراخوانی API بعد از آماده شدن
  /*
  const response = await apiClient.get<AccountGroup>(
    `/v1-Cartable/AccountGroup/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
  */

  // داده‌های موک
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const group = MOCK_ACCOUNT_GROUPS.find((g) => g.id === id);
      if (group) {
        resolve(group);
      } else {
        reject(new Error("گروه حساب یافت نشد"));
      }
    }, 300);
  });
};

/**
 * داده‌های موک برای گروه‌های حساب
 * این داده‌ها بعد از آماده شدن API باید حذف شوند
 *
 * گروه "all" به معنی "همه گروه‌ها" است و وقتی انتخاب شود، AccountGroupId با مقدار null ارسال می‌شود
 */
export const MOCK_ACCOUNT_GROUPS: AccountGroup[] = [
  {
    id: "all",
    title: "همه گروه‌ها",
    accountCount: 12,
    icon: "Layers",
    description: "تمام حساب‌های بانکی",
    color: "#6366f1",
  },
  {
    id: "group_operational",
    title: "حساب‌های عملیاتی",
    accountCount: 5,
    icon: "Briefcase",
    description: "حساب‌های مربوط به عملیات روزانه",
    color: "#10b981",
  },
  {
    id: "group_investment",
    title: "حساب‌های سرمایه‌گذاری",
    accountCount: 3,
    icon: "TrendingUp",
    description: "حساب‌های اختصاصی سرمایه‌گذاری",
    color: "#8b5cf6",
  },
  {
    id: "group_foreign",
    title: "حساب‌های ارزی",
    accountCount: 2,
    icon: "DollarSign",
    description: "حساب‌های ارز خارجی",
    color: "#f59e0b",
  },
  {
    id: "group_savings",
    title: "حساب‌های پس‌انداز",
    accountCount: 2,
    icon: "PiggyBank",
    description: "حساب‌های پس‌انداز بلندمدت",
    color: "#06b6d4",
  },
];
