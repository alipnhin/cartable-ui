"use client";

import { useState } from "react";
import { Transaction } from "@/types/transaction";
import { Card, CardContent } from "@/components/ui/card";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StatusBadge,
  TransactionStatusBadge,
} from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { useLanguage } from "@/providers/i18n-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  ArrowUpDown,
} from "lucide-react";
import { MobilePagination } from "@/components/common/mobile-pagination";

interface TransactionTableProps {
  transactions: Transaction[];
}

type SortField = "amount" | "createdAt" | "beneficiaryName";
type SortDirection = "asc" | "desc";

export function TransactionTable({ transactions }: TransactionTableProps) {
  const { t, locale } = useTranslation();
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // مرتب‌سازی
  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "createdAt":
        comparison = a.createdDateTime.localeCompare(b.createdDateTime);
        break;
      case "beneficiaryName":
        comparison = (a.ownerName || "").localeCompare(b.ownerName || "");
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  // صفحه‌بندی
  const totalPages = Math.ceil(sortedTransactions.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleExport = () => {
    // Export logic
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(Number(newSize));
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isMobile) {
    // نمایش کارتی در موبایل
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {t("common.showing")} {startIndex + 1}-
              {Math.min(endIndex, transactions.length)} {t("common.of")}{" "}
              {transactions.length}
            </p>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>

          {paginatedTransactions.map((tx, index) => (
            <Card key={tx.id} className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium">{tx.ownerName}</span>
                  <TransactionStatusBadge status={tx.status} size="sm" />
                </div>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("transactions.amount")}:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(tx.amount, locale)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("transactions.iban")}:
                    </span>
                    <span className="font-mono text-xs">
                      {tx.destinationIban}
                    </span>
                  </div>
                  {tx.trackingId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("transactions.trackingNumber")}:
                      </span>
                      <span className="font-mono text-xs">{tx.trackingId}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t("common.date")}:
                    </span>
                    <span className="text-xs">
                      {formatDate(tx.createdDateTime)}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {/* Pagination موبایل */}
          {transactions.length > 0 && (
            <MobilePagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    );
  }

  // نمایش جدولی در دسکتاپ
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">
            {t("common.showing")} {startIndex + 1}-
            {Math.min(endIndex, transactions.length)} {t("common.of")}{" "}
            {transactions.length} {t("reports.transactions")}
          </p>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 me-2" />
            {t("common.buttons.export")}
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("beneficiaryName")}
                    className="hover:bg-transparent"
                  >
                    {t("transactions.ownerName")}
                    <ArrowUpDown className="ms-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>{t("transactions.iban")}</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("amount")}
                    className="hover:bg-transparent"
                  >
                    {t("transactions.amount")}
                    <ArrowUpDown className="ms-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>{t("transactions.trackingId")}</TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort("createdAt")}
                    className="hover:bg-transparent"
                  >
                    {t("common.date")}
                    <ArrowUpDown className="ms-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.map((tx, index) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{tx.ownerName}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {tx.destinationIban}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(tx.amount, locale)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {tx.trackingId || "-"}
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(tx.createdDateTime)}
                  </TableCell>
                  <TableCell>
                    <TransactionStatusBadge status={tx.status} size="sm" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination دسکتاپ */}
        <div className="flex items-center justify-between mt-4 px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {t("common.pagination.showing")}{" "}
            <span className="font-medium text-foreground">{startIndex + 1}</span>{" "}
            {t("common.pagination.to")}{" "}
            <span className="font-medium text-foreground">
              {Math.min(endIndex, transactions.length)}
            </span>{" "}
            {t("common.pagination.of")}{" "}
            <span className="font-medium text-foreground">{transactions.length}</span>
          </div>
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                {t("common.pagination.pageSize")}
              </p>
              <Select
                value={pageSize.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue />
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

            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              {t("common.pagination.page")} {currentPage} {t("common.pagination.of")} {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="hidden h-8 w-8 lg:flex"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
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
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
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
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
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
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
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
      </CardContent>
    </Card>
  );
}
