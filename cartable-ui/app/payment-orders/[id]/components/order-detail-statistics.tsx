"use client";

import { WithdrawalStatistics } from "@/types/api";
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
  BarChart3,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OrderDetailStatisticsProps {
  statistics: WithdrawalStatistics;
}

export function OrderDetailStatistics({ statistics }: OrderDetailStatisticsProps) {
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
  const succeededCount = statusStatistics.breakdown.find(s => s.status === "BankSucceeded")?.count || 0;
  const failedCount = statusStatistics.breakdown.filter(s =>
    s.status === "BankFailed" || s.status === "Canceled"
  ).reduce((sum, s) => sum + s.count, 0);
  const pendingCount = statusStatistics.breakdown.filter(s =>
    s.status === "WaitForExecution" || s.status === "WaitForBank" || s.status === "Draft"
  ).reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="space-y-6">
      {/* ردیف اول: نمودار و جزئیات */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* نمودار Donut */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span>{t("orderDetail.statistics.transactionStatuses")}</span>
              <span className="text-sm font-normal text-success">
                {t("statistics.successRate")}: {overallSuccessRate.toFixed(1)}%
              </span>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("orderDetail.statistics.transactionStatusDistribution")}
            </p>
          </CardHeader>
          <CardContent>
            {/* نمودار ساده با CSS */}
            <div className="relative w-full aspect-square max-w-[200px] mx-auto mb-6">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    #10B981 0% ${overallSuccessRate}%,
                    #EF4444 ${overallSuccessRate}% ${
                    overallSuccessRate + statusStatistics.failureRate
                  }%,
                    #F59E0B ${
                      overallSuccessRate + statusStatistics.failureRate
                    }% 100%
                  )`,
                }}
              >
                <div className="absolute inset-[25%] bg-white dark:bg-card rounded-full flex flex-col items-center justify-center shadow-lg">
                  <div className="text-2xl font-bold">{totalTransactions}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[80%] text-center">
                    {t("dashboard.transaction")}
                  </div>
                </div>
              </div>
            </div>

            {/* لیست وضعیت‌ها */}
            <div className="space-y-3">
              {succeededCount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <span className="text-sm">{t("statistics.succeeded")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{succeededCount}</span>
                    <span className="text-xs text-muted-foreground">
                      ({overallSuccessRate.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
              {failedCount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <span className="text-sm">{t("statistics.failed")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{failedCount}</span>
                    <span className="text-xs text-muted-foreground">
                      ({statusStatistics.failureRate.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              )}
              {pendingCount > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning"></div>
                    <span className="text-sm">{t("statistics.pending")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{pendingCount}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(100 - overallSuccessRate - statusStatistics.failureRate).toFixed(1)}%)
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
              {t("orderDetail.statistics.statusAndAmountDistribution")}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {succeededCount > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{t("statistics.succeeded")}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{succeededCount}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-success/10 text-success">
                        {overallSuccessRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(financialStatistics.successfulAmount, locale)} {t("statistics.rial")}
                  </div>
                </div>
              </div>
            )}

            {failedCount > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{t("statistics.failed")}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{failedCount}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                        {statusStatistics.failureRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatCurrency(financialStatistics.failedAmount, locale)} {t("statistics.rial")}
                  </div>
                </div>
              </div>
            )}

            {reasonCodeStatistics.breakdown.length > 0 && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">
                    {t("orderDetail.statistics.mostUsedReasonCode")}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {reasonCodeStatistics.mostUsedReasonPercentage.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {reasonCodeStatistics.breakdown[0]?.reasonName || reasonCodeStatistics.mostUsedReason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* خلاصه مالی */}
        <Card className="lg:col-span-1 overflow-hidden">
          <div className="bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground">
            <h3 className="text-base font-semibold mb-1">
              {t("statistics.financialSummary")}
            </h3>
            <div className="text-center mt-4">
              <div className="text-xs opacity-80">
                {t("orderDetail.statistics.totalTransactionAmount")}
              </div>
              <div className="text-2xl font-bold mt-1">
                {formatCurrency(financialStatistics.totalAmount, locale)}
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
                  {formatCurrency(financialStatistics.successfulAmount, locale)}
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
                  {formatCurrency(financialStatistics.failedAmount, locale)}
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
                  {formatCurrency(financialStatistics.pendingAmount, locale)}
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
                  {formatCurrency(financialStatistics.averageAmount, locale)}
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
                    <div className={`w-6 h-6 rounded-lg ${
                      type.paymentType === "Paya" ? "bg-blue-500/10" :
                      type.paymentType === "Satna" ? "bg-purple-500/10" :
                      "bg-green-500/10"
                    } flex items-center justify-center`}>
                      <Activity className={`h-4 w-4 ${
                        type.paymentType === "Paya" ? "text-blue-500" :
                        type.paymentType === "Satna" ? "text-purple-500" :
                        "text-green-500"
                      }`} />
                    </div>
                    <span className="text-sm font-medium">
                      {type.typeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{type.count}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      type.paymentType === "Paya" ? "bg-blue-500/10 text-blue-500" :
                      type.paymentType === "Satna" ? "bg-purple-500/10 text-purple-500" :
                      "bg-green-500/10 text-green-500"
                    }`}>
                      {type.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <Progress value={type.percentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t("orderDetail.statistics.amount")} {formatCurrency(type.amount, locale)} {t("statistics.rial")}</span>
                  <span>{t("orderDetail.statistics.successRate")} {type.successRate.toFixed(1)}%</span>
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
                      {timeStatistics.averageProcessingTimeMinutes} {t("statistics.minutes")}
                    </div>
                  </div>
                  <Timer className="h-8 w-8 text-primary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ردیف سوم: آمار کد علت */}
      {reasonCodeStatistics.breakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("orderDetail.statistics.reasonCodesDistribution")}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("orderDetail.statistics.paymentReasonCodesStats")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reasonCodeStatistics.breakdown.map((reason) => (
                <div key={reason.reasonCode} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium truncate flex-1">
                      {reason.reasonName}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary shrink-0 ms-2">
                      {reason.percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>{t("orderDetail.statistics.count")}</span>
                      <span className="font-medium">{reason.count}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t("orderDetail.statistics.amount")}</span>
                      <span className="font-medium">{formatCurrency(reason.amount, locale)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t("orderDetail.statistics.successRate")}</span>
                      <span className="font-medium">{reason.successRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
