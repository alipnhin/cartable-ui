"use client";

import { ReactNode, useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BottomDock } from "./BottomDock";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface AppLayoutProps {
  children: ReactNode;
  showAccountGroupSwitcher?: boolean;
}

export function AppLayout({
  children,
  showAccountGroupSwitcher = true,
}: AppLayoutProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedAccountGroup, setSelectedAccountGroup] = useState("all");
  const isMobile = useIsMobile();

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

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

        {/* Main Content - Scrollable */}
        <main
          className={cn(
            "flex-1 overflow-y-auto overflow-x-hidden",
            isMobile ? "pb-20" : "pb-0" // فضای bottom nav
          )}
        >
          <div className="px-4 md:px-6 py-6">{children}</div>
        </main>
      </div>

      {/* Bottom Dock (فقط موبایل) - Fixed در پایین */}
      {isMobile && <BottomDock mode="classic" />}
    </div>
  );
}
