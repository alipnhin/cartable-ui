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
  Search,
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
          comparison = (a.paymentType || "").localeCompare(b.paymentType || "");
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
      <Card className="shadow-sm overflow-hidden">
        {/* Card Content */}
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b bg-muted/20">
            {/* Title & Count */}
            <div className="flex items-baseline gap-3">
              <CardTitle className="text-xl">
                {t("paymentOrders.transactionsList")}
              </CardTitle>
              <span className="text-sm text-muted-foreground">
                {filteredAndSortedTransactions.length} تراکنش
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full sm:w-auto ms-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="جستجو در تراکنش‌ها..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pr-10 pl-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                />
              </div>

              {/* Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 relative">
                    <FilterIcon className="h-4 w-4" />
                    {!isMobile && "فیلتر"}
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                        {activeFiltersCount}
                      </span>
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
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              {statusFilter.map((status) => {
                const option = statusOptions.find(
                  (opt) => opt.value === status
                );
                return (
                  <Badge
                    key={status}
                    variant="secondary"
                    className="gap-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
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
                    className="gap-1.5 cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => handleTypeToggle(type)}
                  >
                    {option?.label}
                    <X className="h-3 w-3" />
                  </Badge>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 text-xs"
              >
                پاک کردن همه
              </Button>
            </div>
          )}

          {isMobile ? (
            // Mobile Cards View
            <div className="p-4 space-y-3">
              {paginatedTransactions.map((transaction) => {
                const bankCode = getBankCodeFromIban(
                  transaction.destinationIban
                );
                return (
                  <div
                    key={transaction.id}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleViewDetails(transaction)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {bankCode && (
                            <div className="flex-shrink-0">
                              <BankLogo bankCode={bankCode} size="sm" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {transaction.ownerName}
                            </div>
                            <div className="text-xs text-muted-foreground font-mono truncate mt-1">
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

                      <div className="grid grid-cols-2 gap-4">
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
                  </div>
                );
              })}

              {paginatedTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-3">
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
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12">#</TableHead>
                    <TableHead
                      className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("ownerName")}
                    >
                      <div className="flex items-center gap-2">
                        نام و نام خانوادگی
                        <SortIcon field="ownerName" />
                      </div>
                    </TableHead>
                    <TableHead>شماره شبا</TableHead>
                    <TableHead
                      className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("amount")}
                    >
                      <div className="flex items-center gap-2">
                        مبلغ
                        <SortIcon field="amount" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("paymentType")}
                    >
                      <div className="flex items-center gap-2">
                        نوع
                        <SortIcon field="paymentType" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center gap-2">
                        وضعیت
                        <SortIcon field="status" />
                      </div>
                    </TableHead>
                    <TableHead className="w-16 text-left">عملیات</TableHead>
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
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-muted-foreground text-sm">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {transaction.ownerName}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {bankCode && (
                              <BankLogo bankCode={bankCode} size="xs" />
                            )}
                            <span className="font-mono text-xs text-muted-foreground">
                              {transaction.destinationIban}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold">
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
                          <TransactionStatusBadge
                            status={transaction.status}
                            size="sm"
                          />
                        </TableCell>
                        <TableCell className="text-left">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(transaction)}
                            className="h-8 w-8 p-0 hover:bg-primary/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {paginatedTransactions.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-muted-foreground mb-3">
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

              {/* Desktop Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t bg-muted/20">
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
                              className={`min-w-[32px] h-8 px-3 text-sm rounded-md transition-all font-medium ${
                                currentPage === page
                                  ? "bg-primary text-primary-foreground shadow-sm"
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
