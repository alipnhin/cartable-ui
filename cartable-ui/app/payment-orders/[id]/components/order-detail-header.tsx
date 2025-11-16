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
  Clock,
  RefreshCw,
  Check,
  X,
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
        {/* بخش اصلی */}
        <div className="space-y-6">
          {/* لوگو بانک و عنوان */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
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

            {/* عنوان و اطلاعات */}
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">{order.title}</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    {order.gatewayTitle || order.bankName}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              {/* شماره دستور و کد رهگیری */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">شماره دستور:</span>
                  <span className="font-medium">{order.orderId}</span>
                </div>
                {order.trackingId && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">کد رهگیری:</span>
                    <span className="font-medium">{order.trackingId}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <CalendarPlus2 className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{formatDate(order.createdAt, locale)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* کارت‌های آماری */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* مبلغ کل */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/50">
                <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">مبلغ کل</p>
                <p className="text-lg font-bold">{formatCurrency(order.totalAmount)}</p>
              </div>
            </div>

            {/* تعداد تراکنش‌ها */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/50">
                <Activity className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">تعداد تراکنش‌ها</p>
                <p className="text-lg font-bold">{order.numberOfTransactions}</p>
              </div>
            </div>

            {/* شماره شبا */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/50">
                <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">شماره شبا</p>
                <p className="text-sm font-medium font-mono direction-ltr">
                  {order.accountSheba}
                </p>
              </div>
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          {(canInquiry || canApproveReject) && (
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              {canInquiry && onInquiry && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={onInquiry}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  استعلام دستور پرداخت
                </Button>
              )}
              {canApproveReject && (
                <>
                  {onApprove && (
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={onApprove}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      تایید
                    </Button>
                  )}
                  {onReject && (
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={onReject}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      رد
                    </Button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
