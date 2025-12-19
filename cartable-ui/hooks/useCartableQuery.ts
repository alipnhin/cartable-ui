"use client";

/**
 * React Query Hook for Cartable Pages
 * مدیریت یکپارچه داده‌های کارتابل با React Query
 * جایگزین useCartableData custom hook
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getApproverCartable } from "@/services/cartableService";
import { getManagerCartable } from "@/services/managerCartableService";
import { mapPaymentListDtosToPaymentOrders } from "@/lib/api-mappers";
import { useAccountGroupStore } from "@/store/account-group-store";
import type { CartableFilterParams, PaymentListResponse } from "@/types/api";
import type { PaymentOrder } from "@/types/order";
import { queryKeys } from "@/lib/react-query";

/**
 * نوع API function برای fetch کردن داده‌ها
 */
type CartableFetchFunction = (
  params: CartableFilterParams,
  accessToken: string
) => Promise<PaymentListResponse>;

interface UseCartableQueryOptions {
  /**
   * تابع fetch کردن داده‌ها
   * می‌تواند getApproverCartable یا getManagerCartable باشد
   */
  fetchFunction: CartableFetchFunction;

  /**
   * تعداد آیتم در هر صفحه
   * @default 10
   */
  pageSize?: number;

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

  /** تعداد کل آیتم‌ها */
  totalItems: number;

  /** تعداد کل صفحات */
  totalPages: number;

  /** تابع تغییر شماره صفحه */
  setPageNumber: (page: number) => void;

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
  pageSize = 10,
  cartableType,
}: UseCartableQueryOptions): UseCartableQueryReturn {
  const { data: session } = useSession();
  const groupId = useAccountGroupStore((s) => s.groupId);

  // مدیریت pagination در state
  const [pageNumber, setPageNumber] = useState(1);

  // خواندن groupId از localStorage برای همگام‌سازی
  const [savedGroupId, setSavedGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selected-account-group");
      setSavedGroupId(stored);
    }
  }, [groupId]);

  // ساخت پارامترهای query
  const queryParams: CartableFilterParams = {
    pageNumber,
    pageSize,
    orderBy: "createdDateTime",
    accountGroupId: savedGroupId || undefined,
  };

  // استفاده از React Query
  const {
    data: response,
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

      return await fetchFunction(queryParams, session.accessToken);
    },

    // query فقط زمانی فعال است که accessToken موجود باشد
    enabled: !!session?.accessToken,

    // اگر mount شد refetch نکند (در صورت داشتن cache)
    refetchOnMount: true,

    // اگر window focus شد refetch نکند
    refetchOnWindowFocus: false,

    // داده‌های کارتابل بعد از 30 ثانیه قدیمی می‌شوند
    staleTime: 30 * 1000,

    // کش را برای 5 دقیقه نگه‌داری کن
    gcTime: 5 * 60 * 1000,
  });

  // Map کردن response به PaymentOrder[]
  const orders: PaymentOrder[] = response?.items
    ? mapPaymentListDtosToPaymentOrders(response.items)
    : [];

  // تابع reload داده‌ها
  const reloadData = async () => {
    await refetch();
  };

  return {
    orders,
    isLoading,
    error,
    pageNumber,
    totalItems: response?.totalItemCount || 0,
    totalPages: response?.totalPageCount || 0,
    setPageNumber,
    reloadData,
  };
}
