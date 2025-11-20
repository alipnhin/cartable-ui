"use client";

import { useState } from "react";
import {
  WithdrawalTransaction,
  TransactionStatusApiEnum,
  PaymentTypeApiEnum,
  ReasonCodeApiEnum,
  TransactionFilterParams,
} from "@/types/api";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
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
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import {
  Eye,
  ChevronLeft,
  ChevronRight,
  Filter as FilterIcon,
  X,
  Search,
  RefreshCw,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  User,
  CreditCard,
  Hash,
  Wallet,
  FileText,
  Download,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { TransactionDetailDialog } from "./transaction-detail-dialog";
import { BankLogo } from "@/components/common/bank-logo";
import { getBankCodeFromIban } from "@/lib/bank-logos";
import { MobilePagination } from "@/components/common/mobile-pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface OrderDetailTransactionsProps {
  transactions: WithdrawalTransaction[];
  isLoading: boolean;
  pageNumber: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void | Promise<void>;
  onFilterChange: (filters: Partial<TransactionFilterParams>) => void | Promise<void>;
  onInquiryTransaction: (transactionId: string) => void | Promise<void>;
  onExport?: () => void | Promise<void>;
}

type SortField = "amount" | "destinationAccountOwner" | "nationalCode";

export function OrderDetailTransactions({
  transactions,
  isLoading,
  pageNumber,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onRefresh,
  onFilterChange,
  onInquiryTransaction,
  onExport,
}: OrderDetailTransactionsProps) {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();

  // Helper functions with i18n
  const getPaymentTypeLabel = (type: PaymentTypeApiEnum) => {
    switch (type) {
      case PaymentTypeApiEnum.Paya:
        return t("transactions.paymentTypes.paya");
      case PaymentTypeApiEnum.Satna:
        return t("transactions.paymentTypes.satna");
      case PaymentTypeApiEnum.Rtgs:
        return t("transactions.paymentTypes.rtgs");
      default:
        return type;
    }
  };

  const getReasonCodeLabel = (code: ReasonCodeApiEnum) => {
    switch (code) {
      case ReasonCodeApiEnum.InvestmentAndBourse:
        return t("transactions.reasonCodes.investmentAndBourse");
      case ReasonCodeApiEnum.ImportGoods:
        return t("transactions.reasonCodes.importGoods");
      case ReasonCodeApiEnum.SalaryAndWages:
        return t("transactions.reasonCodes.salaryAndWages");
      case ReasonCodeApiEnum.TaxAndDuties:
        return t("transactions.reasonCodes.taxAndDuties");
      case ReasonCodeApiEnum.LoanRepayment:
        return t("transactions.reasonCodes.loanRepayment");
      case ReasonCodeApiEnum.OtherPayments:
        return t("transactions.reasonCodes.otherPayments");
      default:
        return code;
    }
  };

  // Local filter state
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatusApiEnum | "all">("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<PaymentTypeApiEnum | "all">("all");
  const [reasonCodeFilter, setReasonCodeFilter] = useState<ReasonCodeApiEnum | "all">("all");
  const [sortField, setSortField] = useState<SortField | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Dialog state
  const [selectedTransaction, setSelectedTransaction] = useState<WithdrawalTransaction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSort = (field: SortField) => {
    let newDirection: "asc" | "desc" = "asc";

    if (sortField === field) {
      newDirection = sortDirection === "asc" ? "desc" : "asc";
    }

    setSortField(field);
    setSortDirection(newDirection);

    // ارسال درخواست سورت به سرور
    const orderBy = `${field} ${newDirection}`;
    applyFilters({ orderBy });
  };

  const applyFilters = (extraFilters?: Partial<TransactionFilterParams>) => {
    const filters: Partial<TransactionFilterParams> = { ...extraFilters };

    if (searchValue) filters.serchValue = searchValue;
    if (statusFilter && statusFilter !== "all") filters.status = statusFilter;
    if (paymentTypeFilter && paymentTypeFilter !== "all") filters.paymentType = paymentTypeFilter;
    if (reasonCodeFilter && reasonCodeFilter !== "all") filters.reasonCode = reasonCodeFilter;

    onFilterChange(filters);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setStatusFilter("all");
    setPaymentTypeFilter("all");
    setReasonCodeFilter("all");
    setSortField("");
    setSortDirection("asc");
    onFilterChange({});
    setIsFilterOpen(false);
  };

  const handleViewDetails = (transaction: WithdrawalTransaction) => {
    setSelectedTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleInquiry = async (transaction: WithdrawalTransaction) => {
    await onInquiryTransaction(transaction.id);
  };

  const activeFiltersCount =
    (searchValue ? 1 : 0) +
    (statusFilter && statusFilter !== "all" ? 1 : 0) +
    (paymentTypeFilter && paymentTypeFilter !== "all" ? 1 : 0) +
    (reasonCodeFilter && reasonCodeFilter !== "all" ? 1 : 0);

  const startIndex = (pageNumber - 1) * pageSize;

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
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b bg-muted/20">
            {/* Title & Count */}
            <div className="flex items-baseline gap-3">
              <CardTitle className="text-xl">{t("transactions.listTitle")}</CardTitle>
              <span className="text-sm text-muted-foreground">
                {totalItems} {t("transactions.transactionCount")}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full sm:w-auto ms-auto">
              {/* Export Button */}
              {onExport && (
                <Button
                  variant="outline"
                  onClick={onExport}
                  className="gap-2 h-9"
                >
                  <Download className="h-4 w-4" />
                  {!isMobile && t("transactions.export")}
                </Button>
              )}

              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={onRefresh}
                disabled={isLoading}
                className="gap-2 h-9"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                {!isMobile && t("transactions.refresh")}
              </Button>

              {/* Filter Button - Only on mobile */}
              {isMobile && (
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="gap-2 relative h-9">
                      <FilterIcon className="h-4 w-4" />
                      {activeFiltersCount > 0 && (
                        <span className="absolute -top-1 -left-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-medium">
                          {activeFiltersCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>{t("transactions.filterTitle")}</SheetTitle>
                    </SheetHeader>

                    <div className="space-y-6 py-6">
                      {/* Search */}
                      <div className="space-y-2">
                        <Label>{t("transactions.search")}</Label>
                        <div className="relative">
                          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={t("transactions.searchPlaceholder")}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            className="pr-10 h-10"
                          />
                        </div>
                      </div>

                      {/* Status Filter */}
                      <div className="space-y-2">
                        <Label>{t("transactions.transactionStatus")}</Label>
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={t("transactions.allStatuses")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t("transactions.allStatuses")}</SelectItem>
                            <SelectItem value={TransactionStatusApiEnum.BankSucceeded}>
                              {t("transactions.statusLabels.bankSucceeded")}
                            </SelectItem>
                            <SelectItem value={TransactionStatusApiEnum.BankFailed}>
                              {t("transactions.statusLabels.bankFailed")}
                            </SelectItem>
                            <SelectItem value={TransactionStatusApiEnum.WaitForBank}>
                              {t("transactions.statusLabels.waitForBank")}
                            </SelectItem>
                            <SelectItem value={TransactionStatusApiEnum.WaitForExecution}>
                              {t("transactions.statusLabels.waitForExecution")}
                            </SelectItem>
                            <SelectItem value={TransactionStatusApiEnum.Draft}>
                              {t("transactions.statusLabels.draft")}
                            </SelectItem>
                            <SelectItem value={TransactionStatusApiEnum.Canceled}>
                              {t("transactions.statusLabels.canceled")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Payment Type Filter */}
                      <div className="space-y-2">
                        <Label>{t("transactions.paymentTypeLabel")}</Label>
                        <Select value={paymentTypeFilter} onValueChange={(v) => setPaymentTypeFilter(v as any)}>
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder={t("transactions.allTypes")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">{t("transactions.allTypes")}</SelectItem>
                            <SelectItem value={PaymentTypeApiEnum.Paya}>{t("transactions.paymentTypes.paya")}</SelectItem>
                          <SelectItem value={PaymentTypeApiEnum.Satna}>{t("transactions.paymentTypes.satna")}</SelectItem>
                          <SelectItem value={PaymentTypeApiEnum.Rtgs}>{t("transactions.paymentTypes.rtgs")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reason Code Filter */}
                    <div className="space-y-2">
                      <Label>{t("transactions.reasonCode")}</Label>
                      <Select value={reasonCodeFilter} onValueChange={(v) => setReasonCodeFilter(v as any)}>
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder={t("transactions.allReasonCodes")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{t("transactions.allReasonCodes")}</SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.InvestmentAndBourse}>
                            {t("transactions.reasonCodes.investmentAndBourse")}
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.ImportGoods}>
                            {t("transactions.reasonCodes.importGoods")}
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.SalaryAndWages}>
                            {t("transactions.reasonCodes.salaryAndWages")}
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.TaxAndDuties}>
                            {t("transactions.reasonCodes.taxAndDuties")}
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.LoanRepayment}>
                            {t("transactions.reasonCodes.loanRepayment")}
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.OtherPayments}>
                            {t("transactions.reasonCodes.otherPayments")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <SheetFooter className="gap-2">
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                      className="flex-1 h-10"
                    >
                      {t("transactions.clearFilters")}
                    </Button>
                    <Button onClick={handleApplyFilters} className="flex-1 h-10">
                      {t("transactions.applyFilters")}
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
              )}
            </div>
          </div>

          {/* Desktop Inline Filters */}
          {!isMobile && (
            <div className="flex flex-wrap items-center gap-3 p-4 border-b bg-muted/20">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-[300px]">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("transactions.searchPlaceholder")}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pr-10 h-9"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); applyFilters(); }}>
                <SelectTrigger className="w-[160px] h-9">
                  <SelectValue placeholder={t("transactions.allStatuses")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("transactions.allStatuses")}</SelectItem>
                  <SelectItem value={TransactionStatusApiEnum.BankSucceeded}>
                    {t("transactions.statusLabels.bankSucceeded")}
                  </SelectItem>
                  <SelectItem value={TransactionStatusApiEnum.BankFailed}>
                    {t("transactions.statusLabels.bankFailed")}
                  </SelectItem>
                  <SelectItem value={TransactionStatusApiEnum.WaitForBank}>
                    {t("transactions.statusLabels.waitForBank")}
                  </SelectItem>
                  <SelectItem value={TransactionStatusApiEnum.WaitForExecution}>
                    {t("transactions.statusLabels.waitForExecution")}
                  </SelectItem>
                  <SelectItem value={TransactionStatusApiEnum.Canceled}>
                    {t("transactions.statusLabels.canceled")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Type Filter */}
              <Select value={paymentTypeFilter} onValueChange={(v) => { setPaymentTypeFilter(v as any); applyFilters(); }}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder={t("transactions.allTypes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("transactions.allTypes")}</SelectItem>
                  <SelectItem value={PaymentTypeApiEnum.Paya}>{t("transactions.paymentTypes.paya")}</SelectItem>
                  <SelectItem value={PaymentTypeApiEnum.Satna}>{t("transactions.paymentTypes.satna")}</SelectItem>
                  <SelectItem value={PaymentTypeApiEnum.Rtgs}>{t("transactions.paymentTypes.rtgs")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Reason Code Filter */}
              <Select value={reasonCodeFilter} onValueChange={(v) => { setReasonCodeFilter(v as any); applyFilters(); }}>
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder={t("transactions.allReasonCodes")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("transactions.allReasonCodes")}</SelectItem>
                  <SelectItem value={ReasonCodeApiEnum.InvestmentAndBourse}>
                    {t("transactions.reasonCodes.investmentAndBourse")}
                  </SelectItem>
                  <SelectItem value={ReasonCodeApiEnum.SalaryAndWages}>
                    {t("transactions.reasonCodes.salaryAndWages")}
                  </SelectItem>
                  <SelectItem value={ReasonCodeApiEnum.TaxAndDuties}>
                    {t("transactions.reasonCodes.taxAndDuties")}
                  </SelectItem>
                  <SelectItem value={ReasonCodeApiEnum.LoanRepayment}>
                    {t("transactions.reasonCodes.loanRepayment")}
                  </SelectItem>
                  <SelectItem value={ReasonCodeApiEnum.OtherPayments}>
                    {t("transactions.reasonCodes.otherPayments")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Apply and Reset Buttons */}
              <div className="flex gap-2 ms-auto">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleResetFilters}
                    className="h-9 text-xs"
                  >
                    {t("transactions.clearFilters")}
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={handleApplyFilters}
                  className="h-9"
                >
                  {t("transactions.applyFilters")}
                </Button>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 p-4 border-b bg-muted/10">
              {searchValue && (
                <Badge variant="secondary" className="gap-1.5">
                  {t("transactions.searchLabel")} {searchValue}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSearchValue("");
                      handleApplyFilters();
                    }}
                  />
                </Badge>
              )}
              {statusFilter && statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1.5">
                  {t(`transactions.statusLabels.${statusFilter.charAt(0).toLowerCase() + statusFilter.slice(1)}`)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setStatusFilter("all");
                      handleApplyFilters();
                    }}
                  />
                </Badge>
              )}
              {paymentTypeFilter && paymentTypeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1.5">
                  {getPaymentTypeLabel(paymentTypeFilter)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setPaymentTypeFilter("all");
                      handleApplyFilters();
                    }}
                  />
                </Badge>
              )}
              {reasonCodeFilter && reasonCodeFilter !== "all" && (
                <Badge variant="secondary" className="gap-1.5">
                  {getReasonCodeLabel(reasonCodeFilter)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setReasonCodeFilter("all");
                      handleApplyFilters();
                    }}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-7 text-xs"
              >
                {t("transactions.clearAll")}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Content */}
          {!isLoading && (
            <>
              {isMobile ? (
                // Mobile Cards View
                <div className="p-4 space-y-4">
                  {transactions.map((transaction, index) => {
                    const bankCode = getBankCodeFromIban(transaction.destinationIban);
                    const canInquiry = transaction.status === TransactionStatusApiEnum.WaitForBank ||
                                      transaction.status === TransactionStatusApiEnum.WaitForExecution;

                    return (
                      <Card
                        key={transaction.id}
                        className="overflow-hidden"
                      >
                        {/* هدر با مبلغ برجسته */}
                        <div className="bg-muted/50 p-4 border-b">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {bankCode && <BankLogo bankCode={bankCode} size="sm" />}
                              <span className="text-sm text-muted-foreground">
                                #{startIndex + index + 1}
                              </span>
                            </div>
                            <TransactionStatusBadge status={transaction.status} size="sm" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-foreground">
                              {formatCurrency(parseFloat(transaction.amount), locale)}
                            </div>
                            <div className="text-xs text-muted-foreground">{t("transactions.rial")}</div>
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-3">
                          {/* نام ذینفع */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("transactions.beneficiaryName")}</span>
                            <span className="text-sm font-bold text-foreground truncate max-w-[60%] text-left">
                              {transaction.destinationAccountOwner}
                            </span>
                          </div>

                          {/* کد ملی */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("transactions.nationalCodeLabel")}</span>
                            <span className="text-sm font-mono font-medium text-foreground">
                              {transaction.nationalCode}
                            </span>
                          </div>

                          {/* شماره شبا */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("transactions.ibanLabel")}</span>
                            <span className="text-xs font-mono text-foreground truncate max-w-[55%]">
                              {transaction.destinationIban}
                            </span>
                          </div>

                          {/* نوع پرداخت */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("transactions.typeLabel")}</span>
                            <span className="text-sm font-medium text-foreground">
                              {getPaymentTypeLabel(transaction.paymentType)}
                            </span>
                          </div>

                          {/* کد علت */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{t("transactions.reasonLabel")}</span>
                            <span className="text-sm text-foreground truncate max-w-[50%] text-left">
                              {getReasonCodeLabel(transaction.reasonCode)}
                            </span>
                          </div>

                          {/* کد رهگیری */}
                          {transaction.trackingId && (
                            <div className="flex items-center justify-between pt-2 border-t">
                              <span className="text-sm text-muted-foreground">{t("transactions.trackingIdLabel")}</span>
                              <span className="text-sm font-mono font-bold text-foreground">
                                {transaction.trackingId}
                              </span>
                            </div>
                          )}

                          {/* دکمه‌های عملیات */}
                          <div className="pt-3 flex gap-2 border-t">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(transaction)}
                              className="flex-1 gap-2 h-9"
                            >
                              <Eye className="h-4 w-4" />
                              {t("transactions.view")}
                            </Button>
                            {canInquiry && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleInquiry(transaction)}
                                className="gap-2 h-9"
                              >
                                <RefreshCw className="h-4 w-4" />
                                {t("transactions.inquiry")}
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {transactions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground mb-3">
                        {t("transactions.noTransactionsFound")}
                      </div>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={handleResetFilters}
                          size="sm"
                        >
                          {t("transactions.clearFilters")}
                        </Button>
                      )}
                    </div>
                  )}

                  {totalPages > 1 && (
                    <MobilePagination
                      currentPage={pageNumber}
                      totalPages={totalPages}
                      onPageChange={onPageChange}
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
                          onClick={() => handleSort("destinationAccountOwner")}
                        >
                          <div className="flex items-center gap-2">
                            {t("transactions.fullName")}
                            <SortIcon field="destinationAccountOwner" />
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                          onClick={() => handleSort("nationalCode")}
                        >
                          <div className="flex items-center gap-2">
                            {t("transactions.nationalCode")}
                            <SortIcon field="nationalCode" />
                          </div>
                        </TableHead>
                        <TableHead>{t("transactions.ibanNumber")}</TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                          onClick={() => handleSort("amount")}
                        >
                          <div className="flex items-center gap-2">
                            {t("transactions.amountColumn")}
                            <SortIcon field="amount" />
                          </div>
                        </TableHead>
                        <TableHead>{t("transactions.paymentTypeColumn")}</TableHead>
                        <TableHead>{t("transactions.reasonCodeColumn")}</TableHead>
                        <TableHead>{t("transactions.statusColumn")}</TableHead>
                        <TableHead className="text-left">{t("transactions.actionsColumn")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction, index) => {
                        const bankCode = getBankCodeFromIban(transaction.destinationIban);
                        const canInquiry = transaction.status === TransactionStatusApiEnum.WaitForBank ||
                                          transaction.status === TransactionStatusApiEnum.WaitForExecution;

                        return (
                          <TableRow
                            key={transaction.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="text-muted-foreground text-sm">
                              {startIndex + index + 1}
                            </TableCell>
                            <TableCell>
                              {transaction.destinationAccountOwner}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {transaction.nationalCode}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2.5">
                                {bankCode && (
                                  <BankLogo bankCode={bankCode} size="sm" />
                                )}
                                <div className="flex flex-col gap-1">
                                  <span className="text-sm font-medium font-mono">
                                    {transaction.destinationIban}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {transaction.accountNumber}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-semibold">
                                {formatCurrency(parseFloat(transaction.amount), locale)}
                              </span>
                            </TableCell>
                            <TableCell>
                              {getPaymentTypeLabel(transaction.paymentType)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {getReasonCodeLabel(transaction.reasonCode)}
                            </TableCell>
                            <TableCell>
                              <TransactionStatusBadge status={transaction.status} size="sm" />
                            </TableCell>
                            <TableCell className="text-left">
                              <div className="flex items-center gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(transaction)}
                                  className="h-8 gap-1.5 text-xs"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                  {t("transactions.view")}
                                </Button>
                                {canInquiry && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleInquiry(transaction)}
                                    className="h-8 gap-1.5 text-xs"
                                  >
                                    <RefreshCw className="h-3.5 w-3.5" />
                                    {t("transactions.inquiry")}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {transactions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground mb-3">
                        {t("transactions.noTransactionsFound")}
                      </div>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="outline"
                          onClick={handleResetFilters}
                          size="sm"
                        >
                          {t("transactions.clearFilters")}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Desktop Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t bg-muted/20">
                      <div className="text-sm text-muted-foreground">
                        {t("transactions.showing")} {startIndex + 1} {t("transactions.to")}{" "}
                        {Math.min(startIndex + pageSize, totalItems)} {t("transactions.of")} {totalItems} {t("transactions.transactionCount")}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange(pageNumber - 1)}
                          disabled={pageNumber === 1}
                          className="gap-1"
                        >
                          <ChevronRight className="h-4 w-4" />
                          {t("transactions.previous")}
                        </Button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                              (page) =>
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - pageNumber) <= 1
                            )
                            .map((page, index, array) => (
                              <div key={page} className="flex items-center gap-1">
                                {index > 0 && array[index - 1] !== page - 1 && (
                                  <span className="px-2 text-muted-foreground">
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => onPageChange(page)}
                                  className={`min-w-8 h-8 px-3 text-sm rounded-md transition-all font-medium ${
                                    pageNumber === page
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
                          onClick={() => onPageChange(pageNumber + 1)}
                          disabled={pageNumber === totalPages}
                          className="gap-1"
                        >
                          {t("transactions.next")}
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <TransactionDetailDialog
        transaction={selectedTransaction as any}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
