"use client";

import { useState } from "react";
import { OrderStatus, PaymentOrderDetail } from "@/types/order";
import { OrderStatusBadge, StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  Edit,
  Trash,
  Search,
  Download,
} from "lucide-react";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface OrderDetailHeaderProps {
  order: PaymentOrderDetail;
}

export function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      // شبیه‌سازی API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: t("common.success"),
        description: t("paymentOrders.approveSuccess"),
      });
      router.refresh();
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("paymentOrders.approveError"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: t("common.success"),
        description: t("paymentOrders.rejectSuccess"),
      });
      setShowRejectDialog(false);
      router.push("/my-cartable");
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("paymentOrders.rejectError"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: t("common.success"),
        description: t("paymentOrders.cancelSuccess"),
      });
      setShowCancelDialog(false);
      router.push("/payment-orders");
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("paymentOrders.cancelError"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInquiry = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast({
        title: t("common.success"),
        description: t("paymentOrders.inquirySuccess"),
      });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("paymentOrders.inquiryError"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    toast({
      title: t("common.success"),
      description: t("paymentOrders.exportSuccess"),
    });
  };

  return (
    <>
      <Card className="p-4 md:p-6">
        <div className="flex flex-col gap-4">
          {/* بخش بالا: عنوان و دکمه بازگشت */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <Link
                href="/payment-orders"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-2"
              >
                <ArrowRight className="h-4 w-4" />
                {t("common.back")}
              </Link>
              <div className="flex items-start gap-3 flex-wrap">
                <h1 className="text-xl md:text-2xl font-bold truncate">
                  {order.orderId}
                </h1>
                <OrderStatusBadge status={order.status} size="sm" />
              </div>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {order.title}
              </p>
            </div>
          </div>

          {/* دکمه‌های عملیاتی */}
          <div className="flex flex-wrap gap-2">
            {/* دکمه‌های اصلی در موبایل full width */}
            {order.status == OrderStatus.WaitingForOwnersApproval && (
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="flex-1 sm:flex-none gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {t("common.buttons.approve")}
              </Button>
            )}

            {order.status == OrderStatus.WaitingForOwnersApproval && (
              <Button
                onClick={() => setShowRejectDialog(true)}
                disabled={isLoading}
                variant="secondary"
                className="flex-1 sm:flex-none gap-2"
              >
                <XCircle className="h-4 w-4" />
                {t("common.buttons.reject")}
              </Button>
            )}

            {/* دکمه‌های ثانویه */}
            <div className="flex gap-2 w-full sm:w-auto">
              {order.status == OrderStatus.SubmittedToBank && (
                <Button
                  variant="primary"
                  onClick={handleInquiry}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {t("paymentOrders.inquiry")}
                  </span>
                </Button>
              )}

              <Button
                variant="outline"
                onClick={handleExport}
                className="flex-1 sm:flex-none gap-2"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t("common.buttons.export")}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("paymentOrders.confirmReject")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("paymentOrders.rejectWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={isLoading}
              className="bg-error text-error-foreground hover:bg-error/90"
            >
              {isLoading ? t("common.loading") : t("common.reject")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("paymentOrders.confirmCancel")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("paymentOrders.cancelWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {t("common.back")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-error text-error-foreground hover:bg-error/90"
            >
              {isLoading ? t("common.loading") : t("paymentOrders.cancelOrder")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
