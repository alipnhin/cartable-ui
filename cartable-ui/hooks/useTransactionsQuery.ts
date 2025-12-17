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
  const groupId = useAccountGroupStore((s) => s.groupId);

  // خواندن accountGroupId از localStorage
  const [savedGroupId, setSavedGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selected-account-group");
      setSavedGroupId(stored);
    }
  }, [groupId]);

  // ادغام accountGroupId از localStorage با filterParams
  const finalParams = useMemo(() => {
    const params = { ...filterParams };

    // افزودن accountGroupId از localStorage اگر وجود داشته باشد
    if (savedGroupId && savedGroupId !== "all" && !params.accountGroupId) {
      params.accountGroupId = savedGroupId;
    }

    return params;
  }, [filterParams, savedGroupId]);

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

      return await getTransactionsList(finalParams, session.accessToken);
    },

    // query فقط زمانی فعال است که accessToken موجود و enabled=true باشد
    enabled: enabled && !!session?.accessToken,

    // اگر mount شد refetch نکند (در صورت داشتن cache)
    refetchOnMount: false,

    // اگر window focus شد refetch نکند (بهینه برای PWA)
    refetchOnWindowFocus: false,

    // داده‌های تراکنش‌ها بعد از 30 ثانیه قدیمی می‌شوند
    staleTime: 30 * 1000,

    // کش را برای 5 دقیقه نگه‌داری کن
    gcTime: 5 * 60 * 1000,
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
