"use client";

import { useState, useMemo } from "react";
import {
  Transaction,
  TransactionStatus,
  PaymentMethodEnum,
} from "@/types/transaction";
import { Card, CardContent } from "@/components/ui/card";
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
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TransactionDetailDialog } from "./transaction-detail-dialog";
import { BankLogo } from "@/components/common/bank-logo";
import { PaymentTypeIcon } from "@/components/common/payment-type-icon";
import { getBankCodeFromIban } from "@/lib/bank-logos";
import { MobilePagination } from "@/components/common/mobile-pagination";
import "@/styles/global-v2.css";

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

  // Filter Options
  const statusOptions = [
    {
      value: TransactionStatus.BankSucceeded,
      label: t("status.succeeded"),
      color: "success",
    },
    {
      value: TransactionStatus.WaitForExecution,
      label: t("status.pending"),
      color: "warning",
    },
    {
      value: TransactionStatus.WaitForBank,
      label: t("status.pending"),
      color: "info",
    },
    {
      value: TransactionStatus.Failed,
      label: t("status.failed"),
      color: "danger",
    },
    {
      value: TransactionStatus.BankRejected,
      label: t("status.bankRejected"),
      color: "danger",
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
      <div className="space-y-4 premium-animate-fade-in">
        {/* Header & Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="premium-heading-2">
              {t("paymentOrders.transactionsList")}
            </h2>
            <p className="premium-body-sm mt-1">
              {filteredAndSortedTransactions.length} {t("reports.transactions")}
            </p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="جستجو در نام، شبا، کد رهگیری..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="flex-1 sm:w-64 px-4 py-2 text-sm border border-[var(--premium-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--premium-primary)] bg-[var(--premium-surface-1)]"
            />
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

        {/* Premium Filters */}
        <div className="premium-filter-group">
          <div className="flex flex-wrap items-center gap-3">
            <span className="premium-caption">فیلتر براساس:</span>

            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleStatusToggle(option.value)}
                  className={`premium-filter-chip ${
                    statusFilter.includes(option.value) ? "active" : ""
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      option.color === "success"
                        ? "bg-[var(--premium-success)]"
                        : option.color === "warning"
                          ? "bg-[var(--premium-warning)]"
                          : option.color === "danger"
                            ? "bg-[var(--premium-danger)]"
                            : "bg-[var(--premium-info)]"
                    }`}
                  />
                  {option.label}
                </button>
              ))}
            </div>

            <div className="premium-divider-vertical h-6" />

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTypeToggle(option.value)}
                  className={`premium-filter-chip ${
                    typeFilter.includes(option.value) ? "active" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {activeFiltersCount > 0 && (
              <>
                <div className="premium-divider-vertical h-6" />
                <button
                  onClick={handleResetFilters}
                  className="text-sm text-[var(--premium-slate-600)] hover:text-[var(--premium-danger)] transition-colors flex items-center gap-1"
                >
                  <X className="h-3.5 w-3.5" />
                  پاک کردن همه
                </button>
              </>
            )}
          </div>
        </div>

        {/* Table or Cards */}
        {isMobile ? (
          // Mobile Cards View
          <div className="space-y-3">
            {paginatedTransactions.map((transaction) => {
              const bankCode = getBankCodeFromIban(transaction.destinationIban);
              return (
                <Card
                  key={transaction.id}
                  className="premium-card cursor-pointer"
                  onClick={() => handleViewDetails(transaction)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
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

                      <div className="premium-divider" />

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-muted-foreground text-xs mb-1">
                            مبلغ:
                          </div>
                          <div className="font-bold text-[var(--premium-primary)]">
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
                          <div className="premium-divider" />
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
                  </CardContent>
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
          // Desktop Premium Table
          <div className="premium-table-container premium-scrollbar">
            <table className="premium-table">
              <thead>
                <tr>
                  <th className="w-12">#</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("ownerName")}
                  >
                    <div className="flex items-center gap-2">
                      نام و نام خانوادگی
                      <SortIcon field="ownerName" />
                    </div>
                  </th>
                  <th>شماره شبا</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("amount")}
                  >
                    <div className="flex items-center gap-2">
                      مبلغ
                      <SortIcon field="amount" />
                    </div>
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("paymentType")}
                  >
                    <div className="flex items-center gap-2">
                      نوع
                      <SortIcon field="paymentType" />
                    </div>
                  </th>
                  <th>کد رهگیری</th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center gap-2">
                      وضعیت
                      <SortIcon field="status" />
                    </div>
                  </th>
                  <th className="text-center">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction, index) => {
                  const bankCode = getBankCodeFromIban(
                    transaction.destinationIban
                  );
                  return (
                    <tr key={transaction.id}>
                      <td className="font-medium text-[var(--premium-slate-500)]">
                        {startIndex + index + 1}
                      </td>
                      <td className="font-semibold">
                        {transaction.ownerName}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          {bankCode && (
                            <BankLogo bankCode={bankCode} size="xs" />
                          )}
                          <span className="font-mono text-xs">
                            {transaction.destinationIban}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="font-bold text-[var(--premium-primary)]">
                          {formatCurrency(transaction.amount, locale)}
                        </span>
                      </td>
                      <td>
                        <PaymentTypeIcon
                          type={
                            transaction.paymentType ||
                            PaymentMethodEnum.Unknown
                          }
                          showLabel
                        />
                      </td>
                      <td>
                        <span className="font-mono text-xs">
                          {transaction.trackingId || "-"}
                        </span>
                      </td>
                      <td>
                        <TransactionStatusBadge
                          status={transaction.status}
                          size="sm"
                        />
                      </td>
                      <td className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(transaction)}
                          className="h-8 w-8 p-0 hover:bg-[var(--premium-surface-2)]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Desktop Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-[var(--premium-border-light)] bg-[var(--premium-surface-2)]">
                <div className="text-sm text-[var(--premium-slate-600)]">
                  نمایش {startIndex + 1} تا{" "}
                  {Math.min(endIndex, filteredAndSortedTransactions.length)} از{" "}
                  {filteredAndSortedTransactions.length} تراکنش
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
                        <>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span
                              key={`ellipsis-${page}`}
                              className="px-2 text-[var(--premium-slate-400)]"
                            >
                              ...
                            </span>
                          )}
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 text-sm rounded-md transition-all ${
                              currentPage === page
                                ? "bg-[var(--premium-primary)] text-white font-semibold"
                                : "text-[var(--premium-slate-600)] hover:bg-[var(--premium-surface-3)]"
                            }`}
                          >
                            {page}
                          </button>
                        </>
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
          </div>
        )}

        {/* Empty State */}
        {filteredAndSortedTransactions.length === 0 && (
          <div className="premium-card-flat">
            <CardContent className="py-12 text-center">
              <div className="text-[var(--premium-slate-400)] mb-2">
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
            </CardContent>
          </div>
        )}
      </div>

      <TransactionDetailDialog
        transaction={selectedTransaction}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
