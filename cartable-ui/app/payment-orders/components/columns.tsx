"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { PaymentOrder, OrderStatus } from "@/types/order";
import { formatCurrency, formatDate } from "@/lib/helpers";
import Link from "next/link";
import {
  getPaymentStatusBadge,
  StatusBadge,
} from "@/components/ui/status-badge";

export const createColumns = (
  locale: string,
  t: (key: string) => string,
  onView?: (orderId: string) => void
): ColumnDef<PaymentOrder>[] => {
  const getStatusBadge = (status: OrderStatus) => {
    const statusMap: Record<
      OrderStatus,
      {
        label: string;
        variant:
          | "primary"
          | "secondary"
          | "destructive"
          | "outline"
          | "success"
          | "warning"
          | "info";
      }
    > = {
      [OrderStatus.WaitingForOwnersApproval]: {
        label: t("paymentCartable.statusLabels.waitingForApproval"),
        variant: "warning",
      },
      [OrderStatus.OwnersApproved]: {
        label: t("paymentCartable.statusLabels.approved"),
        variant: "success",
      },
      [OrderStatus.SubmittedToBank]: {
        label: t("paymentCartable.statusLabels.submittedToBank"),
        variant: "info",
      },
      [OrderStatus.Succeeded]: {
        label: t("paymentCartable.statusLabels.succeeded"),
        variant: "success",
      },
      [OrderStatus.Rejected]: {
        label: t("paymentCartable.statusLabels.rejected"),
        variant: "destructive",
      },
      [OrderStatus.BankRejected]: {
        label: t("paymentCartable.statusLabels.bankRejected"),
        variant: "destructive",
      },
      [OrderStatus.Draft]: {
        label: t("paymentCartable.statusLabels.draft"),
        variant: "outline",
      },
      [OrderStatus.PartiallySucceeded]: {
        label: t("paymentCartable.statusLabels.doneWithError"),
        variant: "warning",
      },
      [OrderStatus.Canceled]: {
        label: t("paymentCartable.statusLabels.canceled"),
        variant: "outline",
      },
      [OrderStatus.Expired]: {
        label: t("paymentCartable.statusLabels.expired"),
        variant: "outline",
      },
      [OrderStatus.OwnerRejected]: {
        label: "",
        variant: "primary",
      },
    };

    const statusInfo = statusMap[status];
    return (
      <Badge variant={statusInfo.variant} className="text-xs whitespace-nowrap">
        {statusInfo.label}
      </Badge>
    );
  };

  return [
    {
      accessorKey: "orderNumber",
      header: t("orders.orderNumber"),
      cell: ({ row }) => (
        <div className="font-medium">{row.original.orderNumber}</div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "accountTitle",
      header: t("orders.accountTitle"),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate">
          {row.original.accountTitle}
        </div>
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
        const statusBadge = getPaymentStatusBadge(row.original.status);
        const { variant, icon: Icon, label_fa, label_en } = statusBadge;

        return (
          <StatusBadge variant={variant} icon={<Icon />}>
            {locale === "fa" ? label_fa : label_en}
          </StatusBadge>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "createdDateTime",
      header: t("orders.createdDate"),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground whitespace-nowrap">
          {row.original.createdDateTime
            ? formatDate(row.original.createdDateTime, locale)
            : "-"}
        </div>
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      header: t("common.actions"),
      cell: ({ row }) => (
        <Button
          variant="outline"
          className="hover:bg-muted/80 transition-colors"
          asChild
        >
          <Link href={`/payment-orders/${row.original.id}`}>
            <Eye className="h-4 w-4 me-2" />
            {t("common.buttons.view")}
          </Link>
        </Button>
      ),
      enableSorting: false,
    },
  ];
};
