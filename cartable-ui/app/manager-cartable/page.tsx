"use client";

import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AppLayout, PageHeader } from "@/components/layout";
import { OrderCard, OrderCardSkeleton } from "./components/order-card";
import { DataTable } from "./components/data-table";
import { createColumns } from "./components/columns";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Download,
  X,
  ClipboardCheck,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { OtpDialog } from "@/components/common/otp-dialog";
import { cn } from "@/lib/utils";
import { IStatisticsItems, Statistics } from "./components/statistics";
import { ErrorState } from "@/components/common/error-state";
import { useCartableQuery } from "@/hooks/useCartableQuery";
import { useCartableOtpFlow } from "@/hooks/useCartableOtpFlow";
import { useRegisterRefresh } from "@/contexts/pull-to-refresh-context";
import {
  getManagerCartable,
  sendManagerOperationOtp,
  managerApprovePayment,
  sendManagerBatchOperationOtp,
  managerBatchApprovePayments,
} from "@/services/managerCartableService";
import { getErrorMessage } from "@/lib/error-handler";
import { PageTitle } from "@/components/common/page-title";

export default function ManagerCartablePage() {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // استفاده از React Query hook برای مدیریت داده‌های کارتابل
  const {
    orders,
    isLoading,
    error: queryError,
    totalItems,
    totalPages,
    pageNumber,
    pageSize,
    setPageNumber,
    setPageSize,
    reloadData,
  } = useCartableQuery({
    fetchFunction: getManagerCartable,
    cartableType: "manager",
    initialPageSize: 10,
  });

  // ثبت refetch برای Pull-to-Refresh
  useRegisterRefresh(reloadData);

  // تبدیل خطای React Query به string
  const error = queryError ? getErrorMessage(queryError) : null;

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>(
    {}
  );

  // ✅ استفاده از Generic OTP Hook برای مدیر
  const otpFlow = useCartableOtpFlow({
    services: {
      sendSingleOtp: sendManagerOperationOtp,
      sendBatchOtp: sendManagerBatchOperationOtp,
      approveSingleWithOtp: managerApprovePayment,
      approveBatchWithOtp: managerBatchApprovePayments,
    },
    onSuccess: async () => {
      // پاک کردن انتخاب‌ها بعد از موفقیت
      setSelectedOrders([]);
      setSelectedRowIds({});
      // بارگذاری مجدد داده‌ها
      await reloadData();
    },
  });

  /**
   * لغو انتخاب همه آیتم‌ها
   */
  const handleCancelSelection = () => {
    setSelectedOrders([]);
    setSelectedRowIds({});
  };

  /**
   * مدیریت عملیات خروجی
   */
  const handleExport = () => {
    toast({
      title: t("toast.info"),
      description: t("toast.exportStarted"),
      variant: "info",
    });
  };

  /**
   * مدیریت انتخاب/حذف انتخاب یک دستور در نمای موبایل
   */
  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  /**
   * مدیریت تغییرات انتخاب سطرها در جدول دسکتاپ
   */
  const handleRowSelectionChange = (newSelection: Record<string, boolean>) => {
    setSelectedRowIds(newSelection);
  };

  /**
   * مدیریت عملیات گروهی - تایید
   */
  const handleBulkApprove = () => {
    const orderIds = isMobile
      ? selectedOrders
      : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);

    if (orderIds.length > 0) {
      otpFlow.startBatchApprove(orderIds);
    }
  };

  /**
   * مدیریت عملیات گروهی - لغو
   */
  const handleBulkReject = () => {
    const orderIds = isMobile
      ? selectedOrders
      : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);

    if (orderIds.length > 0) {
      otpFlow.startBatchReject(orderIds);
    }
  };

  /**
   * ایجاد ستون‌های جدول با استفاده از useMemo
   */
  const columns = useMemo(
    () =>
      createColumns(
        locale,
        otpFlow.startSingleApprove,
        otpFlow.startSingleReject,
        t
      ),
    [locale, otpFlow.startSingleApprove, otpFlow.startSingleReject, t]
  );

  /**
   * بررسی وجود آیتم‌های انتخاب شده
   */
  const hasSelection = isMobile
    ? selectedOrders.length > 0
    : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]).length > 0;

  /**
   * تعداد آیتم‌های انتخاب شده
   */
  const selectedCount = isMobile
    ? selectedOrders.length
    : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]).length;

  /**
   * محاسبه آمار برای نمایش در بخش Statistics
   */
  const items: IStatisticsItems = [
    {
      number: `${totalItems}`,
      label: `${t("managerCartable.totalOrders")}`,
    },
    {
      number: `${orders.reduce(
        (sum, order) => sum + (order.numberOfTransactions || 0),
        0
      )}`,
      label: `${t("managerCartable.totalTransactions")}`,
    },
    {
      number: `${new Intl.NumberFormat().format(
        orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      )}`,
      label: `${t("managerCartable.totalAmount")}`,
    },
  ];

  // نمایش error state با retry button
  if (error && !isLoading && orders.length === 0) {
    return (
      <AppLayout>
        <PageTitle title={t("managerCartable.pageTitle")} />
        <PageHeader
          title={t("managerCartable.pageTitle")}
          description={t("managerCartable.pageSubtitle")}
        />
        <ErrorState
          title={t("toast.error")}
          message={error}
          onRetry={reloadData}
        />
      </AppLayout>
    );
  }

  const pageContent = (
    <>
      <div className="col-span-1 lg:col-span-3 mb-4">
        <Statistics items={items} />
      </div>

      {!isMobile && hasSelection && (
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
          <Button
            mode="icon"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleCancelSelection}
          >
            <X className="" />
          </Button>
          <div className="flex-1 text-sm font-medium">
            {selectedCount} {t("common.selected")}
          </div>
          <Button
            variant="destructive"
            className="px-4"
            onClick={handleBulkReject}
          >
            <XCircle className="h-4 w-4 me-2" />
            {t("managerCartable.cancel")}
          </Button>
          <Button variant="primary" className="" onClick={handleBulkApprove}>
            <CheckCircle className="h-4 w-4 me-2" />
            {t("common.buttons.approve")}
          </Button>
        </div>
      )}

      {/* Desktop: Table, Mobile: Cards */}
      {!isMobile ? (
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          rowSelection={selectedRowIds}
          onRowSelectionChange={handleRowSelectionChange}
          pageCount={totalPages}
          pageIndex={pageNumber - 1}
          pageSize={pageSize}
          onPageChange={(newPageIndex) => setPageNumber(newPageIndex + 1)}
          onPageSizeChange={setPageSize}
        />
      ) : (
        <div className="space-y-3 pb-24">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))
          ) : (
            <>
              {orders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onApprove={otpFlow.startSingleApprove}
                  onReject={otpFlow.startSingleReject}
                  selected={selectedOrders.includes(order.id)}
                  onSelect={handleOrderSelect}
                />
              ))}
              {orders.length === 0 && (
                <div className="flex flex-col items-center py-20 px-4 text-center mt-10">
                  <div className="p-4 rounded-2xl bg-muted/30">
                    <ClipboardCheck className="h-10 w-10 text-muted-foreground" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-foreground/80">
                    {t("managerCartable.noOrders")}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                    {t("managerCartable.noOrdersDescription")}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );

  return (
    <AppLayout>
      <PageTitle title={t("managerCartable.pageTitle")} />
      <div className="space-y-4">
        <PageHeader
          title={t("managerCartable.pageTitle")}
          description={t("managerCartable.pageSubtitle")}
          badge={totalItems > 0 ? totalItems.toString() : undefined}
          actions={
            totalItems > 0 &&
            !isMobile &&
            !hasSelection && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="" />
                {t("common.buttons.export")}
              </Button>
            )
          }
        />

        {pageContent}
      </div>

      {/* Floating Action Bar for Mobile Selection */}
      {typeof window !== "undefined" &&
        isMobile &&
        hasSelection &&
        createPortal(
          <div
            className={cn(
              "fixed bottom-24 left-0 right-0 z-50 p-4",
              "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80",
              "border-t shadow-lg"
            )}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 text-sm font-medium min-w-0">
                  <span className="truncate">
                    {selectedOrders.length} {t("common.selected")}
                  </span>
                </div>
                <Button
                  size="md"
                  variant="ghost"
                  onClick={handleCancelSelection}
                  className="shrink-0 h-8 w-8 p-0"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="flex gap-2 mb-6">
                <Button
                  size="lg"
                  variant="destructive"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleBulkReject}
                >
                  <XCircle className="h-5 w-5" />
                  <span className="truncate">{t("managerCartable.cancel")}</span>
                </Button>
                <Button
                  size="lg"
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleBulkApprove}
                >
                  <CheckCircle className="h-5 w-5" />
                  <span className="truncate">{t("common.buttons.approve")}</span>
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* OTP Dialog */}
      <OtpDialog
        open={otpFlow.otpDialog.open}
        onOpenChange={(open) => (open ? undefined : otpFlow.closeDialog())}
        title={
          otpFlow.otpDialog.type === "approve"
            ? t("otp.approveTitle")
            : t("otp.rejectTitle")
        }
        description={
          otpFlow.otpDialog.orderIds.length === 1
            ? t("otp.singleOrderDescription")
            : t("otp.multipleOrdersDescription", {
                count: otpFlow.otpDialog.orderIds.length,
              })
        }
        onConfirm={otpFlow.confirmOtp}
        onResend={otpFlow.resendOtp}
        isRequestingOtp={otpFlow.otpDialog.isRequestingOtp}
      />
    </AppLayout>
  );
}
