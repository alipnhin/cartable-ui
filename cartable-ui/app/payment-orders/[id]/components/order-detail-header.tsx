"use client";

import { useMemo } from "react";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Activity,
  CreditCard,
  CalendarPlus2,
  RefreshCw,
  Check,
  X,
  Building2,
  FileText,
  Hash,
  Landmark,
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
  onInquiry?: () => void | Promise<void>;
  onApprove?: () => void | Promise<void>;
  onReject?: () => void | Promise<void>;
}

export function OrderDetailHeader({
  order,
  canInquiry = false,
  canApproveReject = false,
  onInquiry,
  onApprove,
  onReject,
}: OrderDetailHeaderProps) {
  const { t, locale } = useTranslation();

  // کد بانک از IBAN
  const bankCode = useMemo(() => {
    return getBankCodeFromIban(order.accountSheba);
  }, [order.accountSheba]);

  const bankLogo = bankCode ? getBankLogo(bankCode) : null;

  return (
    <Card className="mb-6">
      <div className="p-4 md:p-6">
        <div className="space-y-6">
          {/* بخش بالا: لوگو، عنوان، وضعیت و دکمه‌های عملیات */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* لوگو */}
            {bankLogo && (
              <div className="shrink-0">
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

            {/* عنوان و اطلاعات وسط */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">{order.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.gatewayTitle || order.bankName}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} size="default" />
              </div>

              {/* شماره دستور و کد رهگیری */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">شماره درخواست:</span>
                  <span className="font-medium font-mono">{order.orderId}</span>
                </div>
                {order.trackingId && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">کد رهگیری بانک:</span>
                    <span className="font-medium font-mono">{order.trackingId}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarPlus2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">تاریخ ایجاد:</span>
                  <span className="font-medium">{formatDate(order.createdAt, locale)}</span>
                </div>
              </div>

              {/* توضیحات */}
              {order.description && (
                <div className="mt-3 p-3 bg-muted/30 rounded-lg">
                  <div className="flex gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">توضیحات:</p>
                      <p className="text-sm">{order.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* دکمه‌های عملیات - بالای سمت راست */}
            {(canInquiry || canApproveReject) && (
              <div className="flex flex-wrap gap-2 lg:flex-col lg:justify-start shrink-0">
                {canInquiry && onInquiry && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onInquiry}
                    className="gap-2 flex-1 lg:flex-none lg:w-auto"
                  >
                    <RefreshCw className="h-4 w-4" />
                    استعلام دستور
                  </Button>
                )}
                {canApproveReject && onApprove && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={onApprove}
                    className="gap-2 flex-1 lg:flex-none lg:w-auto"
                  >
                    <Check className="h-4 w-4" />
                    تایید
                  </Button>
                )}
                {canApproveReject && onReject && (
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={onReject}
                    className="gap-2 flex-1 lg:flex-none lg:w-auto"
                  >
                    <X className="h-4 w-4" />
                    رد
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* اطلاعات حساب مبدا */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Landmark className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-primary">اطلاعات حساب مبدا</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.accountTitle && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">عنوان حساب:</span>
                  <span className="text-sm font-medium">{order.accountTitle}</span>
                </div>
              )}
              {order.accountNumber && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">شماره حساب:</span>
                  <span className="text-sm font-medium font-mono direction-ltr">
                    {order.accountNumber}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">شبا مبدا:</span>
                <span className="text-sm font-medium font-mono direction-ltr">
                  {order.accountSheba}
                </span>
              </div>
            </div>
          </div>

          {/* کارت‌های آماری */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* مبلغ کل */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-1">مبلغ کل</p>
                <p className="text-lg font-bold truncate">
                  {formatCurrency(order.totalAmount, locale)} <span className="text-sm font-normal">ریال</span>
                </p>
              </div>
            </div>

            {/* تعداد تراکنش‌ها */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">تعداد تراکنش‌ها</p>
                <p className="text-lg font-bold">{order.numberOfTransactions} تراکنش</p>
              </div>
            </div>

            {/* بانک */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground mb-1">بانک</p>
                <p className="text-sm font-medium truncate">{order.bankName}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
