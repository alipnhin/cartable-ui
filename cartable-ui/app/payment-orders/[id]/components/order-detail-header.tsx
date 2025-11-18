"use client";

import { useMemo } from "react";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Activity,
  Building2,
  UserCheck,
  RefreshCw,
  Check,
  X,
  Clock,
  Send,
  Calendar,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { getBankCodeFromIban, getBankLogo } from "@/lib/bank-logos";
import Image from "next/image";
import { OrderStatus } from "@/types/order";

interface OrderDetailHeaderProps {
  order: {
    id: string;
    orderId: string;
    title: string;
    accountSheba: string;
    bankName: string;
    numberOfTransactions: number;
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    trackingId?: string;
    gatewayTitle?: string;
    description?: string;
    accountTitle?: string;
    accountNumber?: string;
  };
  canInquiry?: boolean;
  canApproveReject?: boolean;
  canSendToBank?: boolean;
  onInquiry?: () => void | Promise<void>;
  onApprove?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;
  onSendToBank?: () => void | Promise<void>;
  waitForBankCount?: number;
  approvalCount?: number;
  totalApprovers?: number;
}

export function OrderDetailHeader({
  order,
  canInquiry = false,
  canApproveReject = false,
  canSendToBank = false,
  onInquiry,
  onApprove,
  onReject,
  onSendToBank,
  waitForBankCount = 0,
  approvalCount = 0,
  totalApprovers = 0,
}: OrderDetailHeaderProps) {
  const { t, locale } = useTranslation();

  // کد بانک از IBAN
  const bankCode = useMemo(() => {
    return getBankCodeFromIban(order.accountSheba);
  }, [order.accountSheba]);

  const bankLogo = bankCode ? getBankLogo(bankCode) : null;

  // استخراج تاریخ و ساعت
  const orderDate = new Date(order.createdAt);
  const timeString = orderDate.toLocaleTimeString(
    locale === "fa" ? "fa-IR" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <Card className="mb-6">
      <div className="p-6">
        {/* بخش بالا: لوگو، عنوان، دکمه‌ها */}
        <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-8">
          {/* لوگو */}
          {bankLogo && (
            <div className="shrink-0 order-2 sm:order-1">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
                <Image
                  src={bankLogo}
                  alt={order.bankName}
                  width={64}
                  height={64}
                  className="object-contain p-2"
                />
              </div>
            </div>
          )}

          {/* عنوان و اطلاعات */}
          <div className="flex-1 min-w-0 order-3 sm:order-2">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {order.title}
              </h4>
            </div>
            {/* اطلاعات زیر عنوان */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {order.bankName}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {formatDate(order.createdAt, locale)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {timeString}
              </span>
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          {(canInquiry || canApproveReject || canSendToBank) && (
            <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto order-1 sm:order-3 items-end md:flex-wrap">
              <div className="flex content-between items-end">
                {canInquiry && onInquiry && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onInquiry}
                    className="gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {t("orderDetail.header.inquiryRequest")}
                  </Button>
                )}
                {canSendToBank && onSendToBank && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onSendToBank}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {t("orderDetail.header.sendToBank")}
                  </Button>
                )}
                {canApproveReject && onApprove && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onApprove}
                    className="gap-2 me-4"
                  >
                    <Check className="h-4 w-4" />
                    {t("common.buttons.approve")}
                  </Button>
                )}
                {canApproveReject && onReject && (
                  <Button
                    variant="destructive"
                    size="md"
                    onClick={onReject}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    {t("common.buttons.reject")}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 4 کارت آماری */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* مبلغ کل */}
          <div className="flex items-center gap-3 p-4 bg-success/10 dark:bg-success/20 rounded-lg h-full">
            <div className="w-10 h-10 rounded-lg bg-success/20 dark:bg-success/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
                {formatCurrency(order.totalAmount, locale)}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("orderDetail.header.totalAmountRial")}
              </div>
            </div>
          </div>

          {/* تعداد تراکنش */}
          <div className="flex items-center gap-3 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg h-full">
            <div className="w-10 h-10 rounded-lg bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {order.numberOfTransactions}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("orderDetail.header.transactionCount")}
              </div>
            </div>
          </div>

          {/* در صف پردازش بانک */}
          <div className="flex items-center gap-3 p-4 bg-warning/10 dark:bg-warning/20 rounded-lg h-full">
            <div className="w-10 h-10 rounded-lg bg-warning/20 dark:bg-warning/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {waitForBankCount}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("orderDetail.header.inBankProcessingQueue")}
              </div>
            </div>
          </div>

          {/* امضاها */}
          <div className="flex items-center gap-3 p-4 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg h-full">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 dark:bg-blue-500/30 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {approvalCount}
              </div>
              <div className="text-xs text-muted-foreground">
                {t("orderDetail.header.signaturesOf", {
                  count: totalApprovers,
                })}
              </div>
            </div>
          </div>
        </div>

        {/* اطلاعات در دو ستون */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
          {/* ستون اول */}
          <div className="flex flex-col gap-4">
            {/* وضعیت درخواست */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("orderDetail.header.requestStatus")}
              </span>
              <OrderStatusBadge status={order.status} size="default" />
            </div>

            {/* شماره درخواست */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("orderDetail.header.requestNumber")}
              </span>
              <strong className="text-sm font-bold font-mono">
                {order.orderId}
              </strong>
            </div>

            {/* کد رهگیری بانک */}
            {order.trackingId && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("orderDetail.header.bankTrackingCode")}
                </span>
                <strong className="text-sm font-bold font-mono">
                  {order.trackingId}
                </strong>
              </div>
            )}

            {/* توضیحات */}
            {order.description && (
              <div className="flex justify-between items-start gap-4">
                <span className="text-sm text-muted-foreground shrink-0">
                  {t("orderDetail.header.description")}
                </span>
                <strong className="text-sm font-medium text-right break-words">
                  {order.description}
                </strong>
              </div>
            )}
          </div>

          {/* ستون دوم */}
          <div className="flex flex-col gap-4">
            {/* عنوان حساب مبدا */}
            {order.accountTitle && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("orderDetail.header.sourceAccountTitle")}
                </span>
                <strong className="text-sm font-bold">
                  {order.accountTitle}
                </strong>
              </div>
            )}

            {/* شماره حساب مبداء */}
            {order.accountNumber && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("orderDetail.header.sourceAccountNumber")}
                </span>
                <strong className="text-sm font-bold font-mono">
                  {order.accountNumber}
                </strong>
              </div>
            )}

            {/* شباء مبدا */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {t("orderDetail.header.sourceIban")}
              </span>
              <strong className="text-sm font-bold font-mono">
                {order.accountSheba}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
