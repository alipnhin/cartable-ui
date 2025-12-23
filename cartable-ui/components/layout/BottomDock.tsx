/**
 * Bottom Dock Component
 * کامپوننت منوی پایین (موبایل)
 *
 * این کامپوننت منوی اصلی برنامه را در پایین صفحه (موبایل) نمایش می‌دهد.
 * آیتم‌های منو بر اساس نقش کاربر فیلتر می‌شوند.
 *
 * چهار حالت مختلف دارد: classic, minimal-v2, floating, minimal
 *
 * @module components/layout/BottomDock
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  getFilteredMenuItems,
  getUserRolesFromSession,
  isRouteActive,
  applyBadgesToMenuItems,
  type MenuItem,
} from "@/config/navigation";
import useTranslation from "@/hooks/useTranslation";
import { useNavigationProgress } from "@/providers/navigation-progress-provider";
import { useMenuCounts } from "@/hooks/useMenuCounts";
import { Plus } from "lucide-react";
import {
  useMemo,
  memo,
  useState,
  useTransition,
  useEffect,
  useRef,
} from "react";

type BottomDockMode = "classic" | "minimal-v2" | "floating" | "minimal";

interface BottomDockProps {
  mode?: BottomDockMode;
  onCenterButtonClick?: () => void;
}

export function BottomDock({
  mode = "floating",
  onCenterButtonClick,
}: BottomDockProps) {
  const { data: session } = useSession();

  // دریافت تعداد واقعی از API
  const { counts } = useMenuCounts();

  // Filter menu items based on user roles and apply real badges
  const menuItems = useMemo(() => {
    const userRoles = getUserRolesFromSession(session);
    const filteredItems = getFilteredMenuItems(userRoles, !!session);
    // اعمال badge های واقعی
    return applyBadgesToMenuItems(filteredItems, counts);
  }, [session, counts]);

  if (mode === "classic") {
    return <ClassicBottomDock menuItems={menuItems} />;
  }

  if (mode === "minimal-v2") {
    return <MinimalV2BottomDock menuItems={menuItems} />;
  }
  if (mode === "minimal") {
    return <MinimalBottomDock menuItems={menuItems} />;
  }

  return (
    <FloatingBottomDock
      menuItems={menuItems}
      onCenterButtonClick={onCenterButtonClick}
    />
  );
}

/**
 * Minimal Bottom Dock - Mode 3
 * حالت مینیمال با انیمیشن‌های ساده
 */
function MinimalBottomDock({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { startProgress } = useNavigationProgress();
  const [isPending, startTransition] = useTransition();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const handleNavigation = (route: string) => {
    if (route === pathname) return;
    setPendingRoute(route);
    startProgress();
    startTransition(() => {
      router.push(route);
    });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <div
        className="relative bg-card border-t border-border/50 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)]"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 1.75rem)",
          paddingTop: "0.75rem",
        }}
      >
        <div className="flex items-center justify-around px-2">
          {menuItems.map((item) => {
            const isActive = isRouteActive(pathname, item.route);
            const isPendingThis = pendingRoute === item.route;
            const Icon = item.icon;

            return (
              <button
                key={item.route}
                onClick={() => handleNavigation(item.route)}
                disabled={isPending}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 py-2.5 min-w-18 min-h-14 transition-all duration-300 ease-out group",
                  "active:scale-90",
                  "after:content-[''] after:absolute after:-inset-2",
                  isPending && !isPendingThis && "opacity-40"
                )}
              >
                {/* Icon Container با انیمیشن */}
                <div
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 mb-1",
                    isActive || isPendingThis
                      ? "bg-primary/15 scale-110 shadow-lg shadow-primary/20"
                      : "bg-transparent group-hover:bg-muted/50 group-hover:scale-105"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      isActive || isPendingThis
                        ? "text-primary scale-110"
                        : "text-muted-foreground",
                      isPendingThis && "animate-pulse"
                    )}
                  />

                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 text-[10px] font-bold ring-2 ring-background shadow-md"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[11px] font-medium transition-all duration-300 leading-tight",
                    isActive || isPendingThis
                      ? "text-primary font-semibold scale-105"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {t(`navigation.${item.title}`)}
                </span>

                {/* Active Line Indicator - زیر متن */}
                <div
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary transition-all duration-300 ease-out",
                    isActive || isPendingThis
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  )}
                />

                {/* Dot Indicator - بالای آیکون */}
                {(isActive || isPendingThis) && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/**
 * Floating Bottom Dock - Mode 2
 * حالت شناور با دکمه مرکزی
 */
function FloatingBottomDock({
  menuItems,
  onCenterButtonClick,
}: {
  menuItems: MenuItem[];
  onCenterButtonClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { startProgress } = useNavigationProgress();
  const [isPending, startTransition] = useTransition();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const centerIndex = useMemo(
    () => Math.floor(menuItems.length / 2),
    [menuItems]
  );
  const CenterIcon = menuItems[centerIndex]?.icon || Plus;

  const handleNavigation = (route: string) => {
    if (route === pathname) return;
    setPendingRoute(route);
    startProgress();
    startTransition(() => {
      router.push(route);
    });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <div
        className="relative bg-card/95 backdrop-blur-md border-t border-border/50 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)]"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 1.75rem)",
          height: "calc(6rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex h-full items-end justify-around pb-3">
          {menuItems.map((item, index) => {
            const isActive = isRouteActive(pathname, item.route);
            const isPendingThis = pendingRoute === item.route;
            const isCenterItem = index === centerIndex;

            if (isCenterItem) {
              return <div key={item.title} className="w-14" />;
            }

            return (
              <DockItem
                key={item.route}
                item={item}
                isActive={isActive || isPendingThis}
                isPending={isPendingThis}
                onClick={() => handleNavigation(item.route)}
                t={t}
                variant="floating"
              />
            );
          })}
        </div>

        {/* Floating Center Button */}
        <button
          onClick={
            onCenterButtonClick ||
            (() => handleNavigation(menuItems[centerIndex].route))
          }
          className={cn(
            "absolute -top-4 left-1/2 -translate-x-1/2",
            "w-17 h-17 min-w-17 min-h-17 rounded-xl bg-primary text-primary-foreground",
            "flex items-center justify-center",
            "hover:scale-110 active:scale-95",
            "transition-transform duration-200",
            "border-4 border-background",
            "group",
            "after:content-[''] after:absolute after:-inset-2"
          )}
          style={{
            boxShadow:
              "0 4px 16px rgba(39,174,96,0.3), 0 2px 8px rgba(39,174,96,0.2), 0 1px 4px rgba(0,0,0,0.1)",
          }}
        >
          <CenterIcon className="h-7 w-7 group-hover:rotate-90 transition-transform duration-200" />
        </button>
      </div>
    </nav>
  );
}

/**
 * Classic Bottom Dock - Mode 1
 * حالت کلاسیک با طراحی حرفه‌ای
 */
function ClassicBottomDock({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { startProgress } = useNavigationProgress();
  const [isPending, startTransition] = useTransition();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const handleNavigation = (route: string) => {
    if (route === pathname) return;
    setPendingRoute(route);
    startProgress();
    startTransition(() => {
      router.push(route);
    });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <div
        className="relative bg-card/95 backdrop-blur-md border-t border-border/50 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_12px_rgba(0,0,0,0.25)]"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 2rem)",
          paddingTop: "0.75rem",
        }}
      >
        <div className="flex items-center justify-around px-2">
          {menuItems.map((item) => {
            const isActive = isRouteActive(pathname, item.route);
            const isPendingThis = pendingRoute === item.route;
            const Icon = item.icon;

            return (
              <button
                key={item.route}
                onClick={() => handleNavigation(item.route)}
                disabled={isPending}
                className={cn(
                  "relative flex flex-col items-center gap-2 px-3 py-1 rounded-xl min-w-14 min-h-14 transition-all duration-300",
                  "active:scale-95",
                  // افزایش محدوده تاچ
                  "after:content-[''] after:absolute after:-inset-2",
                  isActive || isPendingThis
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                    : "text-muted-foreground hover:bg-muted/50",
                  isPending && !isPendingThis && "opacity-50"
                )}
              >
                {/* Icon با Badge */}
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-200",
                      isPendingThis && "animate-pulse"
                    )}
                  />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -end-2 h-4 min-w-4 px-1 text-[10px] font-bold"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </div>

                {/* Label - همیشه نمایش داده میشه */}
                <span
                  className={cn(
                    "text-[10px] font-medium transition-all duration-200",
                    isActive || isPendingThis ? "font-bold" : "font-normal"
                  )}
                >
                  {t(`navigation.${item.title}`)}
                </span>

                {/* Active Dot Indicator */}
                {(isActive || isPendingThis) && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-foreground animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/**
 * Minimal V2 Bottom Dock - Mode 4
 * حالت مینیمال نسخه 2 با افکت ripple
 */
function MinimalV2BottomDock({ menuItems }: { menuItems: MenuItem[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { startProgress } = useNavigationProgress();
  const [isPending, startTransition] = useTransition();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const handleNavigation = (route: string) => {
    if (route === pathname) return;
    setPendingRoute(route);
    startProgress();
    startTransition(() => {
      router.push(route);
    });
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <div
        className="relative bg-card/95 backdrop-blur-md border-t border-border/50 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)]"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 1.75rem)",
          paddingTop: "0.75rem",
        }}
      >
        <div className="flex items-center justify-around px-2">
          {menuItems.map((item) => {
            const isActive = isRouteActive(pathname, item.route);
            const isPendingThis = pendingRoute === item.route;
            const Icon = item.icon;

            return (
              <button
                key={item.route}
                onClick={() => handleNavigation(item.route)}
                disabled={isPending}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2 py-2.5 min-w-18 min-h-14 transition-all duration-300 ease-out group",
                  "active:scale-90",
                  "after:content-[''] after:absolute after:inset-2",
                  isPending && !isPendingThis && "opacity-40"
                )}
              >
                {/* Icon Container با انیمیشن */}
                <div
                  className={cn(
                    "relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300",
                    isActive || isPendingThis
                      ? "bg-primary/15 scale-110 shadow-lg shadow-primary/20"
                      : "bg-transparent group-hover:bg-muted/50 group-hover:scale-105"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      isActive || isPendingThis
                        ? "text-primary scale-110"
                        : "text-muted-foreground",
                      isPendingThis && "animate-pulse"
                    )}
                  />

                  {/* Badge */}
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 text-[10px] font-bold ring-2 ring-background shadow-md"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}

                  {/* Ripple Effect برای Active */}
                  {(isActive || isPendingThis) && (
                    <div
                      className="absolute inset-0 rounded-2xl bg-primary/10 animate-ping"
                      style={{ animationDuration: "2s" }}
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[11px] font-medium transition-all duration-300 leading-tight",
                    isActive || isPendingThis
                      ? "text-primary font-semibold scale-105"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {t(`navigation.${item.title}`)}
                </span>

                {/* Active Line Indicator - زیر متن */}
                <div
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-primary transition-all duration-300 ease-out",
                    isActive || isPendingThis
                      ? "opacity-100 scale-x-100"
                      : "opacity-0 scale-x-0"
                  )}
                />

                {/* Dot Indicator - بالای آیکون */}
                {(isActive || isPendingThis) && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-lg shadow-primary/50" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/**
 * Dock Item Component
 */
const DockItem = memo(
  ({
    item,
    isActive,
    isPending = false,
    onClick,
    t,
    variant = "floating",
  }: {
    item: any;
    isActive: boolean;
    isPending?: boolean;
    onClick: () => void;
    t: any;
    variant?: "floating" | "classic" | "minimal";
  }) => {
    const Icon = item.icon;

    // Variant: Minimal
    if (variant === "minimal") {
      return (
        <button
          onClick={onClick}
          disabled={isPending}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 py-2.5 min-w-17 min-h-14",
            "transition-colors duration-200",
            "active:scale-95",
            "after:content-[''] after:absolute after:-inset-2",
            isActive ? "text-primary" : "text-muted-foreground",
            isPending && "opacity-70"
          )}
        >
          {/* Icon با Badge و Loading State */}
          <div className="relative">
            <Icon
              className={cn(
                "h-6 w-6 transition-all duration-200",
                isActive && "scale-110",
                isPending && "animate-pulse"
              )}
            />
            {item.badge && item.badge > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -end-2 h-4 min-w-4 px-1 text-[10px] font-bold"
              >
                {item.badge > 9 ? "9+" : item.badge}
              </Badge>
            )}
          </div>

          {/* Label */}
          <span
            className={cn(
              "text-[11px] font-medium transition-all duration-200",
              isActive && "font-semibold"
            )}
          >
            {t(`navigation.${item.title}`)}
          </span>

          {/* Active Indicator با عرض کامل */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary transition-all duration-300",
              isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )}
          />
        </button>
      );
    }

    // Variant: Floating
    if (variant === "floating") {
      return (
        <button
          onClick={onClick}
          disabled={isPending}
          className={cn(
            "relative flex flex-col items-center justify-center gap-2 px-3 py-2.5 min-w-17 min-h-14",
            "transition-colors duration-200",
            "active:scale-95 hover:scale-105",
            "after:content-[''] after:absolute after:-inset-2",
            isActive ? "text-primary" : "text-muted-foreground",
            isPending && "opacity-70"
          )}
        >
          <div className="relative">
            <Icon
              className={cn(
                "h-6 w-6 transition-all duration-200",
                isActive && "scale-110",
                isPending && "animate-pulse"
              )}
            />
            {item.badge && item.badge > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -end-2 h-4 min-w-4 px-1 text-[10px] font-bold"
              >
                {item.badge > 9 ? "9+" : item.badge}
              </Badge>
            )}
          </div>

          <span
            className={cn(
              "text-[11px] font-medium transition-all duration-200",
              isActive && "font-semibold"
            )}
          >
            {t(`navigation.${item.title}`)}
          </span>

          {/* Active Indicator با عرض کامل */}
          <div
            className={cn(
              "absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-primary transition-all duration-300",
              isActive ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            )}
          />
        </button>
      );
    }

    return null;
  }
);

DockItem.displayName = "DockItem";
