/**
 * Enhanced Dashboard Page
 * استفاده از کامپوننت‌های shadcn/ui با استایل‌های inline
 */

"use client";

import { AppLayout, PageHeader } from "@/components/layout";
import { Plus, TrendingUp, Clock, Wallet, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <AppLayout>
      <PageHeader
        title={t("dashboard.pageTitle")}
        description={t("dashboard.pageSubtitle")}
        actions={
          <Button
            className="hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
            style={{
              boxShadow:
                "0 2px 8px rgba(39,174,96,0.25), 0 1px 4px rgba(39,174,96,0.15)",
            }}
          >
            <Plus className="me-2 h-4 w-4" />
            {t("common.buttons.new")}
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Wallet}
          label="کل مبلغ دستورات"
          value="۱۲۰ میلیون"
          trend="+12%"
          trendUp={true}
          accentColor="primary"
        />

        <StatCard
          icon={Clock}
          label="در انتظار تأیید"
          value="۸"
          badge="فوری"
          accentColor="warning"
        />

        <StatCard
          icon={Activity}
          label="حساب‌های فعال"
          value="۵"
          accentColor="success"
        />

        <StatCard
          icon={TrendingUp}
          label="آخرین فعالیت"
          value="امروز"
          subtitle="۲ ساعت پیش"
          accentColor="info"
        />
      </div>

      {/* محتوای اضافی */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <ActivityCard />
        <PerformanceCard />
      </div>
    </AppLayout>
  );
}

// =====================================
// Stat Card Component
// =====================================
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtitle?: string;
  trend?: string;
  trendUp?: boolean;
  badge?: string;
  accentColor?: "primary" | "success" | "warning" | "info" | "destructive";
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend,
  trendUp,
  badge,
  accentColor = "primary",
}: StatCardProps) {
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
      className="group relative rounded-xl border bg-card p-6 transition-all duration-200 overflow-hidden hover:-translate-y-0.5"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Accent Line */}
      <div
        className="absolute top-0 right-0 w-1 h-full transition-all duration-200 group-hover:opacity-100"
        style={{ backgroundColor: colors.border }}
      />

      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div
          className="p-2.5 rounded-lg border transition-colors duration-200"
          style={{
            backgroundColor: colors.bg,
            color: colors.color,
            borderColor: colors.border,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>

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
      <p className="text-2xl font-bold text-foreground tracking-tight mb-1">
        {value}
      </p>

      {/* Subtitle */}
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

// =====================================
// Activity Card Component
// =====================================
function ActivityCard() {
  return (
    <div
      className="rounded-xl border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h3 className="text-lg font-semibold mb-4">فعالیت‌های اخیر</h3>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium">تراکنش شماره {i}</p>
              <p className="text-xs text-muted-foreground">۲ ساعت پیش</p>
            </div>
            <span className="text-sm font-semibold text-primary">۵ میلیون</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// =====================================
// Performance Card Component
// =====================================
function PerformanceCard() {
  return (
    <div
      className="rounded-xl border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      <h3 className="text-lg font-semibold mb-4">خلاصه عملکرد</h3>
      <div className="space-y-4">
        <ProgressItem
          label="تکمیل شده"
          value={75}
          color="oklch(0.62 0.15 155)"
        />
        <ProgressItem
          label="در حال انجام"
          value={15}
          color="oklch(0.75 0.12 75)"
        />
        <ProgressItem label="لغو شده" value={10} color="oklch(0.58 0.18 20)" />
      </div>
    </div>
  );
}

// =====================================
// Progress Item Component
// =====================================
interface ProgressItemProps {
  label: string;
  value: number;
  color: string;
}

function ProgressItem({ label, value, color }: ProgressItemProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${value}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}
