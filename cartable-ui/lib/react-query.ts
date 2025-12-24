/**
 * React Query Configuration
 * تنظیمات React Query برای مدیریت یکپارچه داده‌های سرور
 */

import { QueryClient } from "@tanstack/react-query";

/**
 * QueryClient با تنظیمات ویژه برای سیستم مالی
 *
 * ⚠️ تنظیمات امنیتی برای اپلیکیشن‌های مالی:
 * - staleTime: 0 - داده‌ها فوراً قدیمی می‌شوند (NO CACHE)
 * - gcTime: 0 - هیچ داده‌ای در cache نگهداری نمی‌شود
 * - refetchOnWindowFocus: true - با focus کردن، داده‌ها refresh می‌شوند
 * - refetchOnReconnect: true - با reconnect، داده‌ها refresh می‌شوند
 * - refetchOnMount: true - با mount شدن، داده‌ها refresh می‌شوند
 * - retry: false - از axios-retry استفاده می‌کنیم
 *
 * این تنظیمات تضمین می‌کند که همیشه آخرین داده‌ها از سرور دریافت شود.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ⚠️ CRITICAL: داده‌ها فوراً قدیمی می‌شوند - NO CACHE
      staleTime: 0,

      // ⚠️ CRITICAL: هیچ چیزی در cache نگهداری نشود
      gcTime: 0,

      // Refetch در هر mount
      refetchOnMount: true,

      // Refetch وقتی window focus می‌شود (کاربر برگشته)
      refetchOnWindowFocus: true,

      // Refetch بعد از reconnect (اتصال اینترنت برقرار شد)
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
