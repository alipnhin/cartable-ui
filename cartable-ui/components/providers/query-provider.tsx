"use client";

/**
 * Query Provider Component
 * Provider برای React Query که باید در root layout استفاده شود
 */

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider Component
 * - QueryClientProvider را wrap می‌کند
 * - ReactQueryDevtools را فقط در development نمایش می‌دهد
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools فقط در development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      )}
    </QueryClientProvider>
  );
}
