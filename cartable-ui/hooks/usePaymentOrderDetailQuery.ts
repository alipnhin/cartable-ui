/**
 * React Query hook for Payment Order Details
 * مدیریت واکشی جزئیات دستور پرداخت با React Query
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  getWithdrawalOrderDetails,
  getWithdrawalStatistics,
} from "@/services/paymentOrdersService";
import { queryKeys } from "@/lib/react-query";
import type {
  WithdrawalOrderDetails,
  WithdrawalStatistics,
} from "@/types/api";

/**
 * نوع داده‌های برگشتی از hook
 */
export interface PaymentOrderDetailData {
  orderDetails: WithdrawalOrderDetails;
  statistics: WithdrawalStatistics;
}

/**
 * Hook برای واکشی جزئیات دستور پرداخت
 *
 * ویژگی‌ها:
 * - واکشی موازی جزئیات و آمار
 * - Cache با staleTime 30 ثانیه
 * - Auto refetch بعد از mutations
 * - Type safety کامل
 *
 * @param orderId - شناسه دستور پرداخت
 * @returns Query result با جزئیات و آمار
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = usePaymentOrderDetailQuery(orderId);
 *
 * if (isLoading) return <Skeleton />;
 * if (error) return <Error message={error.message} />;
 *
 * const { orderDetails, statistics } = data;
 * ```
 */
export function usePaymentOrderDetailQuery(orderId: string) {
  const { data: session } = useSession();

  return useQuery({
    // کلید یکتای query برای cache
    queryKey: queryKeys.paymentOrders.detail(orderId),

    // تابع واکشی داده
    queryFn: async (): Promise<PaymentOrderDetailData> => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      // واکشی موازی برای بهبود performance
      const [orderDetails, statistics] = await Promise.all([
        getWithdrawalOrderDetails(orderId, session.accessToken),
        getWithdrawalStatistics(orderId, session.accessToken),
      ]);

      return {
        orderDetails,
        statistics,
      };
    },

    // فقط زمانی که session موجود باشد اجرا شود
    enabled: !!session?.accessToken && !!orderId,

    // زمان اعتبار cache (30 ثانیه)
    staleTime: 30 * 1000,

    // زمان نگهداری در cache (5 دقیقه)
    gcTime: 5 * 60 * 1000,

    // عدم refetch خودکار
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: true,

    // عدم retry (axios-retry انجام می‌دهد)
    retry: false,
  });
}
