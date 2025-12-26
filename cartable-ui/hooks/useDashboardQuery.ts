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
import {
  useAccountGroupStore,
  useAccountGroupStoreHydration,
} from "@/store/account-group-store";

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
  const selectedGroup = useAccountGroupStore((s) => s.selectedGroup);
  const isHydrated = useAccountGroupStoreHydration();

  // ترکیب فیلترها با گروه انتخابی از store
  const queryParams: DashboardFilterParams = {
    ...filters,
    accountGroupId: selectedGroup?.id || undefined,
  };

  return useQuery<TransactionProgressResponse, Error>({
    // کلید منحصر به فرد برای این query - شامل accountGroupId
    queryKey: queryKeys.dashboard.transactionProgress(queryParams),

    // تابع fetch کردن داده‌ها
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      return await getTransactionProgress(queryParams);
    },

    // query فقط زمانی فعال است که:
    // 1. enabled: true باشد
    // 2. accessToken موجود باشد
    // 3. store hydrate شده باشد
    enabled: enabled && !!session?.accessToken && isHydrated,

    // ⚠️ NO CACHE - سیستم مالی (از تنظیمات global استفاده می‌شود)
    // Global settings: staleTime: 0, gcTime: 0, refetchOnMount: true, refetchOnWindowFocus: true
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
