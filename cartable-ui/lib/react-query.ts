/**
 * React Query Configuration
 * تنظیمات React Query برای مدیریت یکپارچه داده‌های سرور
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient با تنظیمات بهینه برای PWA
 *
 * تنظیمات:
 * - staleTime: 30 ثانیه - داده‌ها بعد از این مدت قدیمی محسوب می‌شوند
 * - gcTime: 5 دقیقه - زمان نگهداری cache غیرفعال
 * - refetchOnWindowFocus: false - جلوگیری از fetch مجدد با focus کردن
 * - refetchOnReconnect: true - fetch مجدد بعد از قطعی اینترنت
 * - retry: false - از axios-retry استفاده می‌کنیم، پس React Query retry نمی‌کند
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // زمان اعتبار داده‌ها (30 ثانیه)
      staleTime: 30 * 1000,

      // زمان نگهداری در cache (5 دقیقه)
      gcTime: 5 * 60 * 1000,

      // عدم refetch خودکار با focus
      refetchOnWindowFocus: false,

      // refetch بعد از reconnect
      refetchOnReconnect: true,

      // عدم retry (axios-retry این کار را انجام می‌دهد)
      retry: false,

      // نمایش خطا در console (فقط در development)
      throwOnError: false,
    },
    mutations: {
      // عدم retry برای mutations
      retry: false,

      // نمایش خطا در console
      throwOnError: false,
    },
  },
});

/**
 * Query Keys - کلیدهای ثابت برای استفاده در queries
 * این کلیدها برای invalidation و مدیریت cache استفاده می‌شوند
 */
export const queryKeys = {
  // Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    transactionProgress: (params: unknown) =>
      ["dashboard", "transaction-progress", params] as const,
  },

  // Cartable
  cartable: {
    all: ["cartable"] as const,
    myCartable: (params: unknown) => ["cartable", "my", params] as const,
    managerCartable: (params: unknown) =>
      ["cartable", "manager", params] as const,
  },

  // Payment Orders
  paymentOrders: {
    all: ["payment-orders"] as const,
    list: (params: unknown) => ["payment-orders", "list", params] as const,
    detail: (id: string) => ["payment-orders", "detail", id] as const,
  },

  // Transactions (Reports)
  transactions: {
    all: ["transactions"] as const,
    list: (params: unknown) => ["transactions", "list", params] as const,
    export: (params: unknown) => ["transactions", "export", params] as const,
  },

  // Account Groups
  accountGroups: {
    all: ["account-groups"] as const,
    list: (params: unknown) => ["account-groups", "list", params] as const,
    detail: (id: string) => ["account-groups", "detail", id] as const,
  },

  // Accounts
  accounts: {
    all: ["accounts"] as const,
    list: (params: unknown) => ["accounts", "list", params] as const,
    detail: (id: string) => ["accounts", "detail", id] as const,
  },

  // User Profile
  profile: {
    all: ["profile"] as const,
    info: () => ["profile", "info"] as const,
  },
} as const;
