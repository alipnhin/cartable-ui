import apiClient from "@/lib/api-client";
import { MenuCountsResponse } from "@/types/api";

/**
 * سرویس Badge
 * شامل توابع مربوط به دریافت تعداد آیتم‌های منو برای نمایش Badge
 */

/**
 * دریافت تعداد آیتم‌های منو برای نمایش Badge
 * * @returns تعداد آیتم‌های هر منو
 *
 * @example
 * const counts = await getMenuCounts(token);
 * console.log(counts.myCartableCount); // 8
 * console.log(counts.managerCartableCount); // 3
 * console.log(counts.openPaymentOrdersCount); // 5
 */
export const getMenuCounts = async (): Promise<MenuCountsResponse> => {
  // TODO: کامنت زیر را بردارید وقتی backend آماده شد
  // const response = await apiClient.get<MenuCountsResponse>(
  //   `/v1/Badge/MenuCounts`
  // );
  // return response.data;

  // فعلاً مقادیر پیش‌فرض 0 برمی‌گردانیم
  // وقتی backend آماده شد، کامنت بالا را بردارید و این قسمت را حذف کنید
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        myCartableCount: 0,
        managerCartableCount: 0,
        openPaymentOrdersCount: 0,
      });
    }, 100);
  });
};
