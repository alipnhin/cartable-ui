"use client";

import { Card } from "@/components/ui/card";
import {
  Timer,
  CheckCircle,
  XCircle,
  ArrowLeftRight,
  TrendingUp,
  UserX,
} from "lucide-react";
import type { TransactionStatusSummary } from "@/types/dashboard";
import { formatNumber } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface PerformanceChartProps {
  data: TransactionStatusSummary[];
  delay?: number;
}

const statusConfig: Record<
  string,
  {
    icon: typeof Timer;
    iconBg: string;
    iconColor: string;
    barColor: string;
  }
> = {
  WaitForExecution: {
    icon: Timer,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    barColor: "bg-warning",
  },
  BankSucceeded: {
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    barColor: "bg-success",
  },
  BankRejected: {
    icon: XCircle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    barColor: "bg-destructive",
  },
  Canceled: {
    icon: UserX,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    barColor: "bg-primary",
  },
};

const defaultConfig = {
  icon: Timer,
  iconBg: "bg-muted",
  iconColor: "text-muted-foreground",
  barColor: "bg-muted-foreground",
};

export default function PerformanceChart({
  data,
  delay = 0,
}: PerformanceChartProps) {
  const { t } = useTranslation();

  // Find max count for scaling
  const maxCount = Math.max(...data.map((item) => item.transactionCount), 1);

  return (
    <Card
      className="animate-fade-in border-2"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-5 py-4 flex items-center justify-between">
        <h3 className="font-bold text-base">
          {t("dashboard.charts.performance.title")}
        </h3>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
      </div>

      <div className="p-5">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              {t("dashboard.noData")}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((item, index) => {
              const config = statusConfig[item.status] || defaultConfig;
              const Icon = config.icon;
              const barWidth = (item.transactionCount / maxCount) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-md ${config.iconBg} flex items-center justify-center`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} />
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {item.statusTitle}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">
                        {formatNumber(item.transactionCount)}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground w-12 text-left">
                        {item.percent}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${config.barColor} transition-all duration-700 ease-out`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
