"use client";

import { PaymentOrder, OrderStatus } from "@/types/order";
import {
  StatusBadge,
  getPaymentStatusBadge,
} from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";

interface OrderCardProps {
  order: PaymentOrder;
  onView?: (orderId: string) => void;
}

export function OrderCard({ order, onView }: OrderCardProps) {
  const { t, locale } = useTranslation();
  const statusBadge = getPaymentStatusBadge(order.status);
  const { variant, icon: Icon, label_fa, label_en } = statusBadge;

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:border-muted-foreground/30"
      onClick={() => onView?.(order.id)}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Link
              href={`/payment-orders/${order.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {order.title || order.orderNumber}
            </Link>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <StatusBadge variant={variant} icon={<Icon />}>
              {locale === "fa" ? label_fa : label_en}
            </StatusBadge>
          </div>
        </div>

        {/* Account */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Wallet className="w-4 h-4 shrink-0" />
          <span className="font-medium truncate">{order.accountTitle}</span>
        </div>

        {/* Amount & Transactions */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-secondary rounded-lg border border-border">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">
              {t("orders.totalAmount")}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(order.totalAmount, locale)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">
              {t("orders.totalTransactions")}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {order.totalTransactions || order.numberOfTransactions}
            </p>
          </div>
        </div>

        {/* Date & View Link */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {order.createdDateTime
              ? formatDate(order.createdDateTime, locale)
              : order.createdDate
              ? formatDate(order.createdDate, locale)
              : "-"}
          </div>
          <Link
            href={`/payment-orders/${order.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-primary hover:underline text-xs font-medium"
          >
            {t("common.buttons.view")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
