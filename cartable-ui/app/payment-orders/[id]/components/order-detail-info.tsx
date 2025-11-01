"use client";

import { PaymentOrderDetail } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import {
  Building2,
  Calendar,
  User,
  Hash,
  Wallet,
  FileText,
  Clock,
} from "lucide-react";

interface OrderDetailInfoProps {
  order: PaymentOrderDetail;
}

export function OrderDetailInfo({ order }: OrderDetailInfoProps) {
  const { t, locale } = useTranslation();

  const infoItems = [
    {
      icon: Hash,
      label: t("paymentOrders.orderNumber"),
      value: order.orderId,
    },
    {
      icon: Building2,
      label: t("accounts.accountNumber"),
      value: order.account.accountNumber,
    },
    {
      icon: Building2,
      label: t("accounts.sheba"),
      value: order.account.sheba,
    },
    {
      icon: Building2,
      label: t("accounts.bankName"),
      value: order.account.bankName,
    },
    {
      icon: Wallet,
      label: t("paymentOrders.totalAmount"),
      value: formatCurrency(order.totalAmount, locale),
      highlight: true,
    },
    {
      icon: FileText,
      label: t("paymentOrders.numberOfTransactions"),
      value: order.transactions.length.toString(),
    },
    {
      icon: User,
      label: t("paymentOrders.createdBy"),
      value: order.createdByName,
    },
    {
      icon: Calendar,
      label: t("paymentOrders.createdAt"),
      value: formatDate(order.createdAt, locale),
    },
    {
      icon: Clock,
      label: t("paymentOrders.updatedAt"),
      value: formatDate(order.updatedAt, locale),
    },
  ];

  // اضافه کردن تاریخ ارسال به بانک
  if (order.submittedToBankAt) {
    infoItems.push({
      icon: Calendar,
      label: t("paymentOrders.submittedToBankAt"),
      value: formatDate(order.submittedToBankAt, locale),
    });
  }

  // اضافه کردن تاریخ پردازش
  if (order.processedAt) {
    infoItems.push({
      icon: Calendar,
      label: t("paymentOrders.processedAt"),
      value: formatDate(order.processedAt, locale),
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("paymentOrders.orderInformation")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* توضیحات */}
        {order.description && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              {t("paymentOrders.description")}
            </p>
            <p className="mt-1">{order.description}</p>
          </div>
        )}

        {/* اطلاعات به صورت Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infoItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  item.highlight ? "bg-primary/5 border border-primary/20" : ""
                }`}
              >
                <div className="mt-0.5">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-0.5">
                    {item.label}
                  </p>
                  <p
                    className={`font-medium truncate ${
                      item.highlight ? "text-primary text-lg" : ""
                    }`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
