"use client";

import { useMemo } from "react";
import { PaymentOrderDetail } from "@/types/order";
import { OrderStatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import {
  ArrowRight,
  DollarSign,
  Activity,
  Timer,
  Users,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import useTranslation from "@/hooks/useTranslation";
import { formatCurrency, formatDate } from "@/lib/helpers";
import { getBankCodeFromIban, getBankLogo } from "@/lib/bank-logos";
import Image from "next/image";
import { TransactionStatus } from "@/types/transaction";
import { OrderApproveStatus } from "@/types/signer";

interface OrderDetailHeaderProps {
  order: PaymentOrderDetail;
}

export function OrderDetailHeader({ order }: OrderDetailHeaderProps) {
  const { t, locale } = useTranslation();

  // محاسبه آمار
  const stats = useMemo(() => {
    const waitingForBank = order.transactions.filter(
      (tx) => tx.status === TransactionStatus.WaitForBank
    ).length;

    const approvedCount = order.approvers.filter(
      (a) => a.status === OrderApproveStatus.Accepted
    ).length;
    const totalApprovers = order.approvers.length;

    return {
      totalAmount: order.totalAmount,
      transactionCount: order.transactions.length,
      waitingForBank,
      approvedCount,
      totalApprovers,
    };
  }, [order]);

  // کد بانک از IBAN
  const bankCode = useMemo(() => {
    return getBankCodeFromIban(order.account.sheba);
  }, [order.account.sheba]);

  const bankLogo = bankCode ? getBankLogo(bankCode) : null;

  // بررسی خطا
  const hasError = useMemo(() => {
    const failedCount = order.transactions.filter(
      (tx) =>
        tx.status === TransactionStatus.BankRejected ||
        tx.status === TransactionStatus.Failed
    ).length;
    return failedCount > 0;
  }, [order.transactions]);

  return (
    <Card className="mb-6">
      <div className="p-4 md:p-6">
        {/* Breadcrumb */}

        <div className="flex items-end justify-end mb-6">
          <Link
            href="/payment-orders"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            بازگشت
          </Link>
        </div>

        {/* بخش اصلی */}
        <div className="space-y-6">
          {/* لوگو بانک و عنوان */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            {/* لوگو */}
            {bankLogo && (
              <div className="shrink-0">
                <div className="w-12 h-12 relative">
                  <Image
                    src={bankLogo}
                    alt={order.account.bankName}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* اطلاعات و Badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">{order.title}</h2>

                  {/* اطلاعات خلاصه */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {bankCode}-{order.account.bankName}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-xs">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      {order.account.sheba}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatDate(order.createdAt, locale)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {new Date(order.createdAt).toLocaleTimeString(locale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                {/* وضعیت */}
                <div className="flex items-center gap-2">
                  <OrderStatusBadge status={order.status} size="default" />
                  {hasError && (
                    <button className="p-1 hover:bg-warning/10 rounded">
                      <AlertCircle className="h-5 w-5 text-warning animate-pulse" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* کارت‌های آماری 4تایی */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* مبلغ کل */}
            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg md:text-xl font-bold text-success truncate">
                    {formatCurrency(stats.totalAmount, locale)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    مبلغ کل (ریال)
                  </div>
                </div>
              </div>
            </div>

            {/* تعداد تراکنش */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg md:text-xl font-bold text-primary">
                    {stats.transactionCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    تعداد تراکنش
                  </div>
                </div>
              </div>
            </div>

            {/* در صف پردازش */}
            <div className="bg-warning/5 border border-warning/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                  <Timer className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg md:text-xl font-bold text-warning">
                    {stats.waitingForBank}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    در صف پردازش بانک
                  </div>
                </div>
              </div>
            </div>

            {/* امضاءها */}
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg md:text-xl font-bold text-blue-500">
                    {stats.approvedCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    از {stats.totalApprovers} امضاء
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* اطلاعات جزئی */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t">
            {/* ستون چپ */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  وضعیت درخواست:
                </span>
                <div className="text-end">
                  <OrderStatusBadge status={order.status} size="sm" />
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  شماره درخواست:
                </span>
                <strong className="text-sm">{order.orderId}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  کد رهگیری بانک:
                </span>
                <strong className="text-sm font-mono">{order.id}</strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">توضیحات:</span>
                <strong className="text-sm text-end max-w-[60%]">
                  {order.description || "-"}
                </strong>
              </div>
            </div>

            {/* ستون راست */}
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  عنوان حساب مبدا:
                </span>
                <strong className="text-sm text-end max-w-[60%]">
                  {order.account.accountTitle || order.account.bankName}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  شماره حساب مبداء:
                </span>
                <strong className="text-sm font-mono">
                  {order.account.accountNumber}
                </strong>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  شباء مبدا:
                </span>
                <strong className="text-sm font-mono">
                  {order.account.sheba}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
