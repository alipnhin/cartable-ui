/**
 * React Query hook for Payment Order Transactions
 * مدیریت واکشی تراکنش‌های دستور پرداخت با React Query
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getWithdrawalTransactions } from "@/services/paymentOrdersService";
import { queryKeys } from "@/lib/react-query";
import type {
  WithdrawalTransaction,
  TransactionFilterParams,
} from "@/types/api";

/**
 * پارامترهای hook تراکنش‌ها
 */
export interface UseTransactionsParams
  extends Partial<TransactionFilterParams> {
  withdrawalOrderId: string;
  pageNumber?: number;
  pageSize?: number;
}

/**
 * نوع داده برگشتی از API
 */
export interface TransactionsResponse {
  items: WithdrawalTransaction[];
  totalPageCount: number;
  totalItemCount: number;
}

/**
 * Hook برای واکشی تراکنش‌های دستور پرداخت
 *
 * ویژگی‌ها:
 * - پشتیبانی از pagination
 * - پشتیبانی از فیلترها
 * - Cache با staleTime 30 ثانیه
 * - Auto refetch بعد از mutations
 * - Type safety کامل
 *
 * @param params - پارامترهای فیلتر و pagination
 * @returns Query result با لیست تراکنش‌ها
 *
 * @example
 * ```tsx
 * const { data, isLoading, error, refetch } = usePaymentOrderTransactionsQuery({
 *   withdrawalOrderId: orderId,
 *   pageNumber: 1,
 *   pageSize: 25,
 *   status: PaymentItemStatusEnum.Success,
 * });
 *
 * if (isLoading) return <Skeleton />;
 * if (error) return <Error />;
 *
 * const { items, totalPageCount, totalItemCount } = data;
 * ```
 */
export function usePaymentOrderTransactionsQuery(
  params: UseTransactionsParams
) {
  const { data: session } = useSession();

  const {
    withdrawalOrderId,
    pageNumber = 1,
    pageSize = 25,
    ...filters
  } = params;

  return useQuery({
    // کلید یکتای query برای cache
    queryKey: [
      ...queryKeys.paymentOrders.detail(withdrawalOrderId),
      "transactions",
      { pageNumber, pageSize, ...filters },
    ] as const,

    // تابع واکشی داده
    queryFn: async (): Promise<TransactionsResponse> => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      const requestParams: TransactionFilterParams = {
        withdrawalOrderId,
        pageNumber,
        pageSize,
        ...filters,
      };

      return await getWithdrawalTransactions(requestParams);
    },

    // فقط زمانی که session موجود باشد اجرا شود
    enabled: !!session?.accessToken && !!withdrawalOrderId,

    refetchOnMount: true,
    refetchOnReconnect: true,

    // عدم retry (axios-retry انجام می‌دهد)
    retry: false,

    // پیش‌فرض placeholderData برای prevent flickering
    placeholderData: (previousData) => previousData,
  });
}
