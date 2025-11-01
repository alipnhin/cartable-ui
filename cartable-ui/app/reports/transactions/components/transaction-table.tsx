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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  ArrowUpDown,
} from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
}

type SortField = "amount" | "createdAt" | "beneficiaryName";
type SortDirection = "asc" | "desc";

export function TransactionTable({ transactions }: TransactionTableProps) {
  const { t, locale } = useTranslation();
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
          <div className="flex items-center justify-between gap-2 pt-4">
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="flex items-center px-3 text-sm">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
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
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("common.pagination.pageSize")}:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsRight className="h-4 w-4 me-2" />
              {t("common.pagination.firstPage")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronRight className="h-4 w-4 me-2" />
              {t("common.pagination.previousPage")}
            </Button>
            <span className="text-sm px-4">
              {t("common.pagination.page")} {currentPage} {t("common.of")}{" "}
              {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              {t("common.pagination.nextPage")}
              <ChevronLeft className="h-4 w-4 ms-2" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              {t("common.pagination.lastPage")}
              <ChevronsLeft className="h-4 w-4 ms-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
