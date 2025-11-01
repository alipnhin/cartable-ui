/**
 * Enhanced BottomDock Component - نسخه نهایی
 * منوی پایین موبایل با 2 مدل مختلف
 * Mode 1: Classic with Labels (دارای آیکون + متن)
 * Mode 2: Floating Center Button (دکمه وسطی برجسته)
 */

"use client";

import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { dockMenuItems, isRouteActive } from "@/config/navigation";
import useTranslation from "@/hooks/useTranslation";
import { Plus } from "lucide-react";

type BottomDockMode = "classic" | "floating";

interface BottomDockProps {
  mode?: BottomDockMode;
  onCenterButtonClick?: () => void;
}

export function BottomDock({
  mode = "floating",
  onCenterButtonClick,
}: BottomDockProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  if (mode === "classic") {
    return <ClassicBottomDock />;
  }

  return <FloatingBottomDock onCenterButtonClick={onCenterButtonClick} />;
}

/**
 * Floating Bottom Dock - Mode 2
 * منوی با دکمه وسطی برجسته و شناور
 */
function FloatingBottomDock({
  onCenterButtonClick,
}: {
  onCenterButtonClick?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  // برای مدل floating، آیتم وسطی را پیدا می‌کنیم
  const centerIndex = Math.floor(dockMenuItems.length / 2);
  const CenterIcon = dockMenuItems[centerIndex]?.icon || Plus;

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      {/* Background با shadow بهتر + safe area برای iOS */}
      <div
        className="relative bg-card/95 backdrop-blur-md border-t border-border/50 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.3)]"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom), 0.75rem)",
          height: "calc(6rem + env(safe-area-inset-bottom))",
        }}
      >
        {/* Menu Items */}
        <div className="flex h-full items-end justify-around pb-3">
          {dockMenuItems.map((item, index) => {
            const isActive = isRouteActive(pathname, item.route);
            const Icon = item.icon;
            const isCenterItem = index === centerIndex;

            // آیتم وسطی را رندر نمی‌کنیم (جای آن خالی می‌ماند)
            if (isCenterItem) {
              return <div key={item.title} className="w-14" />;
            }

            return (
              <button
                key={item.title}
                onClick={() => router.push(item.route)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1.5 px-3 py-2 transition-all duration-300 ease-out",
                  "active:scale-95 hover:scale-105",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {/* Icon با Badge */}
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-all duration-300 ease-out",
                      isActive && "scale-110"
                    )}
                  />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -end-2 h-4 min-w-4 px-1 text-[10px] font-bold animate-pulse"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[11px] font-medium transition-all duration-300 ease-out",
                    isActive && "font-semibold scale-105"
                  )}
                >
                  {t(`navigation.${item.title}`)}
                </span>

                {/* Active Indicator - Dot با انیمیشن */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Floating Center Button (دکمه شناور وسطی) */}
        <button
          onClick={
            onCenterButtonClick ||
            (() => router.push(dockMenuItems[centerIndex].route))
          }
          className={cn(
            "absolute -top-4 left-1/2 -translate-x-1/2",
            "w-16 h-16 rounded-xl bg-primary text-primary-foreground",
            "flex items-center justify-center",
            "hover:scale-110 active:scale-95",
            "transition-all duration-200",
            "border-4 border-background",
            "group"
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
 * منوی کلاسیک با آیکون + متن در یک سطح
 */
function ClassicBottomDock() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden">
      <div
        className="relative bg-card/95 backdrop-blur-md border-t border-border/50 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] dark:shadow-[0_-2px_12px_rgba(0,0,0,0.25)]"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          height: "calc(6rem + env(safe-area-inset-bottom))",
        }}
      >
        <div className="flex h-full items-center justify-around px-2">
          {dockMenuItems.map((item) => {
            const isActive = isRouteActive(pathname, item.route);
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                onClick={() => router.push(item.route)}
                className={cn(
                  "relative flex items-center gap-2 px-4 mb-6 py-2 rounded-lg transition-all duration-200",
                  "active:scale-95",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {/* Icon با Badge */}
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {item.badge && item.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -end-2 h-4 min-w-4 px-1 text-[10px] font-bold"
                    >
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </div>

                {/* Label فقط برای آیتم فعال */}
                {isActive && (
                  <span className="text-sm font-semibold">
                    {t(`navigation.${item.title}`)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
