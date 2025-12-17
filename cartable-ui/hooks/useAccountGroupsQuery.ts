"use client";

/**
 * React Query Hooks for Account Groups
 * مدیریت یکپارچه داده‌ها و mutations گروه‌های حساب با React Query
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import {
  filterAccountGroups,
  changeAccountGroupStatus,
  deleteAccountGroup,
  createAccountGroup,
  editAccountGroup,
} from "@/services/accountGroupService";
import type {
  AccountGroupDetail,
  FilterAccountGroupsParams,
  ChangeAccountGroupStatusParams,
  CreateAccountGroupParams,
  EditAccountGroupParams,
} from "@/types/account-group-types";
import { queryKeys } from "@/lib/react-query";

interface UseAccountGroupsQueryOptions {
  /** پارامترهای فیلتر */
  filterParams: FilterAccountGroupsParams;
  /** فعال یا غیرفعال بودن query */
  enabled?: boolean;
}

interface UseAccountGroupsQueryReturn {
  /** آرایه گروه‌های حساب */
  groups: AccountGroupDetail[];
  /** وضعیت loading */
  isLoading: boolean;
  /** پیام خطا */
  error: Error | null;
  /** تابع refetch */
  refetch: () => Promise<void>;
}

/**
 * Hook برای واکشی لیست گروه‌های حساب
 */
export function useAccountGroupsQuery({
  filterParams,
  enabled = true,
}: UseAccountGroupsQueryOptions): UseAccountGroupsQueryReturn {
  const { data: session } = useSession();

  const {
    data: response,
    isLoading,
    error,
    refetch: queryRefetch,
  } = useQuery({
    queryKey: queryKeys.accountGroups.list(filterParams),

    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      return await filterAccountGroups(filterParams, session.accessToken);
    },

    enabled: enabled && !!session?.accessToken,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 دقیقه
    gcTime: 10 * 60 * 1000, // 10 دقیقه
  });

  const refetch = async () => {
    await queryRefetch();
  };

  return {
    groups: response?.items || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook برای mutations گروه‌های حساب
 * شامل create, edit, delete, changeStatus
 */
export function useAccountGroupMutations() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  // Mutation برای ایجاد گروه جدید
  const createMutation = useMutation({
    mutationFn: async (params: CreateAccountGroupParams) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await createAccountGroup(params, session.accessToken);
    },
    onSuccess: () => {
      // Invalidate کردن تمام queries مربوط به account groups
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountGroups.all,
      });
    },
  });

  // Mutation برای ویرایش گروه
  const editMutation = useMutation({
    mutationFn: async (params: EditAccountGroupParams) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await editAccountGroup(params, session.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountGroups.all,
      });
    },
  });

  // Mutation برای حذف گروه
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await deleteAccountGroup(id, session.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountGroups.all,
      });
    },
  });

  // Mutation برای تغییر وضعیت گروه
  const changeStatusMutation = useMutation({
    mutationFn: async (params: ChangeAccountGroupStatusParams) => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await changeAccountGroupStatus(params, session.accessToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.accountGroups.all,
      });
    },
  });

  return {
    create: createMutation,
    edit: editMutation,
    delete: deleteMutation,
    changeStatus: changeStatusMutation,
  };
}
