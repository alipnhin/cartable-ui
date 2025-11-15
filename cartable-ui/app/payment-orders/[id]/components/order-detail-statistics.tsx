"use client";

import { useMemo } from "react";
import { PaymentOrderDetail } from "@/types/order";
import { TransactionStatus, PaymentMethodEnum } from "@/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Timer,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OrderDetailStatisticsProps {
  order: PaymentOrderDetail;
}

export function OrderDetailStatistics({ order }: OrderDetailStatisticsProps) {
  const { t, locale } = useTranslation();

  // محاسبه آمار تراکنش‌ها
  const statistics = useMemo(() => {
    const transactions = order.transactions;
    const total = transactions.length;

    const succeeded = transactions.filter(
      (tx) => tx.status === TransactionStatus.BankSucceeded
    ).length;

    const failed = transactions.filter(
      (tx) =>
        tx.status === TransactionStatus.BankRejected ||
        tx.status === TransactionStatus.Failed
    ).length;

    const pending = transactions.filter(
      (tx) =>
        tx.status === TransactionStatus.WaitForBank ||
        tx.status === TransactionStatus.Registered ||
        tx.status === TransactionStatus.WaitForExecution
    ).length;

    const succeededAmount = transactions
      .filter((tx) => tx.status === TransactionStatus.BankSucceeded)
      .reduce((sum, tx) => sum + tx.amount, 0);

    const failedAmount = transactions
      .filter(
        (tx) =>
          tx.status === TransactionStatus.BankRejected ||
          tx.status === TransactionStatus.Failed
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const pendingAmount = transactions
      .filter(
        (tx) =>
          tx.status === TransactionStatus.WaitForBank ||
          tx.status === TransactionStatus.Registered ||
          tx.status === TransactionStatus.WaitForExecution
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const averageAmount = total > 0 ? order.totalAmount / total : 0;
    const successRate = total > 0 ? (succeeded / total) * 100 : 0;

    // آمار انواع پرداخت
    const paymentTypes = {
      internal: transactions.filter(
        (tx) => tx.paymentType === PaymentMethodEnum.Internal
      ).length,
      paya: transactions.filter(
        (tx) => tx.paymentType === PaymentMethodEnum.Paya
      ).length,
      satna: transactions.filter(
        (tx) => tx.paymentType === PaymentMethodEnum.Satna
      ).length,
    };

    const paymentTypePercentages = {
      internal: total > 0 ? (paymentTypes.internal / total) * 100 : 0,
      paya: total > 0 ? (paymentTypes.paya / total) * 100 : 0,
      satna: total > 0 ? (paymentTypes.satna / total) * 100 : 0,
    };

    return {
      total,
      succeeded,
      failed,
      pending,
      succeededAmount,
      failedAmount,
      pendingAmount,
      averageAmount,
      successRate,
      paymentTypes,
      paymentTypePercentages,
    };
  }, [order.transactions, order.totalAmount]);

  // محاسبه زمان پردازش
  const processingTime = useMemo(() => {
    if (order.processedAt && order.submittedToBankAt) {
      const start = new Date(order.submittedToBankAt).getTime();
      const end = new Date(order.processedAt).getTime();
      const diffMinutes = Math.floor((end - start) / (1000 * 60));
      return diffMinutes;
    }
    return null;
  }, [order.processedAt, order.submittedToBankAt]);

  // تاریخ اولین و آخرین تراکنش
  const transactionDates = useMemo(() => {
    if (order.transactions.length === 0) return null;

    const sortedTransactions = [...order.transactions].sort(
      (a, b) =>
        new Date(a.createdDateTime).getTime() -
        new Date(b.createdDateTime).getTime()
    );

    return {
      first: sortedTransactions[0].createdDateTime,
      last: sortedTransactions[sortedTransactions.length - 1].createdDateTime,
    };
  }, [order.transactions]);

  return (
    <div className="space-y-6">
      {/* ردیف اول: نمودار و جزئیات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* نمودار Donut */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>{t("statistics.statusChart")}</span>
              <span className="text-sm font-normal text-success">
                {t("statistics.successRate")}:{" "}
                {statistics.successRate.toFixed(1)}%
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("statistics.statusBreakdown")}
            </p>
          </CardHeader>
          <CardContent>
            {/* نمودار ساده با CSS */}
            <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-6">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #10B981 0% ${statistics.successRate}%,
                    #EF4444 ${statistics.successRate}% ${
                    statistics.successRate +
                    (statistics.failed / statistics.total) * 100
                  }%,
                    #F59E0B ${
                      statistics.successRate +
                      (statistics.failed / statistics.total) * 100
                    }% 100%
                  )`,
                }}
              >
                <div className="absolute inset-[25%] bg-white dark:bg-card rounded-full flex flex-col items-center justify-center shadow-lg">
                  <div className="text-2xl font-bold">{statistics.total}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[80%] text-center">
                    {t("transactions.paymentType")}
                  </div>
                </div>
              </div>
            </div>

            {/* لیست وضعیت‌ها */}
            <div className="space-y-3">
              {statistics.succeeded > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span className="text-sm">{t("statistics.succeeded")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {statistics.succeeded}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({statistics.successRate.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
              {statistics.failed > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span className="text-sm">{t("statistics.failed")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {statistics.failed}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (
                      {((statistics.failed / statistics.total) * 100).toFixed(
                        1
                      )}
                      %)
                    </span>
                  </div>
                </div>
              )}
              {statistics.pending > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span className="text-sm">{t("statistics.pending")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {statistics.pending}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      (
                      {((statistics.pending / statistics.total) * 100).toFixed(
                        1
                      )}
                      %)
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* جزئیات وضعیت‌ها */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">
              {t("statistics.statusDetails")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("statistics.statusBreakdown")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {statistics.succeeded > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {t("statistics.succeeded")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {statistics.succeeded}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                        {statistics.successRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(statistics.succeededAmount, locale)}{" "}
                    {t("statistics.rial")}
                  </div>
                </div>
              </div>
            )}

            {statistics.failed > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {t("statistics.failed")}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {statistics.failed}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                        {((statistics.failed / statistics.total) * 100).toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(statistics.failedAmount, locale)}{" "}
                    {t("statistics.rial")}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t("statistics.transactionReason")}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-warning/10 text-warning">
                  100%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("transactions.transactionReasons.investmentAndBourse")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* خلاصه مالی */}
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="bg-linear-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <h3 className="text-base font-semibold mb-1">
              {t("statistics.financialSummary")}
            </h3>
            <div className="text-center mt-4">
              <div className="text-xs opacity-80">
                {t("statistics.totalTransactionAmount")}
              </div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(order.totalAmount, locale)}
              </div>
              <div className="text-xs opacity-80">{t("statistics.rial")}</div>
            </div>
          </div>

          <CardContent className="pt-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <ArrowUpCircle className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {t("statistics.successfulAmount")}
                </div>
                <div className="font-medium text-sm truncate">
                  {formatCurrency(statistics.succeededAmount, locale)}
                  <span className="text-xs text-muted-foreground ms-1">
                    {t("statistics.rial")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <ArrowDownCircle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {t("statistics.failedAmount")}
                </div>
                <div className="font-medium text-sm truncate">
                  {formatCurrency(statistics.failedAmount, locale)}
                  <span className="text-xs text-muted-foreground ms-1">
                    {t("statistics.rial")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Timer className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {t("statistics.pendingAmount")}
                </div>
                <div className="font-medium text-sm truncate">
                  {formatCurrency(statistics.pendingAmount, locale)}
                  <span className="text-xs text-muted-foreground ms-1">
                    {t("statistics.rial")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted-foreground">
                  {t("statistics.averageTransaction")}
                </div>
                <div className="font-medium text-sm truncate">
                  {formatCurrency(statistics.averageAmount, locale)}
                  <span className="text-xs text-muted-foreground ms-1">
                    {t("statistics.rial")}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ردیف دوم: انواع پرداخت و تاریخچه زمانی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* انواع پرداخت */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("statistics.paymentTypes")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("statistics.paymentTypeDistribution")}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {statistics.paymentTypes.internal > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-success/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-success" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("transactions.paymentTypes.internal")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {statistics.paymentTypes.internal}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                      {statistics.paymentTypePercentages.internal.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={statistics.paymentTypePercentages.internal}
                  className="h-2"
                />
              </div>
            )}

            {statistics.paymentTypes.satna > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("transactions.paymentTypes.satna")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {statistics.paymentTypes.satna}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {statistics.paymentTypePercentages.satna.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={statistics.paymentTypePercentages.satna}
                  className="h-2"
                />
              </div>
            )}

            {statistics.paymentTypes.paya > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-blue-500" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("transactions.paymentTypes.paya")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {statistics.paymentTypes.paya}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500">
                      {statistics.paymentTypePercentages.paya.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress
                  value={statistics.paymentTypePercentages.paya}
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* تاریخچه زمانی */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("statistics.timeStatistics")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("statistics.timelineInformation")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {transactionDates && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">
                        {t("statistics.firstTransaction")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline me-1" />
                        {formatDate(transactionDates.first, locale)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Clock className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">
                        {t("statistics.lastTransaction")}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 inline me-1" />
                        {formatDate(transactionDates.last, locale)}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {order.updatedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      {t("statistics.lastStatusUpdate")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline me-1" />
                      {formatDate(order.updatedAt, locale)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {processingTime !== null && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-primary mb-1">
                      {t("statistics.averageProcessingTime")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {processingTime} {t("statistics.minutes")}
                    </div>
                  </div>
                  <Timer className="h-8 w-8 text-primary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
