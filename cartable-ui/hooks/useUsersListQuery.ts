"use client";

/**
 * React Query Hook for Users List
 * مدیریت یکپارچه لیست کاربران با React Query
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { getUsersList } from "@/services/accountService";
import type { UserSelectItem } from "@/services/accountService";

/**
 * Hook برای دریافت لیست کاربران
 */
export function useUsersListQuery() {
  const { data: session } = useSession();

  return useQuery<UserSelectItem[], Error>({
    queryKey: ["users", "list"],
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }
      return await getUsersList();
    },
    enabled: !!session?.accessToken,
  });
}
