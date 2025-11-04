"use client";

import { useState, useMemo } from "react";
import {
  Transaction,
  TransactionStatus,
  PaymentType,
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
import { Download, Eye, ChevronDown } from "lucide-react";
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
    paymentType: [] as PaymentType[],
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

    // فیلتر جستجوی عمومی
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.beneficiaryName?.toLowerCase().includes(searchLower) ||
          tx.beneficiaryIban?.toLowerCase().includes(searchLower) ||
          tx.bankTrackingCode?.toLowerCase().includes(searchLower)
      );
    }

    // فیلتر نام ذینفع
    if (filters.beneficiaryName) {
      const nameLower = filters.beneficiaryName.toLowerCase();
      result = result.filter((tx) =>
        tx.beneficiaryName?.toLowerCase().includes(nameLower)
      );
    }

    // فیلتر شبا
    if (filters.iban) {
      const ibanLower = filters.iban.toLowerCase();
      result = result.filter((tx) =>
        tx.beneficiaryIban?.toLowerCase().includes(ibanLower)
      );
    }

    // فیلتر کد رهگیری
    if (filters.trackingCode) {
      const trackingLower = filters.trackingCode.toLowerCase();
      result = result.filter((tx) =>
        tx.bankTrackingCode?.toLowerCase().includes(trackingLower)
      );
    }

    // فیلتر وضعیت
    if (filters.status.length > 0) {
      result = result.filter((tx) => filters.status.includes(tx.status));
    }

    // فیلتر نوع تراکنش
    if (filters.paymentType.length > 0) {
      result = result.filter((tx) =>
        filters.paymentType.includes(tx.paymentType)
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
    // Export logic
    console.log("Exporting transactions...");
  };

  const paymentTypeLabels: Record<PaymentType, string> = {
    Internal: "داخلی",
    Paya: "پایا",
    Satna: "ساتنا",
    CardToCard: "کارت به کارت",
    Unknown: "نامشخص",
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
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 me-2" />
                {!isMobile && "خروجی"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
            // نمایش کارتی در موبایل
            <div className="space-y-3">
              {paginatedTransactions.map((transaction, index) => {
                const bankCode = getBankCodeFromIban(
                  transaction.beneficiaryIban
                );
                return (
                  <Card
                    key={transaction.id}
                    className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {bankCode && (
                            <BankLogo bankCode={bankCode} size="sm" />
                          )}
                          <span className="text-sm font-medium">
                            {transaction.beneficiaryName}
                          </span>
                        </div>
                        <TransactionStatusBadge
                          status={transaction.status}
                          size="sm"
                        />
                      </div>

                      <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">مبلغ:</span>
                          <span className="font-bold text-primary">
                            {formatCurrency(transaction.amount, locale)} ریال
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">نوع:</span>
                          <PaymentTypeIcon
                            type={transaction.paymentType}
                            showLabel
                          />
                        </div>

                        {transaction.bankTrackingCode && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              کد رهگیری:
                            </span>
                            <span className="font-mono text-xs">
                              {transaction.bankTrackingCode}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}

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
                      <TableHead>بانک</TableHead>
                      <TableHead>نام ذینفع</TableHead>
                      <TableHead>شماره شبا</TableHead>
                      <TableHead>مبلغ</TableHead>
                      <TableHead>نوع</TableHead>
                      <TableHead>کد رهگیری</TableHead>
                      <TableHead>وضعیت</TableHead>
                      <TableHead className="text-center">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction, index) => {
                      const bankCode = getBankCodeFromIban(
                        transaction.beneficiaryIban
                      );
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            {bankCode && (
                              <BankLogo bankCode={bankCode} size="sm" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">
                            {transaction.beneficiaryName}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.beneficiaryIban}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(transaction.amount, locale)}
                          </TableCell>
                          <TableCell>
                            <PaymentTypeIcon type={transaction.paymentType} />
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {transaction.bankTrackingCode || "-"}
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
            <div className="text-center py-8 text-muted-foreground">
              {t("common.noResults")}
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
