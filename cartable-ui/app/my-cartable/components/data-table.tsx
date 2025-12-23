"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardCheck } from "lucide-react";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;
  // Server-side pagination props
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Controlled row selection
  rowSelection?: Record<string, boolean>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  onRowSelectionChange,
  pageCount,
  pageIndex = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  rowSelection: controlledRowSelection,
}: DataTableProps<TData, TValue>) {
  const [internalRowSelection, setInternalRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // استفاده از controlled یا uncontrolled row selection
  const isControlled = controlledRowSelection !== undefined;
  const rowSelection = isControlled ? controlledRowSelection : internalRowSelection;
  const setRowSelection = isControlled ?
    (updater: any) => {
      const newSelection = typeof updater === 'function' ? updater(controlledRowSelection) : updater;
      onRowSelectionChange?.(newSelection);
    } :
    setInternalRowSelection;

  // Notify parent of row selection changes (only for uncontrolled)
  React.useEffect(() => {
    if (!isControlled && onRowSelectionChange) {
      onRowSelectionChange(internalRowSelection);
    }
  }, [internalRowSelection, onRowSelectionChange, isControlled]);

  // استفاده از server-side pagination اگر props مربوطه ارسال شده باشد
  const isServerSidePagination = pageCount !== undefined && onPageChange !== undefined;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      ...(isServerSidePagination && {
        pagination: {
          pageIndex,
          pageSize,
        },
      }),
    },
    ...(isServerSidePagination && {
      pageCount,
      manualPagination: true,
      onPaginationChange: (updater) => {
        if (typeof updater === 'function') {
          const newState = updater({ pageIndex, pageSize });
          if (newState.pageIndex !== pageIndex) {
            onPageChange(newState.pageIndex);
          }
          if (newState.pageSize !== pageSize && onPageSizeChange) {
            onPageSizeChange(newState.pageSize);
          }
        }
      },
    }),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...(!isServerSidePagination && {
      getPaginationRowModel: getPaginationRowModel(),
    }),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // استفاده از ID واقعی برای شناسایی ردیف‌ها
    getRowId: (row: any) => row.id,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border-2 bg-card transition-all duration-200 hover:shadow-lg hover:border-primary/20">
        <div className="p-4 border-b">
          <DataTableToolbar table={table} />
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="bg-muted/40 font-bold"
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {columns.map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-48"
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <ClipboardCheck className="h-12 w-12 text-muted-foreground/50" />
                    <div className="space-y-1 text-center">
                      <p className="font-medium text-muted-foreground">
                        دستوری برای تأیید وجود ندارد
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        در حال حاضر هیچ دستور پرداختی در انتظار تأیید شما نیست
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
