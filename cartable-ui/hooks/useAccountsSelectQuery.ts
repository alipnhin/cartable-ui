"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getAccountsSelectData } from "@/services/accountService";
import { queryKeys } from "@/lib/react-query";
import { useAccountGroupStore } from "@/store/account-group-store";

/**
 * Hook برای دریافت لیست انتخابی حساب‌ها
 * با React Query برای جلوگیری از fetch تکراری
 */
export function useAccountsSelectQuery() {
  const { data: session } = useSession();
  const selectedGroup = useAccountGroupStore((state) => state.selectedGroup);
  const accountGroupId = selectedGroup?.id;

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.accounts.select(),
    queryFn: async () => {
      const response = await getAccountsSelectData(
        {
          pageSize: 50,
          pageNum: 1,
        },
        accountGroupId // ارسال accountGroupId از store
      );
      return response.results;
    },
    enabled: !!session?.accessToken,
    // No staleTime/gcTime - این داده مالی است و باید همیشه fresh باشد
    // Global config: staleTime: 0, gcTime: 0
  });

  return {
    accounts: data || [],
    isLoading,
    error,
  };
}
