"use client";

/**
 * React Query Hook for Accounts Page
 * مدیریت یکپارچه داده‌های حساب‌ها با React Query
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { getAccountsList } from "@/services/accountService";
import type { AccountListItem } from "@/services/accountService";
import { queryKeys } from "@/lib/react-query";
import { useAccountGroupStore } from "@/store/account-group-store";

interface UseAccountsQueryReturn {
  /** آرایه حساب‌های بانکی */
  accounts: AccountListItem[];

  /** وضعیت loading */
  isLoading: boolean;

  /** پیام خطا (اگر وجود داشته باشد) */
  error: Error | null;

  /** تابع refetch داده‌ها */
  refetch: () => Promise<void>;
}

/**
 * Hook برای مدیریت داده‌های حساب‌های بانکی با React Query
 *
 * @example
 * ```tsx
 * const { accounts, isLoading, error, refetch } = useAccountsQuery();
 * ```
 */
export function useAccountsQuery(): UseAccountsQueryReturn {
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

  // استفاده از React Query
  const {
    data: accounts,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery<AccountListItem[], Error>({
    // کلید منحصر به فرد برای این query
    queryKey: queryKeys.accounts.list({ accountGroupId: savedGroupId }),

    // تابع fetch کردن داده‌ها
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      return await getAccountsList(
        session.accessToken,
        savedGroupId || undefined
      );
    },

    // query فقط زمانی فعال است که accessToken موجود باشد
    enabled: !!session?.accessToken,

    // اگر mount شد refetch نکند (در صورت داشتن cache)
    refetchOnMount: true,

    // اگر window focus شد refetch نکند
    refetchOnWindowFocus: false,

    // داده‌های حساب‌ها بعد از 1 دقیقه قدیمی می‌شوند
    staleTime: 60 * 1000,

    // کش را برای 10 دقیقه نگه‌داری کن
    gcTime: 10 * 60 * 1000,
  });

  // تابع reload داده‌ها
  const refetch = async () => {
    await queryRefetch();
  };

  return {
    accounts: accounts || [],
    isLoading,
    error,
    refetch,
  };
}
