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
  FileX,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useLanguage } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  /** Server-side pagination */
  pageNumber?: number;
  totalPages?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
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
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation();
  const { language } = useLanguage();

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
      <div className="rounded-lg border-2 bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20">
        <div className="p-4 border-b">
          <div className="flex font-bold">
            <LayoutList className="me-2" size={20} />
            {t("paymentCartable.pageTitle")}
          </div>
        </div>
        <div className="p-4">
          {/* Table Header Skeleton */}
          <div className="flex gap-4 pb-4 border-b mb-4">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          {/* Table Rows Skeleton */}
          {Array.from({ length: pageSize || 10 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-3 border-b last:border-0">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-lg border-2 bg-card transition-all duration-200 hover:shadow-lg hover:border-primary/20">
        <div className="flex flex-col items-center gap-3 py-16">
          <FileX className="h-12 w-12 text-muted-foreground/50" />
          <div className="space-y-1 text-center">
            <p className="font-medium text-muted-foreground">
              {t("orders.noOrders")}
            </p>
            <p className="text-sm text-muted-foreground/70">
              فیلترهای جستجو را تغییر دهید یا دستور پرداخت جدید ایجاد کنید
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border-2 bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/20">
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
        <div className="flex-1 text-sm text-muted-foreground">
          {isServerSide ? (
            <>
              {t("common.pagination.showing")}{" "}
              <span className="font-medium text-foreground">
                {(pageNumber - 1) * pageSize + 1}
              </span>{" "}
              {t("common.pagination.to")}{" "}
              <span className="font-medium text-foreground">
                {Math.min(pageNumber * pageSize, data.length > 0 ? (pageNumber - 1) * pageSize + data.length : 0)}
              </span>
            </>
          ) : (
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
        <div className="flex items-center gap-6 lg:gap-8">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              {t("common.pagination.pageSize")}
            </p>
            <Select
              value={`${isServerSide ? pageSize : table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                if (isServerSide && onPageSizeChange) {
                  onPageSizeChange(Number(value));
                  onPageChange?.(1);
                } else {
                  table.setPageSize(Number(value));
                }
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={isServerSide ? pageSize : table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Info */}
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {t("common.pagination.page")}{" "}
            {isServerSide ? pageNumber : table.getState().pagination.pageIndex + 1}{" "}
            {t("common.pagination.of")}{" "}
            {isServerSide ? totalPages : table.getPageCount()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
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
              <span className="sr-only">{t("common.pagination.firstPage")}</span>
              {language.direction === "rtl" ? (
                <ChevronsRight className="h-4 w-4" />
              ) : (
                <ChevronsLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
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
              <span className="sr-only">{t("common.pagination.previousPage")}</span>
              {language.direction === "rtl" ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
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
              <span className="sr-only">{t("common.pagination.nextPage")}</span>
              {language.direction === "rtl" ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
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
              <span className="sr-only">{t("common.pagination.lastPage")}</span>
              {language.direction === "rtl" ? (
                <ChevronsLeft className="h-4 w-4" />
              ) : (
                <ChevronsRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
