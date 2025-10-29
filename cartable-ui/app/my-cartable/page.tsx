"use client";

import { useMemo } from "react";
import { AppLayout, PageHeader } from "@/components/layout";
import { OrderCard, OrderCardSkeleton } from "./components/order-card";
import { DataTable } from "./components/data-table";
import { createColumns } from "./components/columns";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Download } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockOrders } from "@/mocks/mockOrders";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus } from "@/types/order";

export default function MyCartablePage() {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // فقط دستورات در انتظار تأیید
  const pendingOrders = useMemo(() => {
    return mockOrders.filter(
      (order) => order.status === OrderStatus.WaitingForOwnersApproval
    );
  }, []);

  // Handlers
  const handleApprove = (orderId: string) => {
    toast({
      title: t("toast.success"),
      description: t("toast.orderApproved"),
      variant: "success",
    });
  };

  const handleReject = (orderId: string) => {
    toast({
      title: t("toast.success"),
      description: t("toast.orderRejected"),
      variant: "success",
    });
  };

  const handleExport = () => {
    toast({
      title: t("toast.info"),
      description: t("toast.exportStarted"),
      variant: "info",
    });
  };

  // Create columns with handlers
  const columns = useMemo(
    () => createColumns(locale, handleApprove, handleReject, t),
    [locale]
  );

  return (
    <AppLayout>
      <PageHeader
        title={t("myCartable.pageTitle")}
        description={t("myCartable.pageSubtitle")}
        badge={
          pendingOrders.length > 0 ? pendingOrders.length.toString() : undefined
        }
        actions={
          pendingOrders.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 me-2" />
              {t("common.buttons.export")}
            </Button>
          )
        }
      />

      {/* Desktop: Table */}
      {!isMobile ? (
        <DataTable columns={columns} data={pendingOrders} isLoading={false} />
      ) : (
        /* Mobile: Cards */
        <div className="space-y-3">
          {pendingOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
          {pendingOrders.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {t("orders.noOrders")}
            </div>
          )}
        </div>
      )}

      {/* Stats Summary */}
      {pendingOrders.length > 0 && (
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {pendingOrders.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("myCartable.totalOrders")}
              </p>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {pendingOrders.reduce(
                  (sum, order) =>
                    sum +
                    (order.totalTransactions || order.numberOfTransactions),
                  0
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("myCartable.totalTransactions")}
              </p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="text-2xl font-bold text-foreground">
                {new Intl.NumberFormat("fa-IR").format(
                  pendingOrders.reduce(
                    (sum, order) => sum + order.totalAmount,
                    0
                  )
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {t("myCartable.totalAmount")}
              </p>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
