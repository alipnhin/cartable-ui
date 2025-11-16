"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { OrderStatus } from "@/types/order";
import { mockAccounts } from "@/mocks";
import useTranslation from "@/hooks/useTranslation";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const statusOptions = mockAccounts.map((account) => ({
  label: account.accountTitle,
  value: account.accountTitle,
}));

// const statusOptions = [
//   {
//     label: "waitingForApproval",
//     value: OrderStatus.WaitingForOwnersApproval,
//   },
//   {
//     label: "approved",
//     value: OrderStatus.OwnersApproved,
//   },
//   {
//     label: "submittedToBank",
//     value: OrderStatus.SubmittedToBank,
//   },
//   {
//     label: "succeeded",
//     value: OrderStatus.Succeeded,
//   },
//   {
//     label: "bankRejected",
//     value: OrderStatus.Rejected,
//   },
// ];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder={t("filters.searchPlaceholder")}
          value={
            (table.getColumn("orderNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("orderNumber")?.setFilterValue(event.target.value)
          }
          className="h-9 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("accountTitle")}
            title={t(`orders.accountTitle`)}
            options={statusOptions}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3"
          >
            {t("common.buttons.reset")}
            <X className="ms-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} از{" "}
        {table.getFilteredRowModel().rows.length} {t("common.selected")}
        {/* <DataTableViewOptions table={table} /> */}
      </div>
    </div>
  );
}
