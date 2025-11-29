"use client";

import { Card } from "@/components/ui/card";
import {
  Timer,
  CheckCircle,
  XCircle,
  ArrowLeftRight,
  UserX,
} from "lucide-react";
import type { TransactionStatusSummary } from "@/types/dashboard";
import { formatNumber } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface TransactionStatusChartProps {
  data: TransactionStatusSummary[];
  delay?: number;
}

const statusConfig: Record<
  string,
  {
    icon: typeof Timer;
    iconBg: string;
    iconColor: string;
    progressColor: string;
  }
> = {
  WaitForExecution: {
    icon: Timer,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    progressColor: "bg-warning",
  },
  BankSucceeded: {
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    progressColor: "bg-success",
  },
  BankRejected: {
    icon: XCircle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    progressColor: "bg-destructive",
  },
  Canceled: {
    icon: UserX,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    progressColor: "bg-primary",
  },
};

const defaultConfig = {
  icon: Timer,
  iconBg: "bg-muted",
  iconColor: "text-muted-foreground",
  progressColor: "bg-muted-foreground",
};

export default function TransactionStatusChart({
  data,
  delay = 0,
}: TransactionStatusChartProps) {
  const { t } = useTranslation();

  return (
    <Card
      className="animate-fade-in border-2"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-5 py-4">
        <h3 className="font-bold text-base">
          {t("dashboard.charts.transactionStatus.title")}
        </h3>
      </div>

      <div className="p-5 space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              {t("dashboard.noData")}
            </p>
          </div>
        ) : (
          data.map((item, index) => {
            const config = statusConfig[item.status] || defaultConfig;
            const Icon = config.icon;

            return (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${config.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-foreground truncate">
                      {item.statusTitle}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {formatNumber(item.transactionCount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${config.progressColor} transition-all duration-500`}
                        style={{ width: `${Math.min(item.percent, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground w-10 text-left">
                      {item.percent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
