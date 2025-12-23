"use client";

import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BottomDock } from "./BottomDock";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { PullToRefresh } from "@/components/common/pull-to-refresh";
import { usePullToRefresh } from "@/contexts/pull-to-refresh-context";

interface AppLayoutProps {
  children: ReactNode;
  showAccountGroupSwitcher?: boolean;
}

export function AppLayout({
  children,
  showAccountGroupSwitcher = true,
}: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // مقداردهی اولیه از localStorage
  const [selectedAccountGroup, setSelectedAccountGroup] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selected-account-group");
      return saved || "all";
    }
    return "all";
  });

  const isMobile = useIsMobile();
  const { triggerRefresh } = usePullToRefresh();

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  // Main content element
  const mainContent = (
    <main
      className={cn(
        "flex-1 overflow-y-auto overflow-x-hidden",
        isMobile ? "pb-20" : "pb-0" // فضای bottom nav
      )}
    >
      <div className="px-4 md:px-6 py-6">{children}</div>
    </main>
  );

  return (
    <div className="relative h-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header - Fixed در بالا */}
      <Header
        onMenuToggle={toggleSidebar}
        showMenuButton={!isMobile}
        showAccountGroupSwitcher={showAccountGroupSwitcher}
        selectedAccountGroup={selectedAccountGroup}
        onAccountGroupChange={setSelectedAccountGroup}
      />

      {/* Container برای Sidebar و Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (فقط دسکتاپ) - Fixed */}
        {!isMobile && (
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            selectedAccountGroup={selectedAccountGroup}
            onAccountGroupChange={setSelectedAccountGroup}
          />
        )}

        {/* Main Content - Scrollable با PullToRefresh در موبایل */}
        {isMobile ? (
          <PullToRefresh onRefresh={triggerRefresh} attachToScrollContainer>
            {mainContent}
          </PullToRefresh>
        ) : (
          mainContent
        )}
      </div>

      {/* Bottom Dock (فقط موبایل) - Fixed در پایین */}
      {isMobile && <BottomDock mode="classic" />}
    </div>
  );
}
