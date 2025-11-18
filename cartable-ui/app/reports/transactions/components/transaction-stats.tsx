"use client";

import { TransactionItem } from "@/services/transactionService";
import { Card, CardContent } from "@/components/ui/card";
import useTranslation from "@/hooks/useTranslation";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

interface TransactionStatsProps {
  transactions: TransactionItem[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  const { t } = useTranslation();

  // محاسبه آمار بر اساس status number از API
  // 3 = succeeded, 2 = waiting for execution, 5 = waiting for bank
  // 4 = rejected by bank, 7 = canceled
  const stats = {
    total: transactions.length,
    succeeded: transactions.filter((tx) => tx.status === 3).length,
    pending: transactions.filter(
      (tx) => tx.status === 2 || tx.status === 5 || tx.status === 1
    ).length,
    failed: transactions.filter(
      (tx) => tx.status === 4 || tx.status === 7 || tx.status === 6
    ).length,
    totalAmount: transactions.reduce((sum, tx) => sum + tx.amount, 0),
    successAmount: transactions
      .filter((tx) => tx.status === 3)
      .reduce((sum, tx) => sum + tx.amount, 0),
  };

  const statsCards = [
    {
      title: t("reports.totalTransactions"),
      value: stats.total.toLocaleString("fa-IR"),
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      title: t("reports.succeededTransactions"),
      value: stats.succeeded.toLocaleString("fa-IR"),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      title: t("reports.pendingTransactions"),
      value: stats.pending.toLocaleString("fa-IR"),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      title: t("reports.failedTransactions"),
      value: stats.failed.toLocaleString("fa-IR"),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
  ];

  return (
    <div className="space-y-4">
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
