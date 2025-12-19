"use client";

/**
 * React Query Hook for Payment Orders Page
 * مدیریت یکپارچه داده‌های دستورات پرداخت با React Query
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { searchPaymentOrders } from "@/services/paymentOrdersService";
import { mapPaymentListDtosToPaymentOrders } from "@/lib/api-mappers";
import type { CartableFilterParams, PaymentListResponse } from "@/types/api";
import type { PaymentOrder } from "@/types/order";
import { queryKeys } from "@/lib/react-query";

interface UsePaymentOrdersQueryOptions {
  /**
   * پارامترهای فیلتر شامل pagination, sorting, و فیلترهای جستجو
   */
  filterParams: CartableFilterParams;

  /**
   * غیرفعال کردن query (در صورت نیاز)
   * @default true
   */
  enabled?: boolean;
}

interface UsePaymentOrdersQueryReturn {
  /** آرایه دستورات پرداخت map شده */
  orders: PaymentOrder[];

  /** وضعیت loading */
  isLoading: boolean;

  /** پیام خطا (اگر وجود داشته باشد) */
  error: Error | null;

  /** تعداد کل آیتم‌ها */
  totalItems: number;

  /** تعداد کل صفحات */
  totalPages: number;

  /** تابع refetch داده‌ها */
  refetch: () => Promise<void>;
}

/**
 * Hook برای مدیریت داده‌های دستورات پرداخت با React Query
 *
 * @example
 * ```tsx
 * const { orders, isLoading, error, refetch } = usePaymentOrdersQuery({
 *   filterParams: {
 *     pageNumber: 1,
 *     pageSize: 10,
 *     orderBy: 'createdDateTime desc',
 *     trackingId: '12345',
 *     status: PaymentStatusEnum.WaitingForOwnersApproval,
 *     fromDate: '2024-01-01',
 *     toDate: '2024-12-31',
 *   }
 * });
 * ```
 */
export function usePaymentOrdersQuery({
  filterParams,
  enabled = true,
}: UsePaymentOrdersQueryOptions): UsePaymentOrdersQueryReturn {
  const { data: session } = useSession();

  // استفاده از React Query
  const {
    data: response,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery<PaymentListResponse, Error>({
    // کلید منحصر به فرد برای این query
    queryKey: queryKeys.paymentOrders.list(filterParams),

    // تابع fetch کردن داده‌ها
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      return await searchPaymentOrders(filterParams, session.accessToken);
    },

    // query فقط زمانی فعال است که:
    // 1. enabled: true باشد
    // 2. accessToken موجود باشد
    enabled: enabled && !!session?.accessToken,

    // اگر mount شد refetch نکند (در صورت داشتن cache)
    refetchOnMount: true,

    // اگر window focus شد refetch نکند
    refetchOnWindowFocus: false,

    // داده‌های دستورات پرداخت بعد از 30 ثانیه قدیمی می‌شوند
    staleTime: 30 * 1000,

    // کش را برای 5 دقیقه نگه‌داری کن
    gcTime: 5 * 60 * 1000,
  });

  // Map کردن response به PaymentOrder[]
  const orders: PaymentOrder[] = response?.items
    ? mapPaymentListDtosToPaymentOrders(response.items)
    : [];

  // تابع reload داده‌ها
  const refetch = async () => {
    await queryRefetch();
  };

  return {
    orders,
    isLoading,
    error,
    totalItems: response?.totalItemCount || 0,
    totalPages: response?.totalPageCount || 0,
    refetch,
  };
}
