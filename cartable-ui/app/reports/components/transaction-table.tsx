"use client";

import {
  TransactionItem,
  formatAmount,
  formatDateToPersian,
} from "@/services/transactionService";
import {
  PaymentTypeBadge,
  TransactionStatusBadge,
} from "@/components/ui/status-badge";
import { PaymentMethodEnum, PaymentItemStatusEnum } from "@/types/api";
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
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  SearchX,
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
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
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
  sortField,
  sortDirection,
  onSort,
}: TransactionTableProps) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isMobile = useIsMobile();

  // Sortable column header component
  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => {
    const isActive = sortField === field;
    return (
      <Button
        variant="ghost"
        size="sm"
        className="-mx-3 h-8 data-[state=open]:bg-accent"
        onClick={() => onSort?.(field)}
      >
        {children}
        {isActive ? (
          sortDirection === "asc" ? (
            <ArrowUp className="ms-2 h-4 w-4" />
          ) : (
            <ArrowDown className="ms-2 h-4 w-4" />
          )
        ) : (
          <ArrowUpDown className="ms-2 h-4 w-4" />
        )}
      </Button>
    );
  };

  const totalPages = Math.ceil((totalRecords || 0) / pageSize) || 0;
  const startIndex = totalRecords > 0 ? (currentPage - 1) * pageSize : 0;
  const endIndex =
    totalRecords > 0 ? Math.min(startIndex + pageSize, totalRecords) : 0;

  const handlePageSizeChange = (newSize: string) => {
    onPageSizeChange(Number(newSize));
  };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper functions برای نمایش status و payment type
  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, { variant: string; label: string }> = {
      BankSucceeded: { variant: "success", label: "موفق" },
      Registered: { variant: "secondary", label: "ثبت شده" },
      WaitForExecution: { variant: "info", label: "در انتظار اجرا" },
      WaitForBank: { variant: "warning", label: "در انتظار بانک" },
      Failed: { variant: "destructive", label: "ناموفق" },
      BankFailed: { variant: "destructive", label: "رد شده توسط بانک" },
      Canceled: { variant: "secondary", label: "لغو شده" },
      Rejected: { variant: "destructive", label: "رد شده" },
    };
    return statusMap[status] || { variant: "secondary", label: status };
  };

  const getPaymentTypeDisplay = (paymentType: string) => {
    const typeMap: Record<string, { variant: string; label: string }> = {
      Paya: { variant: "info", label: "پایا" },
      Satna: { variant: "warning", label: "ساتنا" },
      Internal: { variant: "success", label: "درون بانکی" },
      Rtgs: { variant: "warning", label: "آنی (RTGS)" },
    };
    return typeMap[paymentType] || { variant: "secondary", label: paymentType };
  };

  if (isMobile) {
    // نمایش کارتی در موبایل
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {totalRecords > 0
                ? `${t("common.showing")} ${startIndex + 1}-${endIndex} ${t(
                    "common.of"
                  )} ${totalRecords}`
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
          ) : transactions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12">
              <SearchX className="h-12 w-12 text-muted-foreground/50" />
              <div className="space-y-1 text-center">
                <p className="font-medium text-muted-foreground">
                  تراکنشی یافت نشد
                </p>
                <p className="text-sm text-muted-foreground/70">
                  فیلترهای جستجو را تغییر دهید
                </p>
              </div>
            </div>
          ) : (
            transactions.map((tx) => (
              <Card key={tx.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium text-sm">
                      {tx.destinationAccountOwner}
                    </span>
                    <Badge
                      variant={getStatusDisplay(tx.status).variant as any}
                      className="text-xs"
                    >
                      {getStatusDisplay(tx.status).label}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("transactions.amount")}:
                      </span>
                      <span className="font-medium">
                        {formatAmount(tx.amount)}
                      </span>
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
                        variant={
                          getPaymentTypeDisplay(tx.paymentType).variant as any
                        }
                        className="text-xs"
                      >
                        {getPaymentTypeDisplay(tx.paymentType).label}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        {t("common.date")}:
                      </span>
                      <span className="text-xs">
                        {formatDateToPersian(tx.createdDateTime)}
                      </span>
                    </div>
                    {tx.transferDateTime && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          تاریخ انتقال:
                        </span>
                        <span className="text-xs">
                          {formatDateToPersian(tx.transferDateTime)}
                        </span>
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
              <TableHead>شماره درخواست</TableHead>
              <TableHead>
                <SortableHeader field="destinationAccountOwner">
                  نام ذینفع
                </SortableHeader>
              </TableHead>
              <TableHead>حساب مقصد</TableHead>
              <TableHead>بانک</TableHead>
              <TableHead>
                <SortableHeader field="amount">
                  {t("transactions.amount")}
                </SortableHeader>
              </TableHead>
              <TableHead>نوع پرداخت</TableHead>
              <TableHead>
                <SortableHeader field="createdDateTime">
                  تاریخ ثبت
                </SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="transferDateTime">
                  تاریخ انتقال
                </SortableHeader>
              </TableHead>
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
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
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
                <TableCell colSpan={10} className="text-center py-16">
                  <div className="flex flex-col items-center gap-3">
                    <SearchX className="h-12 w-12 text-muted-foreground/50" />
                    <div className="space-y-1">
                      <p className="font-medium text-muted-foreground">
                        تراکنشی یافت نشد
                      </p>
                      <p className="text-sm text-muted-foreground/70">
                        فیلترهای جستجو را تغییر دهید یا تاریخ دیگری انتخاب کنید
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((tx, index) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {tx.orderId}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {tx.destinationAccountOwner}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {tx.nationalCode || "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono text-xs">
                        {tx.destinationIban}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {tx.accountNumber}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{tx.bankName}</TableCell>
                  <TableCell className="font-medium">
                    {formatAmount(tx.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        getPaymentTypeDisplay(tx.paymentType).variant as any
                      }
                      className="text-xs"
                    >
                      {getPaymentTypeDisplay(tx.paymentType).label}
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
                      variant={getStatusDisplay(tx.status).variant as any}
                      className="text-xs"
                    >
                      {getStatusDisplay(tx.status).label}
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
              <span className="font-medium text-foreground">
                {startIndex + 1}
              </span>{" "}
              {t("common.pagination.to")}{" "}
              <span className="font-medium text-foreground">{endIndex}</span>{" "}
              {t("common.pagination.of")}{" "}
              <span className="font-medium text-foreground">
                {totalRecords}
              </span>
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
              <span className="sr-only">
                {t("common.pagination.firstPage")}
              </span>
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
