"use client";

import {
  useEffect,
  useRef,
  useState,
  cloneElement,
  ReactElement,
} from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactElement;
  threshold?: number;
  disabled?: boolean;
  /**
   * اگر true باشد، به جای wrap کردن children در یک container جدید،
   * مستقیماً روی children (که باید scroll container باشد) event listener می‌زند
   */
  attachToScrollContainer?: boolean;
}

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  disabled = false,
  attachToScrollContainer = false,
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLElement>(null);

  const startY = useRef(0);
  const isPullingRef = useRef(false);
  const isRefreshingRef = useRef(false);

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (disabled) return;

    const container = containerRef.current;
    if (!container) return;

    // پیدا کردن scroll container واقعی
    const scrollContainer = attachToScrollContainer
      ? container
      : container.querySelector('[data-scroll-container="true"]') ||
        container.querySelector(".overflow-y-auto") ||
        container.querySelector(".overflow-auto") ||
        container;

    if (!scrollContainer) return;

    const onTouchStart = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (isRefreshingRef.current) return;

      // بررسی scroll position روی scroll container واقعی
      const scrollTop =
        scrollContainer === document.documentElement ||
        scrollContainer === document.body
          ? window.scrollY || window.pageYOffset
          : (scrollContainer as HTMLElement).scrollTop;

      if (scrollTop > 0) return;

      startY.current = touchEvent.touches[0].clientY;
      isPullingRef.current = false;
    };

    const onTouchMove = (e: Event) => {
      const touchEvent = e as TouchEvent;
      if (isRefreshingRef.current) return;

      const currentY = touchEvent.touches[0].clientY;
      const delta = currentY - startY.current;

      // فقط Pull رو به پایین
      if (delta <= 0) return;

      // بررسی scroll position روی scroll container واقعی
      const scrollTop =
        scrollContainer === document.documentElement ||
        scrollContainer === document.body
          ? window.scrollY || window.pageYOffset
          : (scrollContainer as HTMLElement).scrollTop;

      // اگر حتی ذره‌ای اسکرول داریم، Pull ممنوع
      if (scrollTop > 0) return;

      // از اینجا Pull واقعی شروع می‌شود
      if (!isPullingRef.current) {
        isPullingRef.current = true;
      }

      e.preventDefault();

      const resistance = 0.5;
      const adjusted = Math.min(delta * resistance, threshold * 1.5);
      setPullDistance(adjusted);
    };

    const onTouchEnd = async () => {
      if (!isPullingRef.current) return;

      isPullingRef.current = false;

      if (pullDistance >= threshold && !isRefreshingRef.current) {
        isRefreshingRef.current = true;
        setIsRefreshing(true);

        try {
          await onRefresh();
        } finally {
          isRefreshingRef.current = false;
          setIsRefreshing(false);
          setPullDistance(0);
        }
      } else {
        setPullDistance(0);
      }
    };

    scrollContainer.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    scrollContainer.addEventListener("touchmove", onTouchMove, {
      passive: false,
    });
    scrollContainer.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      scrollContainer.removeEventListener("touchstart", onTouchStart);
      scrollContainer.removeEventListener("touchmove", onTouchMove);
      scrollContainer.removeEventListener("touchend", onTouchEnd);
    };
  }, [onRefresh, threshold, disabled, pullDistance, attachToScrollContainer]);

  const progress = Math.min((pullDistance / threshold) * 100, 100);
  const rotation = (pullDistance / threshold) * 360;
  const translateY = isRefreshing ? threshold : pullDistance;

  // اگر attachToScrollContainer فعال باشد، children را به عنوان scroll container استفاده می‌کنیم
  if (attachToScrollContainer) {
    const childProps = children.props as any;
    return cloneElement(children, {
      ref: containerRef as any,
      children: (
        <>
          {/* Indicator */}
          <div
            className={cn(
              "pointer-events-none fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200",
              translateY > 0 ? "opacity-100" : "opacity-0"
            )}
            style={{ height: translateY }}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-full bg-primary/10 p-3">
                <RefreshCw
                  className={cn(
                    "h-5 w-5 text-primary",
                    isRefreshing && "animate-spin"
                  )}
                  style={{
                    transform: !isRefreshing
                      ? `rotate(${rotation}deg)`
                      : undefined,
                  }}
                />
              </div>

              {!isRefreshing && (
                <span className="text-xs text-muted-foreground">
                  {progress >= 100
                    ? "رها کنید برای بارگذاری مجدد"
                    : "بکشید برای بارگذاری مجدد"}
                </span>
              )}

              {isRefreshing && (
                <span className="text-xs text-primary">
                  در حال بارگذاری...
                </span>
              )}
            </div>
          </div>

          {/* Content با translateY */}
          <div
            className="transition-transform duration-200 will-change-transform"
            style={{ transform: `translateY(${translateY}px)` }}
          >
            {childProps.children}
          </div>
        </>
      ),
    } as any);
  }

  // حالت قدیمی: wrap کردن children در یک container
  return (
    <div ref={containerRef as any} className="relative h-full">
      {/* Indicator */}
      <div
        className={cn(
          "pointer-events-none absolute top-0 left-0 right-0 z-50 flex items-center justify-center transition-all duration-200",
          translateY > 0 ? "opacity-100" : "opacity-0"
        )}
        style={{ height: translateY }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-3">
            <RefreshCw
              className={cn(
                "h-5 w-5 text-primary",
                isRefreshing && "animate-spin"
              )}
              style={{
                transform: !isRefreshing ? `rotate(${rotation}deg)` : undefined,
              }}
            />
          </div>

          {!isRefreshing && (
            <span className="text-xs text-muted-foreground">
              {progress >= 100
                ? "رها کنید برای بارگذاری مجدد"
                : "بکشید برای بارگذاری مجدد"}
            </span>
          )}

          {isRefreshing && (
            <span className="text-xs text-primary">در حال بارگذاری...</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="transition-transform duration-200 will-change-transform"
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {children}
      </div>
    </div>
  );
}
