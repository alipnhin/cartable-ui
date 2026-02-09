"use client";

/**
 * React Query Hook for User Profile
 * مدیریت یکپارچه داده‌های پروفایل کاربر با React Query
 */

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { queryKeys } from "@/lib/react-query";
import type { UserInfoResponse } from "@/services/userProfileService";

/**
 * Hook برای دریافت اطلاعات کامل پروفایل کاربر
 */
export function useUserProfileQuery() {
  const { data: session } = useSession();

  return useQuery<UserInfoResponse, Error>({
    queryKey: queryKeys.profile.info(),
    queryFn: async () => {
      if (!session?.accessToken) {
        throw new Error("No access token available");
      }

      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      return await response.json();
    },
    enabled: !!session?.accessToken,
    // Cache برای profile - 1 ساعت
    staleTime: 3600000, // 1 hour
    gcTime: 3600000, // 1 hour
  });
}
