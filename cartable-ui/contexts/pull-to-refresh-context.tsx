"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from "react";

interface PullToRefreshContextType {
  registerRefreshHandler: (handler: () => Promise<void> | void) => void;
  unregisterRefreshHandler: () => void;
  triggerRefresh: () => Promise<void>;
}

const PullToRefreshContext = createContext<PullToRefreshContextType | null>(
  null
);

export function PullToRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const refreshHandlerRef = useRef<(() => Promise<void> | void) | null>(null);

  const registerRefreshHandler = useCallback(
    (handler: () => Promise<void> | void) => {
      refreshHandlerRef.current = handler;
    },
    []
  );

  const unregisterRefreshHandler = useCallback(() => {
    refreshHandlerRef.current = null;
  }, []);

  const triggerRefresh = useCallback(async () => {
    if (refreshHandlerRef.current) {
      await refreshHandlerRef.current();
    }
  }, []);

  return (
    <PullToRefreshContext.Provider
      value={{
        registerRefreshHandler,
        unregisterRefreshHandler,
        triggerRefresh,
      }}
    >
      {children}
    </PullToRefreshContext.Provider>
  );
}

/**
 * Hook برای استفاده در صفحات - ثبت refetch handler
 */
export function useRegisterRefresh(
  refreshHandler: () => Promise<void> | void
) {
  const context = useContext(PullToRefreshContext);

  // اگر context نباشد، چیزی نمی‌کنیم (برای صفحاتی که AppLayout ندارند)
  if (!context) return;

  const { registerRefreshHandler, unregisterRefreshHandler } = context;

  // ثبت handler هنگام mount و حذف آن هنگام unmount
  useEffect(() => {
    registerRefreshHandler(refreshHandler);
    return () => unregisterRefreshHandler();
  }, [refreshHandler, registerRefreshHandler, unregisterRefreshHandler]);
}

/**
 * Hook برای استفاده در AppLayout - دریافت refresh handler
 */
export function usePullToRefresh() {
  const context = useContext(PullToRefreshContext);

  if (!context) {
    throw new Error(
      "usePullToRefresh must be used within PullToRefreshProvider"
    );
  }

  return context;
}
