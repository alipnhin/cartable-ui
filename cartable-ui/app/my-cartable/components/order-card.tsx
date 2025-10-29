"use client";

import { PaymentOrder, OrderStatus } from "@/types/order";
import {
  StatusBadge,
  getPaymentStatusBadge,
} from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Eye, Wallet } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderCardProps {
  order: PaymentOrder;
  onApprove?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
}

export function OrderCard({ order, onApprove, onReject }: OrderCardProps) {
  const { t, locale } = useTranslation();
  const statusBadge = getPaymentStatusBadge(order.status);
  const { variant, icon: Icon, label_fa, label_en } = statusBadge;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:border-muted-foreground/30">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/payment-orders/${order.id}`}
            className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
          >
            {order.title}
          </Link>
          <StatusBadge variant={variant} icon={<Icon />}>
            {locale === "fa" ? label_fa : label_en}
          </StatusBadge>
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

        {/* Date */}
        <div className="text-xs text-muted-foreground">
          {formatDate(order.createdDate || order.createdAt, locale)}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/payment-orders/${order.id}`}>
              <Eye className="h-4 w-4 me-2" />
              {t("common.buttons.view")}
            </Link>
          </Button>
          {order.status === OrderStatus.WaitingForOwnersApproval && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-success border-success/30 hover:bg-success/10 dark:hover:bg-success/20"
                onClick={() => onApprove?.(order.id)}
              >
                <CheckCircle className="h-4 w-4 me-2" />
                {t("common.buttons.approve")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10 dark:hover:bg-destructive/20"
                onClick={() => onReject?.(order.id)}
              >
                <XCircle className="h-4 w-4 me-2" />
                {t("common.buttons.reject")}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-2 gap-3 p-3 bg-secondary rounded-lg">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-12" />
          </div>
        </div>
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}
