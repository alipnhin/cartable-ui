"use client";

import { Card } from "@/components/ui/card";
import { Timer, CheckCircle, XCircle, ArrowLeftRight, BarChart3 } from "lucide-react";
import type { TransactionStatusSummary } from "@/types/dashboard";
import { formatNumber } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface AmountVsCountChartProps {
  data: TransactionStatusSummary[];
  delay?: number;
}

const statusConfig: Record<number, {
  icon: typeof Timer;
  iconBg: string;
  iconColor: string;
}> = {
  1: {
    icon: Timer,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  3: {
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  4: {
    icon: XCircle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  5: {
    icon: ArrowLeftRight,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
};

const defaultConfig = {
  icon: Timer,
  iconBg: "bg-muted",
  iconColor: "text-muted-foreground",
};

export default function AmountVsCountChart({
  data,
  delay = 0,
}: AmountVsCountChartProps) {
  const { t } = useTranslation();

  return (
    <Card
      className="animate-fade-in border-2"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-5 py-4 flex items-center justify-between">
        <h3 className="font-bold text-base">
          {t("dashboard.charts.amountVsCount.title")}
        </h3>
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <BarChart3 className="w-4 h-4 text-primary" />
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
          <div className="space-y-4">
            {data.map((item, index) => {
              const config = statusConfig[item.status] || defaultConfig;
              const Icon = config.icon;

              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {item.statusTitle}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {t("dashboard.charts.amountVsCount.count")}
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {formatNumber(item.transactionCount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {t("dashboard.charts.detailTable.amount")}
                      </div>
                      <div className="text-lg font-bold text-foreground">
                        {formatNumber(item.totalAmount)}
                        <span className="text-xs font-normal text-muted-foreground ms-1">
                          ریال
                        </span>
                      </div>
                    </div>
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
