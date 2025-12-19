"use client";

/**
 * React Query Hook for Dashboard
 * مدیریت یکپارچه داده‌های داشبورد با React Query
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getTransactionProgress } from "@/services/dashboardService";
import type {
  TransactionProgressResponse,
  DashboardFilterParams,
} from "@/types/dashboard";
import { queryKeys } from "@/lib/react-query";

interface UseDashboardQueryOptions {
  filters: DashboardFilterParams;
  enabled?: boolean;
}

/**
 * Hook برای دریافت داده‌های داشبورد
 *
 * @param filters - فیلترهای داشبورد (تاریخ، درگاه، گروه حساب)
 * @param enabled - فعال یا غیرفعال بودن query (پیش‌فرض: true)
 * @returns داده‌ها، وضعیت loading، خطا و تابع refetch
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = useDashboardQuery({
 *   filters: {
 *     fromDate: '2024-01-01',
 *     toDate: '2024-01-31',
 *     bankGatewayId: '123',
 *   }
 * });
 * ```
 */
export function useDashboardQuery({
  filters,
  enabled = true,
}: UseDashboardQueryOptions) {
  const { data: session } = useSession();

  return useQuery<TransactionProgressResponse, Error>({
    // کلید منحصر به فرد برای این query
    queryKey: queryKeys.dashboard.transactionProgress(filters),

    // تابع fetch کردن داده‌ها
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      return await getTransactionProgress(filters, session.accessToken);
    },

    // query فقط زمانی فعال است که:
    // 1. enabled: true باشد
    // 2. accessToken موجود باشد
    enabled: enabled && !!session?.accessToken,

    // اگر mount شد refetch نکند (در صورت داشتن cache)
    refetchOnMount: true,

    // اگر window focus شد refetch نکند
    refetchOnWindowFocus: false,

    // داده‌های داشبورد بعد از 1 دقیقه قدیمی می‌شوند
    staleTime: 60 * 1000,

    // کش را برای 5 دقیقه نگه‌داری کن
    gcTime: 5 * 60 * 1000,
  });
}

/**
 * Helper function برای گرفتن فیلترهای پیش‌فرض داشبورد
 * (7 روز گذشته)
 */
export function getDefaultDashboardFilters(): DashboardFilterParams {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return {
    bankGatewayId: undefined,
    fromDate: weekAgo.toISOString(),
    toDate: today.toISOString(),
  };
}
