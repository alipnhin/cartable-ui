"use client";

import {
  TransactionItem,
  formatAmount,
  formatDateToPersian,
  TransactionStatusInfo,
  PaymentTypeInfo
} from "@/services/transactionService";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useTranslation from "@/hooks/useTranslation";
import { useLanguage } from "@/providers/i18n-provider";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  Loader2,
} from "lucide-react";
import { MobilePagination } from "@/components/common/mobile-pagination";

interface TransactionTableProps {
  transactions: TransactionItem[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  loading: boolean;
  exporting: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onExport: () => void;
}

export function TransactionTable({
  transactions = [],
  totalRecords,
  currentPage,
  pageSize,
  loading,
  exporting,
  onPageChange,
  onPageSizeChange,
  onExport,
}: TransactionTableProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  const totalPages = Math.ceil((totalRecords || 0) / pageSize) || 0;
  const startIndex = totalRecords > 0 ? (currentPage - 1) * pageSize : 0;
  const endIndex = totalRecords > 0 ? Math.min(startIndex + pageSize, totalRecords) : 0;

  const handlePageSizeChange = (newSize: string) => {
    onPageSizeChange(Number(newSize));
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get badge variant based on status
  const getStatusVariant = (status: string) => {
    const statusInfo = TransactionStatusInfo[status];
    if (!statusInfo) return "secondary";
    switch (statusInfo.class) {
      case "success":
        return "success";
      case "danger":
        return "destructive";
      case "warning":
        return "warning";
      case "info":
        return "info";
      default:
        return "secondary";
    }
  };

  // Get badge variant based on payment type
  const getPaymentTypeVariant = (paymentType: string) => {
    const typeInfo = PaymentTypeInfo[paymentType];
    if (!typeInfo) return "secondary";
    switch (typeInfo.class) {
      case "success":
        return "success";
      case "primary":
        return "default";
      case "info":
        return "info";
      case "warning":
        return "warning";
      default:
        return "secondary";
    }
  };

  // Get status label
  const getStatusLabel = (status: string) => {
    return TransactionStatusInfo[status]?.label || status;
  };

  // Get payment type label
  const getPaymentTypeLabel = (paymentType: string) => {
    return PaymentTypeInfo[paymentType]?.label || paymentType;
  };

  if (isMobile) {
    // نمایش کارتی در موبایل
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {totalRecords > 0
                ? `${t("common.showing")} ${startIndex + 1}-${endIndex} ${t("common.of")} ${totalRecords}`
                : t("common.noData")}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onExport}
              disabled={exporting}
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          </div>

          {loading ? (
            // Loading skeleton for mobile
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="p-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            transactions.map((tx) => (
              <Card key={tx.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-sm">
                      {tx.destinationAccountOwner}
                    </span>
                    <Badge variant={getStatusVariant(tx.status)} className="text-xs">
                      {getStatusLabel(tx.status)}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("transactions.amount")}:
                      </span>
                      <span className="font-medium">{formatAmount(tx.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("transactions.iban")}:
                      </span>
                      <span className="font-mono text-xs">
                        {tx.destinationIban.slice(0, 15)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">نوع پرداخت:</span>
                      <Badge
                        variant={getPaymentTypeVariant(tx.paymentType)}
                        className="text-xs"
                      >
                        {getPaymentTypeLabel(tx.paymentType)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("common.date")}:
                      </span>
                      <span className="text-xs">{formatDateToPersian(tx.createdDateTime)}</span>
                    </div>
                    {tx.transferDateTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاریخ انتقال:</span>
                        <span className="text-xs">{formatDateToPersian(tx.transferDateTime)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}

          {/* Pagination موبایل */}
          {totalRecords > 0 && (
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
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {t("common.showing")} {startIndex + 1}-{endIndex} {t("common.of")}{" "}
            {totalRecords} {t("reports.transactions")}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 me-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 me-2" />
            )}
            {t("common.buttons.export")}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>{t("transactions.ownerName")}</TableHead>
                <TableHead>{t("transactions.iban")}</TableHead>
                <TableHead>بانک</TableHead>
                <TableHead>{t("transactions.amount")}</TableHead>
                <TableHead>نوع پرداخت</TableHead>
                <TableHead>تاریخ ثبت</TableHead>
                <TableHead>تاریخ انتقال</TableHead>
                <TableHead>{t("common.status")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                [...Array(pageSize > 10 ? 10 : pageSize)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <p className="text-muted-foreground">تراکنشی یافت نشد</p>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((tx, index) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-medium">
                      {startIndex + index + 1}
                    </TableCell>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {tx.destinationAccountOwner}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {tx.destinationIban}
                    </TableCell>
                    <TableCell className="text-sm">{tx.bankName}</TableCell>
                    <TableCell className="font-medium">{formatAmount(tx.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={getPaymentTypeVariant(tx.paymentType)}
                        className="text-xs"
                      >
                        {getPaymentTypeLabel(tx.paymentType)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateToPersian(tx.createdDateTime)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateToPersian(tx.transferDateTime)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusVariant(tx.status)}
                        className="text-xs"
                      >
                        {getStatusLabel(tx.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
      </div>

      {/* Pagination دسکتاپ */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="flex-1 text-sm text-muted-foreground">
          {totalRecords > 0 ? (
            <>
              {t("common.pagination.showing")}{" "}
              <span className="font-medium text-foreground">{startIndex + 1}</span>{" "}
              {t("common.pagination.to")}{" "}
              <span className="font-medium text-foreground">{endIndex}</span>{" "}
              {t("common.pagination.of")}{" "}
              <span className="font-medium text-foreground">{totalRecords}</span>
            </>
          ) : (
            t("common.noData")
          )}
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
                {[10, 25, 50, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            {t("common.pagination.page")} {currentPage}{" "}
            {t("common.pagination.of")} {totalPages || 1}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="hidden h-8 w-8 lg:flex"
              onClick={() => handlePageChange(1)}
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">
                {t("common.pagination.previousPage")}
              </span>
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
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
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
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
    </Card>
  );
}
