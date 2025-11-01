"use client";

import { Transaction, TransactionStatus } from "@/types/transaction";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import {
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
} from "lucide-react";

interface TransactionStatsProps {
  transactions: Transaction[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  const { t, locale } = useTranslation();

  // محاسبه آمار
  const stats = {
    total: transactions.length,
    succeeded: transactions.filter(
      (tx) => tx.status === TransactionStatus.BankSucceeded
    ).length,
    pending: transactions.filter(
      (tx) =>
        tx.status === TransactionStatus.WaitForBank ||
        tx.status === TransactionStatus.WaitForExecution
    ).length,
    failed: transactions.filter(
      (tx) =>
        tx.status === TransactionStatus.Failed ||
        tx.status === TransactionStatus.BankRejected
    ).length,
    totalAmount: transactions.reduce((sum, tx) => sum + tx.amount, 0),
    successAmount: transactions
      .filter((tx) => tx.status === TransactionStatus.BankSucceeded)
      .reduce((sum, tx) => sum + tx.amount, 0),
  };

  const statsCards = [
    {
      title: t("reports.totalTransactions"),
      value: stats.total.toLocaleString("fa-IR"),
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: t("reports.succeededTransactions"),
      value: stats.succeeded.toLocaleString("fa-IR"),
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: t("reports.pendingTransactions"),
      value: stats.pending.toLocaleString("fa-IR"),
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: t("reports.failedTransactions"),
      value: stats.failed.toLocaleString("fa-IR"),
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
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

      {/* کارت‌های مبلغ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-primary">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {t("reports.totalAmount")}
                </p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(stats.totalAmount, locale)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-600">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">
                  {t("reports.successAmount")}
                </p>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  {formatCurrency(stats.successAmount, locale)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
