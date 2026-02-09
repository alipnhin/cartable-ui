"use client";

/**
 * React Query Hook for Account Group Detail
 * مدیریت یکپارچه داده‌های جزئیات گروه حساب با React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getAccountGroupById, removeGroupAccount, addGroupAccounts, AddGroupAccountsParams } from "@/services/accountGroupService";
import { getAccountsList } from "@/services/accountService";
import type { AccountGroupDetail } from "@/types/account-group-types";
import type { AccountListItem } from "@/services/accountService";
import { queryKeys } from "@/lib/react-query";

/**
 * Hook برای دریافت جزئیات گروه حساب و لیست حساب‌ها
 */
export function useAccountGroupDetailQuery(groupId: string) {
  const { data: session } = useSession();

  // Query برای جزئیات گروه
  const groupQuery = useQuery<AccountGroupDetail, Error>({
    queryKey: queryKeys.accountGroups.detail(groupId),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await getAccountGroupById(groupId);
    },
    enabled: !!session?.accessToken && !!groupId,
  });

  // Query برای لیست تمام حساب‌ها (برای افزودن به گروه)
  const accountsQuery = useQuery<AccountListItem[], Error>({
    queryKey: queryKeys.accounts.list({}),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await getAccountsList();
    },
    enabled: !!session?.accessToken,
  });

  return {
    group: groupQuery.data,
    allAccounts: accountsQuery.data || [],
    isLoading: groupQuery.isLoading || accountsQuery.isLoading,
    error: groupQuery.error || accountsQuery.error,
    refetch: async () => {
      await Promise.all([groupQuery.refetch(), accountsQuery.refetch()]);
    },
  };
}

/**
 * Hook برای mutations گروه حساب
 */
export function useAccountGroupDetailMutations(groupId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Mutation برای حذف حساب از گروه
  const removeAccountMutation = useMutation({
    mutationFn: async (itemId: string) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await removeGroupAccount(itemId);
    },
    onSuccess: () => {
      // Invalidate account group detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountGroups.detail(groupId),
      });
      // Invalidate account groups list
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountGroups.all,
      });
      // Invalidate accounts list
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.all,
      });
    },
  });

  // Mutation برای افزودن حساب‌ها به گروه
  const addAccountsMutation = useMutation({
    mutationFn: async (params: AddGroupAccountsParams) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await addGroupAccounts(params);
    },
    onSuccess: () => {
      // Invalidate account group detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountGroups.detail(groupId),
      });
      // Invalidate account groups list
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountGroups.all,
      });
      // Invalidate accounts list
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.all,
      });
    },
  });

  return {
    removeAccount: removeAccountMutation,
    addAccounts: addAccountsMutation,
  };
}
