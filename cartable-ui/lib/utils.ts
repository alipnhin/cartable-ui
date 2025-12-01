import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names, resolving any conflicts.
 *
 * @param inputs - An array of class names to merge.
 * @returns A string of merged and optimized class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number with Persian digits and thousand separators
 *
 * @param value - The number to format
 * @returns Formatted string with Persian digits
 */
export function formatNumber(value: number): string {
  const formatted = value.toLocaleString("en-US");
  return formatted;
}

/**
 * Touch Target Utilities
 * ابزارهای بهینه‌سازی اهداف لمسی برای موبایل
 *
 * استاندارد مینیمم سایز touch target:
 * - Apple HIG: 44x44 پیکسل
 * - Material Design: 48x48 پیکسل
 * - WCAG 2.1: 44x44 پیکسل
 */

/**
 * کلاس‌های استاندارد برای touch targets
 * این کلاس‌ها تضمین می‌کنند که المان‌ها حداقل 44px ارتفاع دارند
 */
export const touchTargetClasses = {
  /** مینیمم ارتفاع 44px برای تاچ - استاندارد */
  minTouch: "min-h-[44px]",

  /** مینیمم ارتفاع 48px برای تاچ - Material Design */
  minTouchMd: "min-h-[48px]",

  /** ارتفاع دقیق 44px */
  touch: "h-[44px]",

  /** ارتفاع دقیق 48px */
  touchMd: "h-[48px]",

  /** افزایش فضای تاچ با استفاده از pseudo-element */
  expandTouch: 'after:content-[""] after:absolute after:inset-[-8px]',

  /** فاصله مناسب بین touch targets */
  touchSpacing: "gap-2",
};

/**
 * تابع helper برای اضافه کردن touch target مناسب
 *
 * @param baseClasses - کلاس‌های پایه المان
 * @param options - تنظیمات touch target
 * @returns کلاس‌های ترکیب شده
 *
 * @example
 * ```tsx
 * <button className={withTouchTarget('px-4 py-2', { minHeight: '44px' })}>
 *   کلیک کنید
 * </button>
 * ```
 */
export function withTouchTarget(
  baseClasses: string,
  options: {
    minHeight?: "44px" | "48px";
    expand?: boolean;
  } = {}
): string {
  const { minHeight = "44px", expand = false } = options;

  const heightClass =
    minHeight === "48px"
      ? touchTargetClasses.minTouchMd
      : touchTargetClasses.minTouch;
  const expandClass = expand ? touchTargetClasses.expandTouch : "";

  return cn(baseClasses, heightClass, expandClass);
}

/**
 * بررسی می‌کند که آیا در موبایل هستیم
 * این تابع فقط در سمت کلاینت کار می‌کند
 *
 * @returns true اگر در موبایل باشیم
 */
export function isMobile(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768; // md breakpoint
}

/**
 * دریافت سایز مناسب touch target بر اساس دستگاه
 *
 * @returns سایز مناسب ('sm' | 'md' | 'lg')
 */
export function getResponsiveTouchSize(): "sm" | "md" | "lg" {
  if (typeof window === "undefined") return "md";

  const width = window.innerWidth;

  // موبایل: استفاده از سایز بزرگتر برای راحتی تاچ
  if (width < 768) return "lg";

  // تبلت
  if (width < 1024) return "md";

  // دسکتاپ
  return "md";
}
