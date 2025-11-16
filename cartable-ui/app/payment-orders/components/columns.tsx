"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { PaymentOrder, OrderStatus } from "@/types/order";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/helpers";
import Link from "next/link";
import {
  getPaymentStatusBadge,
  OrderStatusBadge,
  StatusBadge,
} from "@/components/ui/status-badge";
import { getBankCodeFromIban } from "@/lib/bank-logos";
import { BankLogo } from "@/components/common/bank-logo";

export const createColumns = (
  locale: string,
  t: (key: string) => string,
  onView?: (orderId: string) => void
): ColumnDef<PaymentOrder>[] => {
  return [
    {
      accessorKey: "accountTitle",
      header: t("orders.accountTitle"),
      cell: ({ row }) => {
        const bankCode = getBankCodeFromIban(row.original.accountSheba);
        return (
          <div className="flex items-center grow gap-2.5">
            {row.original.accountSheba && (
              <BankLogo bankCode={bankCode} size="md" />
            )}
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-mono hover:text-primary-active mb-px">
                {row.original.accountTitle}
              </span>
              <span className="text-xs font-normal text-secondary-foreground leading-3">
                {row.original.accountNumber}
              </span>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "orderNumber",
      header: t("orders.orderNumber"),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.orderNumber}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "totalAmount",
      header: t("orders.totalAmount"),
      cell: ({ row }) => (
        <div className="font-semibold text-primary whitespace-nowrap">
          {formatCurrency(row.original.totalAmount, locale)}
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "numberOfTransactions",
      header: t("orders.totalTransactions"),
      cell: ({ row }) => (
        <div className="text-center">{row.original.numberOfTransactions}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: t("orders.status"),
      cell: ({ row }) => {
        return <OrderStatusBadge status={row.original.status} size="default" />;
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdDateTime",
      header: t("orders.createdDate"),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {row.original.createdDateTime
            ? formatDateTime(row.original.createdDateTime, locale)
            : "-"}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <Button variant="outline" size="sm" asChild>
          <Link href={`/payment-orders/${row.original.id}`}>
            <Eye className="" />
            {t("common.buttons.view")}
          </Link>
        </Button>
      ),
      enableSorting: false,
    },
  ];
};
