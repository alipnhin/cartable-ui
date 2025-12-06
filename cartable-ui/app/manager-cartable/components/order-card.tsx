"use client";

import { useState } from "react";
import { PaymentOrder, OrderStatus } from "@/types/order";
import {
  OrderStatusBadge,
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
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  CheckCircle,
  XCircle,
  Eye,
  Wallet,
  MoreVertical,
  Check,
  Zap,
} from "lucide-react";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  const [actionsOpen, setActionsOpen] = useState(false);

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(order.id);
    }
  };

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApprove) {
      onApprove(order.id);
      setActionsOpen(false);
    }
  };

  const handleReject = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReject) {
      onReject(order.id);
      setActionsOpen(false);
    }
  };

  return (
    <>
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
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shrink-0">
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
            <div className="flex items-center gap-1 shrink-0">
              <OrderStatusBadge status={order.status} size="default" />
              {showActions &&
                order.status === OrderStatus.WaitForManagerApproval && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActionsOpen(true);
                    }}
                    variant="outline"
                    mode="icon"
                    className="ms-3"
                  >
                    <Zap />
                  </Button>
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
              {formatDateTime(order.createdDate || order.createdAt, locale)}
            </div>

            <Button variant="outline">
              <Eye />
              <Link
                href={`/payment-orders/${order.id}`}
                onClick={(e) => e.stopPropagation()}
              >
                {t("common.buttons.view")}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Actions Drawer */}
      {isMobile && (
        <Drawer open={actionsOpen} onOpenChange={setActionsOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-base">{order.title}</DrawerTitle>
            </DrawerHeader>

            <div className="flex gap-2 p-6 mb-8">
              {onReject && (
                <Button
                  onClick={handleReject}
                  variant="destructive"
                  className="flex-1  flex items-center justify-center gap-2"
                  size="lg"
                >
                  <XCircle className="me-2 h-5 w-5" />
                  {t("common.buttons.reject")}
                </Button>
              )}
              {onApprove && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleApprove}
                  className="flex-1  flex items-center justify-center gap-2"
                >
                  <CheckCircle className="me-2 h-5 w-5" />
                  {t("common.buttons.approve")}
                </Button>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
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
