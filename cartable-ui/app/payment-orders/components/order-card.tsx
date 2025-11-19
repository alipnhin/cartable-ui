"use client";

import { PaymentOrder, OrderStatus } from "@/types/order";
import {
  StatusBadge,
  getPaymentStatusBadge,
} from "@/components/ui/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, Hash, Banknote, ChevronLeft } from "lucide-react";
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { Skeleton } from "@/components/ui/skeleton";
import { BankLogo } from "@/components/common/bank-logo";

// Helper to extract bank code from SHEBA
const getBankCodeFromSheba = (sheba: string): string => {
  if (!sheba || sheba.length < 7) return "999";
  // SHEBA format: IR + 2 check digits + 3 digit bank code
  return sheba.substring(4, 7);
};

// Helper to format date with time
const formatDateTime = (dateString: string, locale: string): { date: string; time: string } => {
  if (!dateString) return { date: "-", time: "" };

  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeFormatter = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
  };
};

interface OrderCardProps {
  order: PaymentOrder;
  onView?: (orderId: string) => void;
}

export function OrderCard({ order, onView }: OrderCardProps) {
  const { t, locale } = useTranslation();
  const statusBadge = getPaymentStatusBadge(order.status);
  const { variant, icon: Icon, label_fa, label_en } = statusBadge;

  const bankCode = getBankCodeFromSheba(order.accountSheba);
  const dateTime = formatDateTime(order.createdDateTime || order.createdDate || "", locale);

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:border-primary/30 hover:shadow-sm active:scale-[0.99] cursor-pointer"
      onClick={() => onView?.(order.id)}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header with Bank Logo and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <BankLogo bankCode={bankCode} size="sm" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground line-clamp-1">
                {order.title || order.orderNumber}
              </h3>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {order.accountTitle}
              </p>
            </div>
          </div>
          <StatusBadge variant={variant} icon={<Icon />}>
            {locale === "fa" ? label_fa : label_en}
          </StatusBadge>
        </div>

        {/* Order Number */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Hash className="w-3.5 h-3.5 shrink-0" />
          <span className="font-medium">{order.orderNumber}</span>
        </div>

        {/* Amount & Transactions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-primary/5 rounded-lg">
            <div className="flex items-center gap-1.5 mb-1">
              <Banknote className="w-3.5 h-3.5 text-primary" />
              <p className="text-xs text-muted-foreground">
                {t("orders.totalAmount")}
              </p>
            </div>
            <p className="text-sm font-bold text-foreground">
              {formatCurrency(order.totalAmount, locale)}
            </p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">
              {t("orders.totalTransactions")}
            </p>
            <p className="text-sm font-bold text-foreground">
              {order.totalTransactions || order.numberOfTransactions}
            </p>
          </div>
        </div>

        {/* Date & Time with Navigate Indicator */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateTime.date}</span>
            </div>
            {dateTime.time && (
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{dateTime.time}</span>
              </div>
            )}
          </div>
          <ChevronLeft className="w-4 h-4 text-muted-foreground/50" />
        </div>
      </CardContent>
    </Card>
  );
}

export function OrderCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-4">
        {/* Header with Bank Logo and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton className="h-6 w-6 rounded" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>

        {/* Order Number */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-3.5 rounded" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Amount & Transactions */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-muted/30 rounded-lg space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="p-3 bg-muted/30 rounded-lg space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}
