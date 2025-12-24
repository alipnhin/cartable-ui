/**
 * Sidebar Component
 * کامپوننت منوی کناری (دسکتاپ)
 *
 * این کامپوننت منوی اصلی برنامه را در سمت راست صفحه نمایش می‌دهد.
 * آیتم‌های منو بر اساس نقش کاربر فیلتر می‌شوند.
 *
 * @module components/layout/Sidebar
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getFilteredMenuItems,
  getUserRolesFromSession,
  isRouteActive,
  applyBadgesToMenuItems,
} from "@/config/navigation";
import { AccountGroupSwitcher } from "@/components/common/account-group-selector";
import useTranslation from "@/hooks/useTranslation";
import { useMenuCounts } from "@/hooks/useMenuCounts";
import { useNavigationProgress } from "@/providers/navigation-progress-provider";
import { toAbsoluteUrl } from "@/lib/helpers";

interface SidebarProps {
  isCollapsed: boolean;
  className?: string;
}

export function Sidebar({
  isCollapsed,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const { startProgress } = useNavigationProgress();
  const [isPending, startTransition] = useTransition();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  // دریافت تعداد واقعی از API
  const { counts } = useMenuCounts();

  // Filter menu items based on user roles and apply real badges
  const menuItems = useMemo(() => {
    const userRoles = getUserRolesFromSession(session);
    const filteredItems = getFilteredMenuItems(userRoles, !!session);
    // اعمال badge های واقعی
    return applyBadgesToMenuItems(filteredItems, counts);
  }, [session, counts]);

  const handleNavigation = (route: string) => {
    if (route === pathname) return;
    setPendingRoute(route);
    startProgress();
    startTransition(() => {
      router.push(route);
    });
  };

  return (
    <aside
      className={cn(
        "hidden h-full flex-col border-e bg-card text-foreground transition-all duration-300 md:flex shrink-0",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {menuItems.map((item) => {
          const isActive = isRouteActive(pathname, item.route);
          const isPendingThis = pendingRoute === item.route;
          const Icon = item.icon;

          return (
            <Button
              key={item.title}
              variant="ghost"
              disabled={isPending}
              className={cn(
                "group relative w-full justify-start gap-3 transition-all duration-200 h-10",
                "hover:bg-muted",
                isCollapsed && "justify-center px-2",
                (isActive || isPendingThis) && [
                  "bg-primary text-primary-foreground font-medium",
                  "hover:bg-primary/90 hover:text-primary-foreground",
                ],
                isPending && !isPendingThis && "opacity-50"
              )}
              onClick={() => handleNavigation(item.route)}
              title={isCollapsed ? t(`navigation.${item.title}`) : undefined}
            >
              {/* Icon */}
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-200",
                  isActive || isPendingThis
                    ? "text-primary-foreground"
                    : "text-muted-foreground group-hover:text-foreground",
                  isPendingThis && "animate-pulse"
                )}
              />

              {/* Label & Badge */}
              {!isCollapsed && (
                <>
                  <span
                    className={cn(
                      "flex-1 text-start transition-colors duration-200 text-sm",
                      isActive || isPendingThis
                        ? "text-primary-foreground"
                        : "text-foreground"
                    )}
                  >
                    {t(`navigation.${item.title}`)}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant={
                        isActive || isPendingThis ? "secondary" : "destructive"
                      }
                      className="ms-auto rounded-full h-5 min-w-5 text-xs"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </>
              )}

              {/* Collapsed Badge */}
              {isCollapsed && item.badge && item.badge > 0 && (
                <div className="absolute -top-0.5 -end-0.5 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t p-3 space-y-3">
          {/* Account Group Switcher */}
          <div>
            <AccountGroupSwitcher className="w-full h-10" />
          </div>

          {/* App Info */}
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted/50 border">
            <div className="w-9 h-9 rounded-lg  flex items-center justify-center">
              <Image
                src={toAbsoluteUrl("/media/logo.png")}
                alt="App Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {t("app.title")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("app.version")} 1.0.0
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
