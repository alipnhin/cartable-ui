"use client";

import { TransactionItem } from "@/services/transactionService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useTranslation from "@/hooks/useTranslation";
import { PieChart, TrendingUp } from "lucide-react";

interface TransactionChartsProps {
  transactions: TransactionItem[];
}

export function TransactionCharts({ transactions }: TransactionChartsProps) {
  const { t } = useTranslation();

  // محاسبه داده‌های چارت وضعیت بر اساس status number از API
  // 3 = succeeded, 2 = waiting for execution, 5 = waiting for bank
  // 4 = rejected by bank, 7 = canceled
  const statusData = {
    succeeded: transactions.filter((tx) => tx.status === 3).length,
    pending: transactions.filter(
      (tx) => tx.status === 2 || tx.status === 5 || tx.status === 1
    ).length,
    failed: transactions.filter(
      (tx) => tx.status === 4 || tx.status === 7 || tx.status === 6
    ).length,
  };

  const total = transactions.length || 1;
  const statusPercentages = {
    succeeded: ((statusData.succeeded / total) * 100).toFixed(1),
    pending: ((statusData.pending / total) * 100).toFixed(1),
    failed: ((statusData.failed / total) * 100).toFixed(1),
  };

  // محاسبه داده‌های چارت روزانه (7 روز گذشته)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split("T")[0];
  });

  const dailyData = last7Days.map((date) => {
    const dayTransactions = transactions.filter((tx) =>
      tx.createdDateTime.startsWith(date)
    );
    return {
      date,
      count: dayTransactions.length,
      amount: dayTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    };
  });

  const maxCount = Math.max(...dailyData.map((d) => d.count), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* چارت وضعیت - Bar Chart ساده */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            {t("reports.statusDistribution")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* موفق */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {t("reports.succeededTransactions")}
              </span>
              <span className="text-sm text-muted-foreground">
                {statusData.succeeded} ({statusPercentages.succeeded}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${statusPercentages.succeeded}%` }}
              />
            </div>
          </div>

          {/* در انتظار */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {t("reports.pendingTransactions")}
              </span>
              <span className="text-sm text-muted-foreground">
                {statusData.pending} ({statusPercentages.pending}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600 transition-all"
                style={{ width: `${statusPercentages.pending}%` }}
              />
            </div>
          </div>

          {/* ناموفق */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                {t("reports.failedTransactions")}
              </span>
              <span className="text-sm text-muted-foreground">
                {statusData.failed} ({statusPercentages.failed}%)
              </span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all"
                style={{ width: `${statusPercentages.failed}%` }}
              />
            </div>
          </div>

          {/* خلاصه */}
          <div className="pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">{t("reports.total")}</span>
              <span className="text-lg font-bold">{transactions.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* چارت روند 7 روز */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t("reports.last7DaysTrend")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dailyData.map((day) => (
              <div key={day.date}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">
                    {new Date(day.date).toLocaleDateString("fa-IR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="text-xs font-medium">{day.count}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(day.count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("reports.avgDaily")}
              </span>
              <span className="font-medium">
                {(dailyData.reduce((sum, d) => sum + d.count, 0) / 7).toFixed(
                  1
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
