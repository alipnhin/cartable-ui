"use client";

/**
 * React Query Hook for Cartable Pages
 * مدیریت یکپارچه داده‌های کارتابل با React Query
 * جایگزین useCartableData custom hook
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getApproverCartable } from "@/services/cartableService";
import { getManagerCartable } from "@/services/managerCartableService";
import { mapPaymentListDtosToPaymentOrders } from "@/lib/api-mappers";
import {
  useAccountGroupStore,
  useAccountGroupStoreHydration,
} from "@/store/account-group-store";
import type { CartableFilterParams, PaymentListResponse } from "@/types/api";
import type { PaymentOrder } from "@/types/order";
import { queryKeys } from "@/lib/react-query";

/**
 * نوع API function برای fetch کردن داده‌ها
 */
type CartableFetchFunction = (
  params: CartableFilterParams
) => Promise<PaymentListResponse>;

interface UseCartableQueryOptions {
  /**
   * تابع fetch کردن داده‌ها
   * می‌تواند getApproverCartable یا getManagerCartable باشد
   */
  fetchFunction: CartableFetchFunction;

  /**
   * تعداد آیتم در هر صفحه اولیه
   * @default 10
   */
  initialPageSize?: number;

  /**
   * نوع کارتابل (برای query key)
   * "my" = کارتابل من
   * "manager" = کارتابل مدیر
   */
  cartableType: "my" | "manager";
}

interface UseCartableQueryReturn {
  /** آرایه دستورات پرداخت map شده */
  orders: PaymentOrder[];

  /** وضعیت loading */
  isLoading: boolean;

  /** پیام خطا (اگر وجود داشته باشد) */
  error: Error | null;

  /** شماره صفحه فعلی */
  pageNumber: number;

  /** تعداد آیتم در هر صفحه */
  pageSize: number;

  /** تعداد کل آیتم‌ها */
  totalItems: number;

  /** تعداد کل صفحات */
  totalPages: number;

  /** تابع تغییر شماره صفحه */
  setPageNumber: (page: number) => void;

  /** تابع تغییر تعداد آیتم در صفحه */
  setPageSize: (size: number) => void;

  /** تابع refetch داده‌ها */
  reloadData: () => Promise<void>;
}

/**
 * Hook برای مدیریت داده‌های کارتابل با React Query
 *
 * @example
 * ```tsx
 * // کارتابل من
 * const { orders, isLoading, error, reloadData } = useCartableQuery({
 *   fetchFunction: getApproverCartable,
 *   cartableType: "my",
 * });
 *
 * // کارتابل مدیر
 * const { orders, isLoading, error, reloadData } = useCartableQuery({
 *   fetchFunction: getManagerCartable,
 *   cartableType: "manager",
 * });
 * ```
 */
export function useCartableQuery({
  fetchFunction,
  initialPageSize = 10,
  cartableType,
}: UseCartableQueryOptions): UseCartableQueryReturn {
  const { data: session } = useSession();
  const selectedGroup = useAccountGroupStore((s) => s.selectedGroup);
  const isHydrated = useAccountGroupStoreHydration();

  // مدیریت pagination در state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // ساخت پارامترهای query
  const queryParams: CartableFilterParams = {
    pageNumber,
    pageSize,
    orderBy: "createdDateTime",
    accountGroupId: selectedGroup?.id || undefined,
  };

  // استفاده از React Query
  const {
    data: apiResponse,
    isLoading,
    error,
    refetch,
  } = useQuery<PaymentListResponse, Error>({
    // کلید منحصر به فرد برای این query
    queryKey:
      cartableType === "my"
        ? queryKeys.cartable.myCartable(queryParams)
        : queryKeys.cartable.managerCartable(queryParams),

    // تابع fetch کردن داده‌ها
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await fetchFunction(queryParams);
    },

    // query فقط زمانی فعال است که:
    // 1. accessToken موجود باشد
    // 2. store hydrate شده باشد
    enabled: !!session?.accessToken && isHydrated,

    // Global settings: staleTime: 0, gcTime: 0, refetchOnMount: true, refetchOnWindowFocus: true
  });

  // تابع reload داده‌ها
  const reloadData = async () => {
    await refetch();
  };

  // استخراج داده‌ها و map کردن
  const orders = apiResponse?.items
    ? mapPaymentListDtosToPaymentOrders(apiResponse.items)
    : [];

  const totalItems = apiResponse?.totalItemCount || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    orders,
    isLoading,
    error,
    pageNumber,
    pageSize,
    totalItems,
    totalPages,
    setPageNumber,
    setPageSize,
    reloadData,
  };
}
