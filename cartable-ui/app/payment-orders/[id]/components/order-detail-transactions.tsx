"use client";

import { useState, useMemo } from "react";
import {
  Transaction,
  TransactionStatus,
  PaymentMethodEnum,
} from "@/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { Download, Eye, ChevronDown, Filter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransactionsFilter } from "./transactions-filter";
import { TransactionDetailDialog } from "./transaction-detail-dialog";
import { BankLogo } from "@/components/common/bank-logo";
import { PaymentTypeIcon } from "@/components/common/payment-type-icon";
import { getBankCodeFromIban } from "@/lib/bank-logos";

interface OrderDetailTransactionsProps {
  transactions: Transaction[];
}

const ITEMS_PER_PAGE_MOBILE = 10;
const ITEMS_PER_PAGE_DESKTOP = 25;

export function OrderDetailTransactions({
  transactions,
}: OrderDetailTransactionsProps) {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();

  const [filters, setFilters] = useState({
    status: [] as TransactionStatus[],
    paymentType: [] as PaymentMethodEnum[],
    search: "",
    beneficiaryName: "",
    iban: "",
    trackingCode: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // فیلتر تراکنش‌ها
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.ownerName?.toLowerCase().includes(searchLower) ||
          tx.destinationIban?.toLowerCase().includes(searchLower) ||
          tx.trackingId?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.beneficiaryName) {
      const nameLower = filters.beneficiaryName.toLowerCase();
      result = result.filter((tx) =>
        tx.ownerName?.toLowerCase().includes(nameLower)
      );
    }

    if (filters.iban) {
      const ibanLower = filters.iban.toLowerCase();
      result = result.filter((tx) =>
        tx.destinationIban?.toLowerCase().includes(ibanLower)
      );
    }

    if (filters.trackingCode) {
      const trackingLower = filters.trackingCode.toLowerCase();
      result = result.filter((tx) =>
        tx.trackingId?.toLowerCase().includes(trackingLower)
      );
    }

    if (filters.status.length > 0) {
      result = result.filter((tx) => filters.status.includes(tx.status));
    }

    if (filters.paymentType.length > 0) {
      result = result.filter(
        (tx) => tx.paymentType && filters.paymentType.includes(tx.paymentType)
      );
    }

    return result;
  }, [transactions, filters]);

  // صفحه‌بندی
  const itemsPerPage = isMobile
    ? ITEMS_PER_PAGE_MOBILE
    : ITEMS_PER_PAGE_DESKTOP;
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    0,
    currentPage * itemsPerPage
  );
  const hasMore = currentPage < totalPages;
  const remainingCount =
    filteredTransactions.length - paginatedTransactions.length;

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleResetFilters = () => {
    setFilters({
      status: [],
      paymentType: [],
      search: "",
      beneficiaryName: "",
      iban: "",
      trackingCode: "",
    });
    setCurrentPage(1);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleExport = () => {
    console.log("Exporting transactions...");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-lg">
              {t("paymentOrders.transactionsList")} (
              {filteredTransactions.length})
            </CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <TransactionsFilter
                filters={filters}
                onFiltersChange={(newFilters) => {
                  setFilters(newFilters);
                  setCurrentPage(1);
                }}
                onReset={handleResetFilters}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {!isMobile && "خروجی Excel"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // نمایش کارتی در موبایل - براساس طراحی اصلی
            <div className="space-y-3">
              {paginatedTransactions.map((transaction) => {
                const bankCode = getBankCodeFromIban(
                  transaction.destinationIban
                );
                return (
                  <Card
                    key={transaction.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer border"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <div className="space-y-3">
                      {/* ردیف اول: لوگو، نام و وضعیت */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {bankCode && (
                            <div className="flex-shrink-0">
                              <BankLogo bankCode={bankCode} size="sm" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">
                              {transaction.ownerName}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono truncate">
                              {transaction.destinationIban}
                            </div>
                          </div>
                        </div>
                        <TransactionStatusBadge
                          status={transaction.status}
                          size="sm"
                        />
                      </div>

                      {/* جداکننده */}
                      <div className="border-t"></div>

                      {/* ردیف دوم: جزئیات */}
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            مبلغ:
                          </div>
                          <div className="font-bold text-primary">
                            {formatCurrency(transaction.amount, locale)}
                          </div>
                        </div>

                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            نوع:
                          </div>
                          <PaymentTypeIcon
                            type={
                              transaction.paymentType ||
                              PaymentMethodEnum.Unknown
                            }
                            showLabel
                          />
                        </div>
                      </div>

                      {/* ردیف سوم: کد رهگیری */}
                      {transaction.trackingId && (
                        <div className="pt-2 border-t">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              کد رهگیری:
                            </span>
                            <span className="font-mono font-medium">
                              {transaction.trackingId}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}

              {/* دکمه نمایش بیشتر */}
              {hasMore && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleLoadMore}
                >
                  <ChevronDown className="h-4 w-4 me-2" />
                  نمایش بیشتر ({remainingCount} مورد باقیمانده)
                </Button>
              )}
            </div>
          ) : (
            // نمایش جدولی در دسکتاپ
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>نام و نام خانوادگی</TableHead>
                      <TableHead>کد ملی</TableHead>
                      <TableHead>شماره شبا</TableHead>
                      <TableHead>مبلغ تراکنش</TableHead>
                      <TableHead>علت تراکنش</TableHead>
                      <TableHead>نوع تراکنش</TableHead>
                      <TableHead>کد رهگیری بانک</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="text-center">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction, index) => {
                      const bankCode = getBankCodeFromIban(
                        transaction.destinationIban
                      );
                      return (
                        <TableRow
                          key={transaction.id}
                          className="hover:bg-muted/50"
                        >
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.ownerName}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.nationalCode || "-"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                                {bankCode && (
                                  <BankLogo bankCode={bankCode} size="sm" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-mono text-xs">
                                  {transaction.destinationIban}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {transaction.accountNumber}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {formatCurrency(transaction.amount, locale)}
                              <span className="text-xs text-muted-foreground ms-1"></span>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs">
                            {t(
                              `transactions.transactionReasons.${
                                transaction.reasonCode || "unknown"
                              }`
                            )}
                          </TableCell>
                          <TableCell>
                            <PaymentTypeIcon
                              type={
                                transaction.paymentType ||
                                PaymentMethodEnum.Unknown
                              }
                              showLabel
                            />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.trackingId || "-"}
                          </TableCell>
                          <TableCell>
                            <TransactionStatusBadge
                              status={transaction.status}
                              size="sm"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(transaction)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {hasMore && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={handleLoadMore}>
                    <ChevronDown className="h-4 w-4 me-2" />
                    نمایش بیشتر ({remainingCount} مورد باقیمانده)
                  </Button>
                </div>
              )}
            </>
          )}

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">
                {t("common.noResults")}
              </div>
              {Object.values(filters).some((v) =>
                Array.isArray(v) ? v.length > 0 : v
              ) && (
                <Button
                  variant="secondary"
                  onClick={handleResetFilters}
                  size="sm"
                >
                  پاک کردن فیلترها
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionDetailDialog
        transaction={selectedTransaction}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
