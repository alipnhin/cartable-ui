"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TransactionProgressResponse } from "@/types/dashboard";
import { formatNumber } from "@/lib/utils";

interface ComparisonMetricsProps {
  data: TransactionProgressResponse;
  delay?: number;
}

export default function ComparisonMetrics({
  data,
  delay = 0,
}: ComparisonMetricsProps) {
  const metrics = [
    {
      title: "نرخ موفقیت",
      value: `${data.successPercent.toFixed(1)}%`,
      description: "از کل تراکنش‌ها",
      trend: data.successPercent >= 70 ? "up" : data.successPercent >= 50 ? "neutral" : "down",
      color: data.successPercent >= 70 ? "text-success" : data.successPercent >= 50 ? "text-warning" : "text-destructive",
    },
    {
      title: "میانگین مبلغ تراکنش",
      value: formatNumber(
        data.totalTransactions > 0
          ? Math.round(data.totalAmount / data.totalTransactions)
          : 0
      ),
      description: "ریال",
      trend: "neutral",
      color: "text-primary",
    },
    {
      title: "میانگین تراکنش موفق",
      value: formatNumber(
        data.succeededTransactions > 0
          ? Math.round(data.succeededAmount / data.succeededTransactions)
          : 0
      ),
      description: "ریال",
      trend: "up",
      color: "text-success",
    },
    {
      title: "دستورات بسته شده",
      value: formatNumber(data.closedWithdrawalOrders),
      description: "تعداد دستورات",
      trend: "neutral",
      color: "text-muted-foreground",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  return (
    <Card
      className="animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-6 pt-5 pb-4">
        <h3 className="font-bold text-lg mb-1">شاخص‌های کلیدی</h3>
        <p className="text-muted-foreground text-sm">متریک‌های محاسبه شده</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {metric.title}
                </span>
                <span className={metric.color}>{getTrendIcon(metric.trend)}</span>
              </div>
              <div className={`text-2xl font-bold mb-1 ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* Performance Indicator */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-success/10 border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm mb-1">وضعیت کلی سیستم</h4>
              <p className="text-xs text-muted-foreground">
                بر اساس نرخ موفقیت و تعداد تراکنش‌ها
              </p>
            </div>
            <div className="text-right">
              <div
                className={`text-2xl font-bold ${
                  data.successPercent >= 70
                    ? "text-success"
                    : data.successPercent >= 50
                    ? "text-warning"
                    : "text-destructive"
                }`}
              >
                {data.successPercent >= 70
                  ? "عالی"
                  : data.successPercent >= 50
                  ? "متوسط"
                  : "نیاز به بررسی"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {formatNumber(data.totalTransactions)} تراکنش
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
