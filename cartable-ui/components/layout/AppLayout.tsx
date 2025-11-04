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
    <div className="relative min-h-screen bg-background text-foreground flex flex-col">
      {/* Header - بدون ایجاد scroll */}
      <Header
        onMenuToggle={toggleSidebar}
        showMenuButton={!isMobile}
        showAccountGroupSwitcher={showAccountGroupSwitcher}
        selectedAccountGroup={selectedAccountGroup}
        onAccountGroupChange={setSelectedAccountGroup}
      />

      {/* Sidebar (فقط دسکتاپ) */}
      {!isMobile && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          selectedAccountGroup={selectedAccountGroup}
          onAccountGroupChange={setSelectedAccountGroup}
        />
      )}

      {/* Main Content - بدون min-height که باعث scroll می‌شود */}
      <main
        className={cn(
          "flex-1 overflow-x-hidden transition-[margin] duration-300 ease-in-out",
          isMobile ? "pb-20" : "pb-0", // فضای bottom nav
          !isMobile && "md:ms-64",
          !isMobile && isSidebarCollapsed && "md:ms-16"
        )}
      >
        <div className="px-4 md:px-6 py-6">{children}</div>
      </main>

      {/* Bottom Dock (فقط موبایل) */}
      {isMobile && <BottomDock mode="classic" />}
    </div>
  );
}
