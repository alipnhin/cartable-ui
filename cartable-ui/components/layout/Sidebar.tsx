"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mainMenuItems, isRouteActive } from "@/config/navigation";
import { AccountGroupSwitcher } from "@/components/common/account-group-selector";
import useTranslation from "@/hooks/useTranslation";

interface SidebarProps {
  isCollapsed: boolean;
  className?: string;
  selectedAccountGroup?: string;
  onAccountGroupChange?: (groupId: string) => void;
}

export function Sidebar({
  isCollapsed,
  className,
  selectedAccountGroup,
  onAccountGroupChange,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-40 mt-16 hidden h-[calc(100vh-4rem)] flex-col border-e bg-card text-foreground transition-all duration-300 md:flex",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <nav className="flex-1 space-y-1 overflow-y-auto p-3 mt-10">
        {mainMenuItems.map((item) => {
          const isActive = isRouteActive(pathname, item.route);
          const Icon = item.icon;

          return (
            <Button
              key={item.title}
              variant="ghost"
              className={cn(
                "group relative w-full justify-start gap-3 transition-all duration-200",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isCollapsed && "justify-center px-2",
                isActive && [
                  "bg-primary/10 text-primary font-semibold",
                  "hover:bg-primary/15 hover:text-primary",
                  "shadow-sm",
                ]
              )}
              onClick={() => router.push(item.route)}
              title={isCollapsed ? t(`navigation.${item.title}`) : undefined}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute start-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-e-full" />
              )}

              {/* Icon */}
              <Icon
                className={cn(
                  "h-5 w-5 shrink-0 transition-all duration-200",
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              />

              {/* Label & Badge */}
              {!isCollapsed && (
                <>
                  <span
                    className={cn(
                      "flex-1 text-start transition-colors duration-200",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {t(`navigation.${item.title}`)}
                  </span>
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="ms-auto animate-pulse"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </>
              )}

              {/* Collapsed Badge */}
              {isCollapsed && item.badge && item.badge > 0 && (
                <div className="absolute -top-1 -end-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="border-t p-4 space-y-3">
          {/* Account Group Switcher */}
          <div className="px-1">
            <AccountGroupSwitcher
              value={selectedAccountGroup}
              onChange={onAccountGroupChange}
              className="w-full h-11"
            />
          </div>

          {/* App Info */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">ک</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{t("app.title")}</p>
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
