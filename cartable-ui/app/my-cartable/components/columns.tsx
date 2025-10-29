"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PaymentOrder, OrderStatus } from "@/types/order";
import {
  StatusBadge,
  getPaymentStatusBadge,
} from "@/components/ui/status-badge";
import {
  Eye,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/helpers";

export const createColumns = (
  locale: string,
  onApprove: (orderId: string) => void,
  onReject: (orderId: string) => void,
  t: (key: string) => string
): ColumnDef<PaymentOrder>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="انتخاب همه"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="انتخاب ردیف"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      accessorKey: "orderNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent font-semibold"
          >
            {t("orders.orderNumber")}
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link
          href={`/payment-orders/${row.original.id}`}
          className="font-medium text-primary hover:underline"
        >
          {row.original.orderNumber}
        </Link>
      ),
      size: 150,
    },
    {
      accessorKey: "accountTitle",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent font-semibold"
          >
            {t("orders.accountTitle")}
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-muted-foreground">
          {row.original.accountTitle}
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent font-semibold"
          >
            {t("orders.totalAmount")}
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className=" font-semibold">
          {formatCurrency(row.original.totalAmount, locale)}
        </div>
      ),
      size: 150,
    },
    {
      accessorKey: "totalTransactions",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent font-semibold"
          >
            {t("orders.totalTransactions")}
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.totalTransactions || row.original.numberOfTransactions}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "status",
      header: () => <div className="font-semibold">{t("orders.status")}</div>,
      cell: ({ row }) => {
        const statusBadge = getPaymentStatusBadge(row.original.status);
        const { variant, icon: Icon, label_fa, label_en } = statusBadge;

        return (
          <StatusBadge variant={variant} icon={<Icon />}>
            {locale === "fa" ? label_fa : label_en}
          </StatusBadge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
      size: 140,
    },
    {
      accessorKey: "createdDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="h-8 px-2 hover:bg-transparent font-semibold"
          >
            {t("orders.createdDate")}
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {formatDate(
            row.original.createdDate || row.original.createdAt,
            locale
          )}
        </div>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: () => (
        <div className="text-center font-semibold">{t("common.actions")}</div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
            <Link href={`/payment-orders/${row.original.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only"> {t("common.buttons.view")}</span>
            </Link>
          </Button>
          {row.original.status === OrderStatus.WaitingForOwnersApproval && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(row.original.id);
                }}
              >
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only">{t("common.buttons.approve")}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(row.original.id);
                }}
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only">{t("common.buttons.reject")}</span>
              </Button>
            </>
          )}
        </div>
      ),
      size: 120,
    },
  ];
};
