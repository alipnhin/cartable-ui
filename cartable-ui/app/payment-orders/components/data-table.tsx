"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  OnChangeFn,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  LayoutList,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  /** Server-side pagination */
  pageNumber?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  /** Server-side sorting */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  pageNumber = 1,
  totalPages = 1,
  onPageChange,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();

  // استفاده از sorting سرور یا کلاینت
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const sorting = externalSorting !== undefined ? externalSorting : internalSorting;
  const setSorting = externalOnSortingChange || setInternalSorting;

  // تشخیص server-side یا client-side mode
  const isServerSide = onPageChange !== undefined;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    // فقط در حالت client-side از این features استفاده می‌شود
    getPaginationRowModel: isServerSide ? undefined : getPaginationRowModel(),
    getSortedRowModel: isServerSide ? undefined : getSortedRowModel(),
    manualPagination: isServerSide,
    manualSorting: isServerSide,
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    pageCount: totalPages,
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-12 text-center">
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            {t("common.pagination.loading")}
          </div>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border bg-card">
        <div className="p-12 text-center text-muted-foreground">
          {t("orders.noOrders")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex font-bold ">
            <LayoutList className="me-2" size={20} />
            {t("paymentCartable.pageTitle")}
          </div>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-bold bg-muted/40 ">
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          header.column.getCanSort() &&
                            "flex items-center gap-2 cursor-pointer select-none hover:text-foreground transition-colors",
                          !header.column.getCanSort() && "flex items-center"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            {header.column.getIsSorted() === "asc" ? (
                              <ArrowUp className="h-4 w-4 text-primary" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ArrowDown className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowUpDown className="h-4 w-4 text-muted-foreground/50" />
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          {isServerSide ? (
            // Server-side pagination info
            <>
              {t("common.pagination.page")}{" "}
              <span className="font-medium text-foreground">{pageNumber}</span>{" "}
              {t("common.pagination.of")}{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </>
          ) : (
            // Client-side pagination info
            <>
              {t("common.pagination.showing")}{" "}
              <span className="font-medium text-foreground">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
              </span>{" "}
              {t("common.pagination.to")}{" "}
              <span className="font-medium text-foreground">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  data.length
                )}
              </span>{" "}
              {t("common.pagination.of")}{" "}
              <span className="font-medium text-foreground">{data.length}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSide && onPageChange) {
                onPageChange(1);
              } else {
                table.setPageIndex(0);
              }
            }}
            disabled={
              isServerSide ? pageNumber === 1 : !table.getCanPreviousPage()
            }
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSide && onPageChange) {
                onPageChange(pageNumber - 1);
              } else {
                table.previousPage();
              }
            }}
            disabled={
              isServerSide ? pageNumber === 1 : !table.getCanPreviousPage()
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium px-3">
            {t("common.pagination.page")}{" "}
            <span className="text-primary">
              {isServerSide
                ? pageNumber
                : table.getState().pagination.pageIndex + 1}
            </span>{" "}
            {t("common.pagination.of")}{" "}
            <span className="text-primary">
              {isServerSide ? totalPages : table.getPageCount()}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSide && onPageChange) {
                onPageChange(pageNumber + 1);
              } else {
                table.nextPage();
              }
            }}
            disabled={
              isServerSide
                ? pageNumber === totalPages
                : !table.getCanNextPage()
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isServerSide && onPageChange) {
                onPageChange(totalPages);
              } else {
                table.setPageIndex(table.getPageCount() - 1);
              }
            }}
            disabled={
              isServerSide
                ? pageNumber === totalPages
                : !table.getCanNextPage()
            }
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
