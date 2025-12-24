"use client";

import { useState, useEffect } from "react";
import { AppLayout, PageHeader } from "@/components/layout";
import {
  ChartLine,
  CheckCircle,
  Timer,
  XCircle,
} from "lucide-react";
import type { DashboardFilterParams } from "@/types/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import TransactionStatusChart from "@/components/dashboard/TransactionStatusChart";
import PaymentTypeChart from "@/components/dashboard/PaymentTypeChart";
import SuccessGaugeChart from "@/components/dashboard/SuccessGaugeChart";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import DashboardFilters from "@/components/dashboard/DashboardFilters";
import ExportButtons from "@/components/dashboard/ExportButtons";
import AmountVsCountChart from "@/components/dashboard/AmountVsCountChart";
import ComparisonMetrics from "@/components/dashboard/ComparisonMetrics";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { ErrorState } from "@/components/common/error-state";
import useTranslation from "@/hooks/useTranslation";
import { getErrorMessage } from "@/lib/error-handler";
import {
  useDashboardQuery,
  getDefaultDashboardFilters,
} from "@/hooks/useDashboardQuery";
import { PageTitle } from "@/components/common/page-title";
import { useRegisterRefresh } from "@/contexts/pull-to-refresh-context";
import { useAccountGroupStore } from "@/store/account-group-store";

export default function DashboardPage() {
  const { t } = useTranslation();

  // چک کردن آمادگی گروه حساب
  const isAccountGroupReady = useAccountGroupStore((s) => s.isHydrated);

  // مدیریت فیلترها
  const [filters, setFilters] = useState<DashboardFilterParams>(
    getDefaultDashboardFilters()
  );

  // استفاده از React Query hook - فقط وقتی گروه حساب آماده است
  const {
    data: dashboardData,
    isLoading,
    error: queryError,
    refetch,
  } = useDashboardQuery({
    filters,
    enabled: isAccountGroupReady, // 👈 منتظر آمادگی گروه حساب
  });

  // ثبت refetch برای Pull-to-Refresh
  useRegisterRefresh(async () => {
    await refetch();
  });

  // تبدیل خطای React Query به string
  const error = queryError ? getErrorMessage(queryError) : null;

  const handleFilterApply = (newFilters: DashboardFilterParams) => {
    setFilters(newFilters);
  };

  // Show skeleton during loading (both initial and filter changes)
  // یا در حال انتظار برای آمادگی گروه حساب
  if (isLoading || !isAccountGroupReady) {
    return (
      <AppLayout>
        <PageHeader
          title={t("dashboard.pageTitle")}
          description={t("dashboard.pageSubtitle")}
        />
        <DashboardSkeleton />
      </AppLayout>
    );
  }

  if (error && !dashboardData) {
    return (
      <AppLayout>
        <PageHeader
          title={t("dashboard.pageTitle")}
          description={t("dashboard.pageSubtitle")}
        />
        <DashboardFilters
          onFilterApply={handleFilterApply}
          initialFilters={{
            bankGatewayId: filters.bankGatewayId,
            fromDate: filters.fromDate || "",
            toDate: filters.toDate || "",
          }}
        />
        <ErrorState
          title={t("dashboard.error")}
          message={error}
          onRetry={() => refetch()}
        />
      </AppLayout>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const dashboardContent = (
    <>
      {/* Filters */}
      <DashboardFilters
        onFilterApply={handleFilterApply}
        initialFilters={{
          bankGatewayId: filters.bankGatewayId,
          fromDate: filters.fromDate || "",
          toDate: filters.toDate || "",
        }}
      />

      {/* Stats Cards Row */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4 mb-5">
        <StatCard
          title={t("dashboard.stats.totalTransactions")}
          value={dashboardData.totalTransactions}
          amount={dashboardData.totalAmount}
          icon={ChartLine}
          iconBgColor="bg-primary/10"
          iconColor="text-primary"
          delay={0.1}
        />

        <StatCard
          title={t("dashboard.stats.succeededTransactions")}
          value={dashboardData.succeededTransactions}
          amount={dashboardData.succeededAmount}
          icon={CheckCircle}
          iconBgColor="bg-success/10"
          iconColor="text-success"
          badge={{
            value: `${dashboardData.successPercent}%`,
            variant: "success",
          }}
          delay={0.2}
        />

        <StatCard
          title={t("dashboard.stats.pendingTransactions")}
          value={dashboardData.pendingTransactions}
          amount={dashboardData.pendingAmount}
          icon={Timer}
          iconBgColor="bg-warning/10"
          iconColor="text-warning"
          badge={{
            value: `${dashboardData.pendingPercent}%`,
            variant: "warning",
          }}
          delay={0.3}
        />

        <StatCard
          title={t("dashboard.stats.failedTransactions")}
          value={dashboardData.failedTransactions}
          amount={dashboardData.failedAmount}
          icon={XCircle}
          iconBgColor="bg-destructive/10"
          iconColor="text-destructive"
          badge={{
            value: `${dashboardData.failedPercent}%`,
            variant: "danger",
          }}
          delay={0.4}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-5 xl:grid-cols-3 mb-5">
        <TransactionStatusChart
          data={dashboardData.transactionStatusSummary}
          delay={0.5}
        />

        <PaymentTypeChart data={dashboardData.paymentTypeSummary} delay={0.6} />

        <SuccessGaugeChart
          successPercent={dashboardData.successPercent}
          delay={0.7}
        />
      </div>

      {/* Performance Chart */}
      <div className="mb-5">
        <PerformanceChart
          data={dashboardData.transactionStatusSummary}
          delay={0.8}
        />
      </div>

      {/* Additional Charts Row */}
      <div className="grid gap-5 xl:grid-cols-2 mb-5">
        <AmountVsCountChart
          data={dashboardData.transactionStatusSummary}
          delay={0.9}
        />
        <ComparisonMetrics data={dashboardData} delay={1.0} />
      </div>
    </>
  );

  return (
    <AppLayout>
      <PageTitle title={t("dashboard.pageTitle")} />
      <PageHeader
        title={t("dashboard.pageTitle")}
        description={t("dashboard.pageSubtitle")}
        actions={<ExportButtons data={dashboardData} filters={filters} />}
      />

      {dashboardContent}
    </AppLayout>
  );
}
