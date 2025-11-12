"use client";

import { useMemo, useState } from "react";
import { AppLayout, PageHeader } from "@/components/layout";
import { OrderCard, OrderCardSkeleton } from "./components/order-card";
import { DataTable } from "./components/data-table";
import { createColumns } from "./components/columns";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Download, X } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockOrders } from "@/mocks/mockOrders";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus } from "@/types/order";
import { OtpDialog } from "@/components/common/otp-dialog";
import { cn } from "@/lib/utils";
import { IStatisticsItems, Statistics } from "./components/statistics";

export default function MyCartablePage() {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>(
    {}
  );
  const [otpDialog, setOtpDialog] = useState<{
    open: boolean;
    type: "approve" | "reject";
    orderIds: string[];
  }>({ open: false, type: "approve", orderIds: [] });

  // فقط دستورات در انتظار تأیید
  const pendingOrders = useMemo(() => {
    return mockOrders.filter(
      (order) => order.status === OrderStatus.WaitingForOwnersApproval
    );
  }, []);

  // Handlers
  const handleSingleApprove = (orderId: string) => {
    setOtpDialog({ open: true, type: "approve", orderIds: [orderId] });
  };

  const handleSingleReject = (orderId: string) => {
    setOtpDialog({ open: true, type: "reject", orderIds: [orderId] });
  };

  const handleBulkApprove = () => {
    const orderIds = isMobile
      ? selectedOrders
      : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);

    if (orderIds.length === 0) return;
    setOtpDialog({ open: true, type: "approve", orderIds });
  };

  const handleBulkReject = () => {
    const orderIds = isMobile
      ? selectedOrders
      : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);

    if (orderIds.length === 0) return;
    setOtpDialog({ open: true, type: "reject", orderIds });
  };

  const handleCancelSelection = () => {
    setSelectedOrders([]);
    setSelectedRowIds({});
  };

  const handleOtpConfirm = async (otp: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const action = otpDialog.type === "approve" ? "تأیید" : "رد";
    const count = otpDialog.orderIds.length;

    toast({
      title: t("toast.success"),
      description: `${count} دستور با موفقیت ${action} شد`,
      variant: "success",
    });

    // Clear selection
    setSelectedOrders([]);
    setSelectedRowIds({});
  };

  const handleOtpResend = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: t("toast.info"),
      description: t("otp.codeSent"),
      variant: "info",
    });
  };

  const handleExport = () => {
    toast({
      title: t("toast.info"),
      description: t("toast.exportStarted"),
      variant: "info",
    });
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleRowSelectionChange = (newSelection: Record<string, boolean>) => {
    setSelectedRowIds(newSelection);
  };

  // Create columns with handlers
  const columns = useMemo(
    () => createColumns(locale, handleSingleApprove, handleSingleReject, t),
    [locale]
  );

  const hasSelection = isMobile
    ? selectedOrders.length > 0
    : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]).length > 0;

  const selectedCount = isMobile
    ? selectedOrders.length
    : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]).length;

  const items: IStatisticsItems = [
    {
      number: `${pendingOrders.length}`,
      label: `${t("myCartable.totalOrders")}`,
    },
    {
      number: `${pendingOrders.reduce(
        (sum, order) =>
          sum + (order.totalTransactions || order.numberOfTransactions),
        0
      )}`,
      label: `${t("myCartable.totalTransactions")}`,
    },
    {
      number: `${new Intl.NumberFormat("fa-IR").format(
        pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0)
      )}`,
      label: `${t("myCartable.totalAmount")}`,
    },
  ];

  return (
    <AppLayout>
      <div className="space-y-4">
        <PageHeader
          title={t("myCartable.pageTitle")}
          description={t("myCartable.pageSubtitle")}
          badge={
            pendingOrders.length > 0
              ? pendingOrders.length.toString()
              : undefined
          }
          actions={
            pendingOrders.length > 0 &&
            !isMobile &&
            !hasSelection && (
              <Button variant="mono" onClick={handleExport}>
                <Download className="" />
                {t("common.buttons.export")}
              </Button>
            )
          }
        />

        <div className="col-span-1 lg:col-span-3">
          <Statistics items={items} />
        </div>

        {!isMobile && hasSelection && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <Button
              variant="mono"
              onClick={handleCancelSelection}
              className="shrink-0"
            >
              <X className="h-4 w-4 me-2" />
              {t("common.buttons.cancel")}
            </Button>
            <div className="flex-1 text-sm font-medium">
              {selectedCount} {t("common.selected")}
            </div>
            <Button
              size="sm"
              variant="destructive"
              className="px-4"
              onClick={handleBulkReject}
            >
              <XCircle className="h-4 w-4 me-2" />
              {t("common.buttons.reject")}
            </Button>
            <Button
              size="sm"
              variant="primary"
              className=""
              onClick={handleBulkApprove}
            >
              <CheckCircle className="h-4 w-4 me-2" />
              {t("common.buttons.approve")}
            </Button>
          </div>
        )}

        {/* Desktop: Table */}
        {!isMobile ? (
          <DataTable
            columns={columns}
            data={pendingOrders}
            isLoading={false}
            onRowSelectionChange={handleRowSelectionChange}
          />
        ) : (
          /* Mobile: Cards */
          <div className="space-y-3 pb-24">
            {pendingOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onApprove={handleSingleApprove}
                onReject={handleSingleReject}
                selected={selectedOrders.includes(order.id)}
                onSelect={handleOrderSelect}
              />
            ))}
            {pendingOrders.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                {t("orders.noOrders")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Bar for Mobile Selection */}
      {isMobile && hasSelection && (
        <div
          className={cn(
            "fixed bottom-22 left-0 right-0 z-40 p-4",
            "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
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
                size="sm"
                variant="ghost"
                onClick={handleCancelSelection}
                className="shrink-0 h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                size="lg"
                variant="destructive"
                className=" flex-1  flex items-center justify-center gap-2"
                onClick={handleBulkReject}
              >
                <XCircle className="h-5 w-5" />
                <span className="truncate">{t("common.buttons.reject")}</span>
              </Button>
              <Button
                size="lg"
                variant="primary"
                className=" flex-1  flex items-center justify-center gap-2"
                onClick={handleBulkApprove}
              >
                <CheckCircle className="h-5 w-5" />
                <span className="truncate">{t("common.buttons.approve")}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Dialog */}
      <OtpDialog
        open={otpDialog.open}
        onOpenChange={(open) => setOtpDialog({ ...otpDialog, open })}
        title={
          otpDialog.type === "approve"
            ? t("otp.approveTitle")
            : t("otp.rejectTitle")
        }
        description={
          otpDialog.orderIds.length === 1
            ? t("otp.singleOrderDescription")
            : t("otp.multipleOrdersDescription", {
                count: otpDialog.orderIds.length,
              })
        }
        onConfirm={handleOtpConfirm}
        onResend={handleOtpResend}
      />
    </AppLayout>
  );
}
