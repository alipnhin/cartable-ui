/**
 * Hook برای دریافت تعداد آیتم‌های منو
 * با قابلیت refresh خودکار هر 30 ثانیه
 */

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMenuCounts } from "@/services/badgeService";
import { MenuCountsResponse } from "@/types/api";
import logger from "@/lib/logger";

interface UseMenuCountsReturn {
  /** تعداد آیتم‌های منو */
  counts: MenuCountsResponse;
  /** آیا در حال بارگذاری است */
  isLoading: boolean;
  /** خطا در صورت وجود */
  error: Error | null;
  /** تابع برای refresh دستی */
  refetch: () => Promise<void>;
}

/**
 * Hook برای دریافت تعداد آیتم‌های منو
 *
 * @param autoRefresh - فعال/غیرفعال کردن refresh خودکار (پیش‌فرض: true)
 * @param refreshInterval - فاصله زمانی refresh به میلی‌ثانیه (پیش‌فرض: 30000 = 30 ثانیه)
 * @returns تعداد آیتم‌ها و وضعیت بارگذاری
 *
 * @example
 * const { counts, isLoading, refetch } = useMenuCounts();
 * console.log(counts.myCartableCount); // 8
 */
export function useMenuCounts(
  autoRefresh: boolean = true,
  refreshInterval: number = 30000
): UseMenuCountsReturn {
  const { data: session } = useSession();
  const [counts, setCounts] = useState<MenuCountsResponse>({
    myCartableCount: 0,
    managerCartableCount: 0,
    openPaymentOrdersCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * واکشی تعداد آیتم‌ها
   */
  const fetchCounts = async () => {
    if (!session?.accessToken) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getMenuCounts(session.accessToken);
      setCounts(data);
    } catch (err) {
      logger.error(
        "Error fetching menu counts:",
        err instanceof Error ? err : undefined
      );
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * تابع برای refresh دستی
   */
  const refetch = async () => {
    await fetchCounts();
  };

  // واکشی اولیه
  useEffect(() => {
    fetchCounts();
  }, [session?.accessToken]);

  // Refresh خودکار
  useEffect(() => {
    if (!autoRefresh || !session?.accessToken) {
      return;
    }

    const interval = setInterval(() => {
      fetchCounts();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, session?.accessToken]);

  return {
    counts,
    isLoading,
    error,
    refetch,
  };
}
