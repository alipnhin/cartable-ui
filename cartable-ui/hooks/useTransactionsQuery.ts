"use client";

/**
 * React Query Hook for Transaction Reports Page
 * مدیریت یکپارچه داده‌های گزارش تراکنش‌ها با React Query
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import {
  getTransactionsList,
  type TransactionsRequest,
  type TransactionsResponse,
  type TransactionItem,
} from "@/services/transactionService";
import { queryKeys } from "@/lib/react-query";
import { useAccountGroupStore } from "@/store/account-group-store";

export interface UseTransactionsQueryOptions {
  /** پارامترهای فیلتر */
  filterParams: TransactionsRequest;

  /** فعال/غیرفعال کردن query (پیش‌فرض: true) */
  enabled?: boolean;
}

export interface UseTransactionsQueryReturn {
  /** آرایه تراکنش‌ها */
  transactions: TransactionItem[];

  /** تعداد کل رکوردها */
  totalRecords: number;

  /** تعداد کل صفحات */
  totalPages: number;

  /** وضعیت loading */
  isLoading: boolean;

  /** پیام خطا (اگر وجود داشته باشد) */
  error: Error | null;

  /** تابع refetch داده‌ها */
  refetch: () => Promise<void>;
}

/**
 * Hook برای مدیریت داده‌های گزارش تراکنش‌ها با React Query
 *
 * @example
 * ```tsx
 * const { transactions, totalRecords, isLoading, error, refetch } = useTransactionsQuery({
 *   filterParams: {
 *     pageNumber: 1,
 *     pageSize: 25,
 *     fromDate: '2025-01-01',
 *     toDate: '2025-12-31'
 *   }
 * });
 * ```
 */
export function useTransactionsQuery({
  filterParams,
  enabled = true,
}: UseTransactionsQueryOptions): UseTransactionsQueryReturn {
  const { data: session } = useSession();
  const selectedGroup = useAccountGroupStore((s) => s.selectedGroup);

  // ادغام accountGroupId از store با filterParams
  const finalParams = useMemo(() => {
    const params = { ...filterParams };

    // افزودن accountGroupId از store اگر وجود داشته باشد
    if (selectedGroup?.id && selectedGroup.id !== "all" && !params.accountGroupId) {
      params.accountGroupId = selectedGroup.id;
    }

    return params;
  }, [filterParams, selectedGroup]);

  // استفاده از React Query
  const {
    data: response,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery<TransactionsResponse, Error>({
    // کلید منحصر به فرد برای این query
    queryKey: queryKeys.transactions.list(finalParams),

    // تابع fetch کردن داده‌ها
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      return await getTransactionsList(finalParams);
    },

    // query فقط زمانی فعال است که accessToken موجود و enabled=true باشد
    enabled: enabled && !!session?.accessToken,

    // اگر mount شد refetch نکند (در صورت داشتن cache)
    refetchOnMount: true,
  });

  // تابع reload داده‌ها
  const refetch = async () => {
    await queryRefetch();
  };

  return {
    transactions: response?.items || [],
    totalRecords: response?.totalItemCount || 0,
    totalPages: response?.totalPageCount || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Helper function برای دریافت محدوده تاریخ پیش‌فرض (7 روز گذشته)
 */
export function getDefaultTransactionDates(): {
  fromDate: string;
  toDate: string;
} {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  return {
    fromDate: fromDate.toISOString().split("T")[0],
    toDate: toDate.toISOString().split("T")[0],
  };
}
