"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import type { TransactionProgressResponse } from "@/types/dashboard";
import { formatNumber } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface ComparisonMetricsProps {
  data: TransactionProgressResponse;
  delay?: number;
}

export default function ComparisonMetrics({
  data,
  delay = 0,
}: ComparisonMetricsProps) {
  const { t } = useTranslation();

  const metrics = [
    {
      title: t("dashboard.charts.comparisonMetrics.successRate"),
      value: `${data.successPercent.toFixed(1)}%`,
      description: t("dashboard.charts.comparisonMetrics.fromTotal"),
      trend:
        data.successPercent >= 70
          ? "up"
          : data.successPercent >= 50
          ? "neutral"
          : "down",
      color:
        data.successPercent >= 70
          ? "text-success"
          : data.successPercent >= 50
          ? "text-warning"
          : "text-destructive",
      bgColor:
        data.successPercent >= 70
          ? "bg-success/10"
          : data.successPercent >= 50
          ? "bg-warning/10"
          : "bg-destructive/10",
    },
    {
      title: t("dashboard.charts.comparisonMetrics.avgAmount"),
      value: formatNumber(
        data.totalTransactions > 0
          ? Math.round(data.totalAmount / data.totalTransactions)
          : 0
      ),
      description: t("statistics.rial"),
      trend: "neutral",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: t("dashboard.charts.comparisonMetrics.avgSuccessAmount"),
      value: formatNumber(
        data.succeededTransactions > 0
          ? Math.round(data.succeededAmount / data.succeededTransactions)
          : 0
      ),
      description: t("statistics.rial"),
      trend: "up",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: t("dashboard.charts.comparisonMetrics.closedOrders"),
      value: formatNumber(data.closedWithdrawalOrders),
      description: t("dashboard.charts.comparisonMetrics.ordersCount"),
      trend: "neutral",
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-3.5 h-3.5" />;
      case "down":
        return <TrendingDown className="w-3.5 h-3.5" />;
      default:
        return <Minus className="w-3.5 h-3.5" />;
    }
  };

  return (
    <Card
      className="animate-fade-in border-2"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-5 py-4 flex items-center justify-between">
        <h3 className="font-bold text-base">
          {t("dashboard.charts.comparisonMetrics.title")}
        </h3>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Activity className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => (
            <div key={index} className="p-3 rounded-lg border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">
                  {metric.title}
                </span>
                <div
                  className={`w-5 h-5 rounded-md ${metric.bgColor} flex items-center justify-center`}
                >
                  <span className={metric.color}>
                    {getTrendIcon(metric.trend)}
                  </span>
                </div>
              </div>
              <div className={`text-xl font-bold mb-0.5 ${metric.color}`}>
                {metric.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div className="mt-4 p-3 rounded-lg bg-muted/50 border">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-sm mb-0.5">
                {t("dashboard.charts.comparisonMetrics.systemStatus")}
              </h4>
              <p className="text-xs text-muted-foreground">
                {formatNumber(data.totalTransactions)}{" "}
                {t("dashboard.transaction")}
              </p>
            </div>
            <div
              className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                data.successPercent >= 70
                  ? "bg-success/10 text-success"
                  : data.successPercent >= 50
                  ? "bg-warning/10 text-warning"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {data.successPercent >= 70
                ? t("dashboard.charts.comparisonMetrics.excellent")
                : data.successPercent >= 50
                ? t("dashboard.charts.comparisonMetrics.average")
                : t("dashboard.charts.comparisonMetrics.needsReview")}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
