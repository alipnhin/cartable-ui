"use client";

/**
 * React Query Hook for Account Detail
 * مدیریت یکپارچه داده‌های جزئیات حساب با React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getAccountDetail, changeMinimumSignature, enableSigner, disableSigner, addSigner, AddSignerParams } from "@/services/accountService";
import type { AccountDetailResponse } from "@/services/accountService";
import { queryKeys } from "@/lib/react-query";

/**
 * Hook برای دریافت جزئیات حساب
 */
export function useAccountDetailQuery(accountId: string) {
  const { data: session } = useSession();

  return useQuery<AccountDetailResponse, Error>({
    queryKey: queryKeys.accounts.detail(accountId),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await getAccountDetail(accountId);
    },
    enabled: !!session?.accessToken && !!accountId,
  });
}

/**
 * Hook برای mutations حساب
 */
export function useAccountMutations(accountId: string) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Mutation برای تغییر حداقل امضا
  const changeMinSignatureMutation = useMutation({
    mutationFn: async (params: { minimumSignature: number; bankGatewayId: string }) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await changeMinimumSignature(params);
    },
    onSuccess: () => {
      // Invalidate account detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.detail(accountId),
      });
      // Invalidate accounts list
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.all,
      });
    },
  });

  // Mutation برای فعال کردن امضادار
  const enableSignerMutation = useMutation({
    mutationFn: async (signerId: string) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await enableSigner(signerId);
    },
    onSuccess: () => {
      // Invalidate account detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.detail(accountId),
      });
    },
  });

  // Mutation برای غیرفعال کردن امضادار
  const disableSignerMutation = useMutation({
    mutationFn: async (signerId: string) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await disableSigner(signerId);
    },
    onSuccess: () => {
      // Invalidate account detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.detail(accountId),
      });
    },
  });

  // Mutation برای افزودن امضادار
  const addSignerMutation = useMutation({
    mutationFn: async (params: AddSignerParams) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await addSigner(params);
    },
    onSuccess: () => {
      // Invalidate account detail
      queryClient.invalidateQueries({
        queryKey: queryKeys.accounts.detail(accountId),
      });
    },
  });

  return {
    changeMinSignature: changeMinSignatureMutation,
    enableSigner: enableSignerMutation,
    disableSigner: disableSignerMutation,
    addSigner: addSignerMutation,
  };
}
