/**
 * UI Components با سایه‌های Built-in
 * این کامپوننت‌ها نیازی به utilities.css ندارند
 */

"use client";

import { cn } from "@/lib/utils";
import { HTMLAttributes, ButtonHTMLAttributes, forwardRef } from "react";

// =====================================
// Card Component با سایه
// =====================================
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border bg-card p-6 transition-all duration-200",
          className
        )}
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
          ...(hover && {
            ":hover": {
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
              transform: "translateY(-2px)",
            },
          }),
          ...style,
        }}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// =====================================
// Button Component با سایه سبز
// =====================================
interface ButtonWithShadowProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const ButtonWithShadow = forwardRef<
  HTMLButtonElement,
  ButtonWithShadowProps
>(({ className, variant = "primary", style, children, ...props }, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "oklch(0.62 0.15 155)",
          color: "oklch(0.99 0 0)",
          boxShadow:
            "0 2px 8px rgba(39,174,96,0.25), 0 1px 4px rgba(39,174,96,0.15)",
        };
      case "secondary":
        return {
          backgroundColor: "oklch(0.96 0.02 155)",
          color: "oklch(0.25 0.02 155)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: "var(--color-foreground)",
        };
      default:
        return {};
    }
  };

  return (
    <button
      ref={ref}
      className={cn(
        "px-6 py-3 rounded-lg font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2",
        "hover:-translate-y-0.5 active:scale-95",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      style={{
        ...getVariantStyles(),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
});
ButtonWithShadow.displayName = "ButtonWithShadow";

// =====================================
// FloatingButton Component (FAB)
// =====================================
interface FloatingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

export const FloatingButton = forwardRef<
  HTMLButtonElement,
  FloatingButtonProps
>(({ className, style, children, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "w-14 h-14 rounded-full inline-flex items-center justify-center",
        "transition-all duration-200",
        "hover:scale-110 active:scale-95",
        "border-4 border-background",
        className
      )}
      style={{
        backgroundColor: "oklch(0.62 0.15 155)",
        color: "oklch(0.99 0 0)",
        boxShadow:
          "0 4px 16px rgba(39,174,96,0.3), 0 2px 8px rgba(39,174,96,0.2), 0 1px 4px rgba(0,0,0,0.1)",
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  );
});
FloatingButton.displayName = "FloatingButton";

// =====================================
// StatCard Component با آیکون و رنگ
// =====================================
interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
  accentColor?: "primary" | "success" | "warning" | "info" | "destructive";
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      icon: Icon,
      label,
      value,
      subtitle,
      trend,
      trendUp,
      badge,
      accentColor = "primary",
      style,
      ...props
    },
    ref
  ) => {
    const accentColors = {
      primary: {
        bg: "oklch(0.62 0.15 155 / 0.1)",
        color: "oklch(0.62 0.15 155)",
        border: "oklch(0.62 0.15 155 / 0.2)",
      },
      success: {
        bg: "oklch(0.62 0.15 155 / 0.1)",
        color: "oklch(0.62 0.15 155)",
        border: "oklch(0.62 0.15 155 / 0.2)",
      },
      warning: {
        bg: "oklch(0.75 0.12 75 / 0.1)",
        color: "oklch(0.75 0.12 75)",
        border: "oklch(0.75 0.12 75 / 0.2)",
      },
      info: {
        bg: "oklch(0.68 0.10 220 / 0.1)",
        color: "oklch(0.68 0.10 220)",
        border: "oklch(0.68 0.10 220 / 0.2)",
      },
      destructive: {
        bg: "oklch(0.58 0.18 20 / 0.1)",
        color: "oklch(0.58 0.18 20)",
        border: "oklch(0.58 0.18 20 / 0.2)",
      },
    };

    const colors = accentColors[accentColor];

    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-xl border bg-card p-6 transition-all duration-200 overflow-hidden",
          "hover:-translate-y-0.5",
          className
        )}
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
          ...style,
        }}
        {...props}
      >
        {/* Accent Line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "4px",
            height: "100%",
            backgroundColor: colors.border,
            transition: "background-color 0.2s",
          }}
          className="group-hover:opacity-100"
        />

        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          {Icon && (
            <div
              style={{
                backgroundColor: colors.bg,
                color: colors.color,
                borderColor: colors.border,
              }}
              className="p-2.5 rounded-lg border transition-colors duration-200"
            >
              <Icon className="h-5 w-5" />
            </div>
          )}

          {/* Badge or Trend */}
          {badge && (
            <span className="px-2 py-1 text-xs font-semibold bg-warning/10 text-warning rounded-md">
              {badge}
            </span>
          )}
          {trend && (
            <span
              className={cn(
                "text-xs font-semibold",
                trendUp ? "text-success" : "text-destructive"
              )}
            >
              {trend}
            </span>
          )}
        </div>

        {/* Label */}
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          {label}
        </h3>

        {/* Value */}
        <p className="text-3xl font-bold text-foreground tracking-tight mb-1">
          {value}
        </p>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
    );
  }
);
StatCard.displayName = "StatCard";

// =====================================
// GlassCard Component
// =====================================
interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl border p-6 transition-all duration-200",
          className
        )}
        style={{
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          ...style,
        }}
        {...props}
      />
    );
  }
);
GlassCard.displayName = "GlassCard";

// Export all components
export default {
  Card,
  ButtonWithShadow,
  FloatingButton,
  StatCard,
  GlassCard,
};
