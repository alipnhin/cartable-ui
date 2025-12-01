"use client";

import { WithdrawalStatistics, PaymentItemStatusEnum } from "@/types/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency,
  formatCurrencyNoneUnit,
  formatDate,
} from "@/lib/helpers";
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
  BarChart3,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
interface OrderDetailStatisticsProps {
  statistics: WithdrawalStatistics;
}

export function OrderDetailStatistics({
  statistics,
}: OrderDetailStatisticsProps) {
  const { t, locale } = useTranslation();

  const {
    totalTransactions,
    totalAmount,
    overallSuccessRate,
    statusStatistics,
    paymentTypeStatistics,
    reasonCodeStatistics,
    financialStatistics,
    timeStatistics,
  } = statistics;

  // محاسبه تعداد تراکنش‌ها بر اساس وضعیت
  const succeededCount =
    statusStatistics.breakdown.find(
      (s) => s.status === PaymentItemStatusEnum.BankSucceeded
    )?.count || 0;
  const failedCount = statusStatistics.breakdown
    .filter(
      (s) =>
        s.status === PaymentItemStatusEnum.BankRejected ||
        s.status === PaymentItemStatusEnum.Failed ||
        s.status === PaymentItemStatusEnum.Canceled
    )
    .reduce((sum, s) => sum + s.count, 0);
  const pendingCount = statusStatistics.breakdown
    .filter(
      (s) =>
        s.status === PaymentItemStatusEnum.WaitForExecution ||
        s.status === PaymentItemStatusEnum.WaitForBank ||
        s.status === PaymentItemStatusEnum.Registered
    )
    .reduce((sum, s) => sum + s.count, 0);
  const colors = {
    success: "#10b981",
    failed: "#ef4444",
    pending: "#f59e0b",
  };

  const data = [
    {
      name: t("statistics.succeeded"),
      value: succeededCount,
      color: colors.success,
      percent: overallSuccessRate.toFixed(1),
    },
    {
      name: t("statistics.failed"),
      value: failedCount,
      color: colors.failed,
      percent: statusStatistics.failureRate.toFixed(1),
    },
    {
      name: t("statistics.pending"),
      value: pendingCount,
      color: colors.pending,
      percent: (
        100 -
        overallSuccessRate -
        statusStatistics.failureRate
      ).toFixed(1),
    },
  ];
  return (
    <div className="space-y-6">
      {/* ردیف اول: نمودار و جزئیات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* نمودار Donut */}

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              <span>{t("orderDetail.statistics.transactionStatuses")}</span>
              <span className="font-semibold">
                {overallSuccessRate.toFixed(1)}%
              </span>
            </CardTitle>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {t("orderDetail.statistics.transactionStatusDistribution")}
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="relative w-full h-48 mb-4">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    innerRadius="60%"
                    outerRadius="85%"
                    stroke="none"
                    animationBegin={200}
                    animationDuration={900}
                    isAnimationActive
                  >
                    {data.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "none",
                      backdropFilter: "blur(8px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value, _, props) => [
                      `${value} (${props.payload.percent}%)`,
                      props.payload.name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* متن وسط دونات */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center select-none">
                  <div className="text-lg font-bold">{totalTransactions}</div>
                  <div className="text-[10px] text-neutral-600 dark:text-neutral-400">
                    {t("dashboard.transaction")}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend مدرن */}
            <div className="divide-y divide-neutral-200/50 dark:divide-neutral-800/50">
              {data
                .filter((x) => x.value > 0)
                .map((row, index) => (
                  <div
                    className="flex items-center justify-between py-2 text-sm"
                    key={index}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: row.color }}
                      />
                      <span>{row.name}</span>
                    </div>
                    <span className="text-xs text-neutral-600 dark:text-neutral-300">
                      {row.value} ({row.percent}%)
                    </span>
                  </div>
                ))}
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
              {t("orderDetail.statistics.statusAndAmountDistribution")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* موفق */}
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
                    <span className="text-sm font-bold">{succeededCount}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success font-medium">
                      {overallSuccessRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrencyNoneUnit(
                    financialStatistics.successfulAmount,
                    locale
                  )}{" "}
                  {t("statistics.rial")}
                </div>
              </div>
            </div>

            {/* ناموفق */}
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
                    <span className="text-sm font-bold">{failedCount}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive font-medium">
                      {statusStatistics.failureRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrencyNoneUnit(
                    financialStatistics.failedAmount,
                    locale
                  )}{" "}
                  {t("statistics.rial")}
                </div>
              </div>
            </div>

            {/* در انتظار */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {t("statistics.pending")}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{pendingCount}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-warning/10 text-warning font-medium">
                      {(
                        100 -
                        overallSuccessRate -
                        statusStatistics.failureRate
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrencyNoneUnit(
                    financialStatistics.pendingAmount,
                    locale
                  )}{" "}
                  {t("statistics.rial")}
                </div>
              </div>
            </div>

            {reasonCodeStatistics.breakdown.length > 0 && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {t("orderDetail.statistics.mostUsedReasonCode")}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {reasonCodeStatistics.mostUsedReasonPercentage.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {reasonCodeStatistics.breakdown[0]?.reasonName ||
                    reasonCodeStatistics.mostUsedReason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* خلاصه مالی */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {t("statistics.financialSummary")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* مبلغ کل */}
            <div className="text-center py-4 border-b">
              <div className="text-sm text-muted-foreground mb-1">
                {t("orderDetail.statistics.totalTransactionAmount")}
              </div>
              <div className="text-3xl font-bold text-foreground">
                {formatCurrencyNoneUnit(
                  financialStatistics.totalAmount,
                  locale
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                {t("statistics.rial")}
              </div>
            </div>

            {/* جزئیات مبالغ */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success"></div>
                  <span className="text-sm text-muted-foreground">
                    {t("statistics.successfulAmount")}
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(financialStatistics.successfulAmount, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  <span className="text-sm text-muted-foreground">
                    {t("statistics.failedAmount")}
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(financialStatistics.failedAmount, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-warning"></div>
                  <span className="text-sm text-muted-foreground">
                    {t("statistics.pendingAmount")}
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(financialStatistics.pendingAmount, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted-foreground">
                    {t("statistics.averageTransaction")}
                  </span>
                </div>
                <span className="text-sm font-bold text-foreground">
                  {formatCurrency(financialStatistics.averageAmount, locale)}
                </span>
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
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("statistics.paymentTypes")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("statistics.paymentTypeDistribution")}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {paymentTypeStatistics.breakdown.map((type) => (
              <div key={type.paymentType} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-lg ${
                        type.paymentType === "Paya"
                          ? "bg-blue-500/10"
                          : type.paymentType === "Satna"
                          ? "bg-purple-500/10"
                          : "bg-green-500/10"
                      } flex items-center justify-center`}
                    >
                      <Activity
                        className={`h-4 w-4 ${
                          type.paymentType === "Paya"
                            ? "text-blue-500"
                            : type.paymentType === "Satna"
                            ? "text-purple-500"
                            : "text-green-500"
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium">{type.typeName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{type.count}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        type.paymentType === "Paya"
                          ? "bg-blue-500/10 text-blue-500"
                          : type.paymentType === "Satna"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-green-500/10 text-green-500"
                      }`}
                    >
                      {type.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={type.percentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t("orderDetail.statistics.amount")}{" "}
                    {formatCurrencyNoneUnit(type.amount, locale)}{" "}
                    {t("statistics.rial")}
                  </span>
                  <span>
                    {t("orderDetail.statistics.successRate")}{" "}
                    {type.successRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}

            {paymentTypeStatistics.breakdown.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                {t("orderDetail.statistics.noDataAvailable")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* تاریخچه زمانی */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {t("statistics.timeStatistics")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("orderDetail.statistics.transactionTimeInformation")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {timeStatistics.earliestTransaction && (
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
                      {formatDate(timeStatistics.earliestTransaction, locale)}
                    </div>
                  </div>
                </div>
              )}

              {timeStatistics.latestTransaction && (
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
                      {formatDate(timeStatistics.latestTransaction, locale)}
                    </div>
                  </div>
                </div>
              )}

              {timeStatistics.lastUpdate && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium mb-1">
                      {t("orderDetail.statistics.lastUpdate")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline me-1" />
                      {formatDate(timeStatistics.lastUpdate, locale)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {timeStatistics.averageProcessingTimeMinutes > 0 && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-primary mb-1">
                      {t("statistics.averageProcessingTime")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {timeStatistics.averageProcessingTimeMinutes}{" "}
                      {t("statistics.minutes")}
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
