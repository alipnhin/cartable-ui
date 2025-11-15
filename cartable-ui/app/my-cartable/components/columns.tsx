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
import { getBankCodeFromIban } from "@/lib/bank-logos";
import { BankLogo } from "@/components/common/bank-logo";

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
        <div className="flex items-center justify-center gap-2">
          {/* دکمه مشاهده */}
          <Button
            variant="outline"
            size="sm"
            className=""
            asChild
            title={t("common.buttons.view")}
          >
            <Link href={`/payment-orders/${row.original.id}`}>
              <Eye className="h-4 w-4" />
              <span className="sr-only xl:not-sr-only">
                {t("common.buttons.view")}
              </span>
            </Link>
          </Button>

          {/* دکمه‌های تأیید/رد فقط برای دستورات در انتظار */}
          {row.original.status === OrderStatus.WaitingForOwnersApproval && (
            <>
              {/* دکمه تأیید */}
              <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove(row.original.id);
                }}
                title={t("common.buttons.approve")}
              >
                <CheckCircle className="h-4 w-4" />
                <span className="sr-only xl:not-sr-only">
                  {t("common.buttons.approve")}
                </span>
              </Button>

              {/* دکمه رد */}
              <Button
                variant="destructive"
                size="sm"
                className=" gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onReject(row.original.id);
                }}
                title={t("common.buttons.reject")}
              >
                <XCircle className="h-4 w-4" />
                <span className="sr-only xl:not-sr-only">
                  {t("common.buttons.reject")}
                </span>
              </Button>
            </>
          )}
        </div>
      ),
      size: 180,
    },
  ];
};
