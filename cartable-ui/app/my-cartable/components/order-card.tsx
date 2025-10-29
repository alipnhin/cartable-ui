"use client";

import { PaymentOrder, OrderStatus } from "@/types/order";
import {
  StatusBadge,
  getPaymentStatusBadge,
} from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  XCircle,
  Eye,
  Wallet,
  MoreVertical,
  Check,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface OrderCardProps {
  order: PaymentOrder;
  onApprove?: (orderId: string) => void;
  onReject?: (orderId: string) => void;
  selected?: boolean;
  onSelect?: (orderId: string) => void;
  showActions?: boolean;
}

export function OrderCard({
  order,
  onApprove,
  onReject,
  selected = false,
  onSelect,
  showActions = true,
}: OrderCardProps) {
  const { t, locale } = useTranslation();
  const statusBadge = getPaymentStatusBadge(order.status);
  const { variant, icon: Icon, label_fa, label_en } = statusBadge;

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(order.id);
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-200 cursor-pointer",
        selected && "ring-2 ring-primary bg-primary/5",
        !selected && "hover:border-muted-foreground/30"
      )}
      onClick={handleCardClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Selection indicator */}
            {selected && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
            <Link
              href={`/payment-orders/${order.id}`}
              onClick={(e) => e.stopPropagation()}
              className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
            >
              {order.title}
            </Link>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <StatusBadge variant={variant} icon={<Icon />}>
              {locale === "fa" ? label_fa : label_en}
            </StatusBadge>
            {/* Actions Menu */}
            {showActions &&
              order.status === OrderStatus.WaitingForOwnersApproval && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {onApprove && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onApprove(order.id);
                        }}
                      >
                        <CheckCircle className="me-2 h-4 w-4 text-success" />
                        {t("common.buttons.approve")}
                      </DropdownMenuItem>
                    )}
                    {onReject && (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onReject(order.id);
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <XCircle className="me-2 h-4 w-4" />
                        {t("common.buttons.reject")}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
            {formatDate(order.createdDate || order.createdAt, locale)}
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
