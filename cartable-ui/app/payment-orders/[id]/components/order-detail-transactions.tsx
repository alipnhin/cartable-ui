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
import { Badge } from "@/components/ui/badge";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import {
  Download,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TransactionDetailDialog } from "./transaction-detail-dialog";
import { BankLogo } from "@/components/common/bank-logo";
import { PaymentTypeIcon } from "@/components/common/payment-type-icon";
import { getBankCodeFromIban } from "@/lib/bank-logos";
import { MobilePagination } from "@/components/common/mobile-pagination";

interface OrderDetailTransactionsProps {
  transactions: Transaction[];
}

const ITEMS_PER_PAGE_MOBILE = 10;
const ITEMS_PER_PAGE_DESKTOP = 15;

type SortField = "ownerName" | "amount" | "status" | "paymentType";
type SortDirection = "asc" | "desc";

export function OrderDetailTransactions({
  transactions,
}: OrderDetailTransactionsProps) {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();

  // State
  const [statusFilter, setStatusFilter] = useState<TransactionStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<PaymentMethodEnum[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("ownerName");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter Options
  const statusOptions = [
    {
      value: TransactionStatus.BankSucceeded,
      label: t("status.succeeded"),
    },
    {
      value: TransactionStatus.WaitForExecution,
      label: t("status.pending"),
    },
    {
      value: TransactionStatus.WaitForBank,
      label: t("status.pending"),
    },
    {
      value: TransactionStatus.Failed,
      label: t("status.failed"),
    },
    {
      value: TransactionStatus.BankRejected,
      label: t("status.bankRejected"),
    },
  ];

  const typeOptions = [
    {
      value: PaymentMethodEnum.Internal,
      label: t("paymentType.internal"),
    },
    { value: PaymentMethodEnum.Paya, label: t("paymentType.paya") },
    { value: PaymentMethodEnum.Satna, label: t("paymentType.satna") },
  ];

  // Filter and Sort Logic
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.ownerName?.toLowerCase().includes(query) ||
          tx.destinationIban?.toLowerCase().includes(query) ||
          tx.trackingId?.toLowerCase().includes(query) ||
          tx.nationalCode?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((tx) => statusFilter.includes(tx.status));
    }

    // Apply type filter
    if (typeFilter.length > 0) {
      result = result.filter(
        (tx) => tx.paymentType && typeFilter.includes(tx.paymentType)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "ownerName":
          comparison = (a.ownerName || "").localeCompare(b.ownerName || "");
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
        case "paymentType":
          comparison = (a.paymentType || "").localeCompare(
            b.paymentType || ""
          );
          break;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [
    transactions,
    searchQuery,
    statusFilter,
    typeFilter,
    sortField,
    sortDirection,
  ]);

  // Pagination
  const itemsPerPage = isMobile
    ? ITEMS_PER_PAGE_MOBILE
    : ITEMS_PER_PAGE_DESKTOP;
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredAndSortedTransactions.slice(
    startIndex,
    endIndex
  );

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatusToggle = (status: TransactionStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
    setCurrentPage(1);
  };

  const handleTypeToggle = (type: PaymentMethodEnum) => {
    setTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setStatusFilter([]);
    setTypeFilter([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleExport = () => {
    console.log("Exporting transactions...");
  };

  const activeFiltersCount =
    statusFilter.length + typeFilter.length + (searchQuery ? 1 : 0);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5" />
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">
                {t("paymentOrders.transactionsList")}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredAndSortedTransactions.length} تراکنش
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {/* Search */}
              <input
                type="text"
                placeholder="جستجو..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="flex-1 sm:w-48 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FilterIcon className="h-4 w-4" />
                    {!isMobile && "فیلتر"}
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:max-w-md">
                  <SheetHeader>
                    <SheetTitle>فیلتر تراکنش‌ها</SheetTitle>
                  </SheetHeader>

                  <div className="space-y-6 py-6">
                    {/* Status Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        وضعیت تراکنش
                      </Label>
                      <div className="space-y-2">
                        {statusOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              id={`status-${option.value}`}
                              checked={statusFilter.includes(option.value)}
                              onCheckedChange={() =>
                                handleStatusToggle(option.value)
                              }
                            />
                            <Label
                              htmlFor={`status-${option.value}`}
                              className="cursor-pointer flex-1"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        نوع تراکنش
                      </Label>
                      <div className="space-y-2">
                        {typeOptions.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-center gap-3"
                          >
                            <Checkbox
                              id={`type-${option.value}`}
                              checked={typeFilter.includes(option.value)}
                              onCheckedChange={() =>
                                handleTypeToggle(option.value)
                              }
                            />
                            <Label
                              htmlFor={`type-${option.value}`}
                              className="cursor-pointer flex-1"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <SheetFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                      className="flex-1"
                    >
                      پاک کردن
                    </Button>
                    <SheetClose asChild>
                      <Button className="flex-1">اعمال</Button>
                    </SheetClose>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              {/* Export */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {!isMobile && "Excel"}
              </Button>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              {statusFilter.map((status) => {
                const option = statusOptions.find(
                  (opt) => opt.value === status
                );
                return (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => handleStatusToggle(status)}
                  >
                    {option?.label}
                    <X className="h-3 w-3" />
                  </Badge>
                );
              })}
              {typeFilter.map((type) => {
                const option = typeOptions.find((opt) => opt.value === type);
                return (
                  <Badge
                    key={type}
                    variant="secondary"
                    className="gap-1 cursor-pointer"
                    onClick={() => handleTypeToggle(type)}
                  >
                    {option?.label}
                    <X className="h-3 w-3" />
                  </Badge>
                );
              })}
            </div>
          )}
        </CardHeader>

        <CardContent>
          {isMobile ? (
            // Mobile Cards View
            <div className="space-y-3">
              {paginatedTransactions.map((transaction) => {
                const bankCode = getBankCodeFromIban(
                  transaction.destinationIban
                );
                return (
                  <Card
                    key={transaction.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {bankCode && (
                            <div className="flex-shrink-0">
                              <BankLogo bankCode={bankCode} size="xs" />
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

                      <div className="border-t" />

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

                      {transaction.trackingId && (
                        <>
                          <div className="border-t" />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              کد رهگیری:
                            </span>
                            <span className="font-mono font-medium">
                              {transaction.trackingId}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                );
              })}

              {filteredAndSortedTransactions.length > 0 && (
                <MobilePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          ) : (
            // Desktop Table
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort("ownerName")}
                      >
                        <div className="flex items-center gap-2">
                          نام و نام خانوادگی
                          <SortIcon field="ownerName" />
                        </div>
                      </TableHead>
                      <TableHead>شماره شبا</TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort("amount")}
                      >
                        <div className="flex items-center gap-2">
                          مبلغ
                          <SortIcon field="amount" />
                        </div>
                      </TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort("paymentType")}
                      >
                        <div className="flex items-center gap-2">
                          نوع
                          <SortIcon field="paymentType" />
                        </div>
                      </TableHead>
                      <TableHead>کد رهگیری</TableHead>
                      <TableHead
                        className="cursor-pointer select-none hover:bg-muted/50"
                        onClick={() => handleSort("status")}
                      >
                        <div className="flex items-center gap-2">
                          وضعیت
                          <SortIcon field="status" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center">عملیات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedTransactions.map((transaction, index) => {
                      const bankCode = getBankCodeFromIban(
                        transaction.destinationIban
                      );
                      return (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium text-muted-foreground">
                            {startIndex + index + 1}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {transaction.ownerName}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {bankCode && (
                                <BankLogo bankCode={bankCode} size="xs" />
                              )}
                              <span className="font-mono text-xs">
                                {transaction.destinationIban}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-bold text-primary">
                              {formatCurrency(transaction.amount, locale)}
                            </span>
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
                          <TableCell>
                            <span className="font-mono text-xs">
                              {transaction.trackingId || "-"}
                            </span>
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

              {/* Desktop Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    نمایش {startIndex + 1} تا{" "}
                    {Math.min(endIndex, filteredAndSortedTransactions.length)}{" "}
                    از {filteredAndSortedTransactions.length} تراکنش
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronRight className="h-4 w-4" />
                      قبلی
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                        )
                        .map((page, index, array) => (
                          <div key={page} className="flex items-center gap-1">
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 text-muted-foreground">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-1 text-sm rounded-md transition-all ${
                                currentPage === page
                                  ? "bg-primary text-primary-foreground font-semibold"
                                  : "text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {page}
                            </button>
                          </div>
                        ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="gap-1"
                    >
                      بعدی
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Empty State */}
          {filteredAndSortedTransactions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-2">
                {t("common.noResults")}
              </div>
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
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
