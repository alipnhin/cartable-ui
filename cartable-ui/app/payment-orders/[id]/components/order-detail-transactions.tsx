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
}

type SortField = "amount" | "destinationAccountOwner" | "nationalCode";

// Helper function to convert API enum to display name
const getStatusBadgeVariant = (status: TransactionStatusApiEnum) => {
  switch (status) {
    case TransactionStatusApiEnum.BankSucceeded:
      return "success";
    case TransactionStatusApiEnum.BankFailed:
    case TransactionStatusApiEnum.Canceled:
      return "destructive";
    case TransactionStatusApiEnum.WaitForBank:
    case TransactionStatusApiEnum.WaitForExecution:
    case TransactionStatusApiEnum.Draft:
      return "warning";
    default:
      return "secondary";
  }
};

const getStatusLabel = (status: TransactionStatusApiEnum) => {
  switch (status) {
    case TransactionStatusApiEnum.Draft:
      return "پیش‌نویس";
    case TransactionStatusApiEnum.WaitForExecution:
      return "در انتظار اجرا";
    case TransactionStatusApiEnum.WaitForBank:
      return "در انتظار بانک";
    case TransactionStatusApiEnum.BankSucceeded:
      return "موفق";
    case TransactionStatusApiEnum.BankFailed:
      return "ناموفق";
    case TransactionStatusApiEnum.Canceled:
      return "لغو شده";
    default:
      return status;
  }
};

const getPaymentTypeLabel = (type: PaymentTypeApiEnum) => {
  switch (type) {
    case PaymentTypeApiEnum.Paya:
      return "پایا";
    case PaymentTypeApiEnum.Satna:
      return "ساتنا";
    case PaymentTypeApiEnum.Rtgs:
      return "آنی (RTGS)";
    default:
      return type;
  }
};

const getReasonCodeLabel = (code: ReasonCodeApiEnum) => {
  switch (code) {
    case ReasonCodeApiEnum.InvestmentAndBourse:
      return "سرمایه‌گذاری و بورس";
    case ReasonCodeApiEnum.ImportGoods:
      return "واردات کالا";
    case ReasonCodeApiEnum.SalaryAndWages:
      return "حقوق و دستمزد";
    case ReasonCodeApiEnum.TaxAndDuties:
      return "مالیات و عوارض";
    case ReasonCodeApiEnum.LoanRepayment:
      return "بازپرداخت وام";
    case ReasonCodeApiEnum.OtherPayments:
      return "سایر پرداخت‌ها";
    default:
      return code;
  }
};

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
}: OrderDetailTransactionsProps) {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();

  // Local filter state
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatusApiEnum | "">("");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<PaymentTypeApiEnum | "">("");
  const [reasonCodeFilter, setReasonCodeFilter] = useState<ReasonCodeApiEnum | "">("");
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
    if (statusFilter) filters.status = statusFilter;
    if (paymentTypeFilter) filters.paymentType = paymentTypeFilter;
    if (reasonCodeFilter) filters.reasonCode = reasonCodeFilter;

    onFilterChange(filters);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setStatusFilter("");
    setPaymentTypeFilter("");
    setReasonCodeFilter("");
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
    // TODO: Implement inquiry API call
    console.log("Inquiry for transaction:", transaction.id);
    await onRefresh();
  };

  const activeFiltersCount =
    (searchValue ? 1 : 0) +
    (statusFilter ? 1 : 0) +
    (paymentTypeFilter ? 1 : 0) +
    (reasonCodeFilter ? 1 : 0);

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
              <CardTitle className="text-xl">لیست تراکنش‌ها</CardTitle>
              <span className="text-sm text-muted-foreground">
                {totalItems} تراکنش
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 w-full sm:w-auto ms-auto">
              {/* Refresh Button */}
              <Button
                variant="outline"
                onClick={onRefresh}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                {!isMobile && "بروزرسانی"}
              </Button>

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
                <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>فیلتر تراکنش‌ها</SheetTitle>
                  </SheetHeader>

                  <div className="space-y-6 py-6">
                    {/* Search */}
                    <div className="space-y-2">
                      <Label>جستجو</Label>
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="نام، شماره شبا، کد ملی..."
                          value={searchValue}
                          onChange={(e) => setSearchValue(e.target.value)}
                          className="pr-10"
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <Label>وضعیت تراکنش</Label>
                      <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="همه وضعیت‌ها" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">همه وضعیت‌ها</SelectItem>
                          <SelectItem value={TransactionStatusApiEnum.BankSucceeded}>
                            موفق
                          </SelectItem>
                          <SelectItem value={TransactionStatusApiEnum.BankFailed}>
                            ناموفق
                          </SelectItem>
                          <SelectItem value={TransactionStatusApiEnum.WaitForBank}>
                            در انتظار بانک
                          </SelectItem>
                          <SelectItem value={TransactionStatusApiEnum.WaitForExecution}>
                            در انتظار اجرا
                          </SelectItem>
                          <SelectItem value={TransactionStatusApiEnum.Draft}>
                            پیش‌نویس
                          </SelectItem>
                          <SelectItem value={TransactionStatusApiEnum.Canceled}>
                            لغو شده
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Payment Type Filter */}
                    <div className="space-y-2">
                      <Label>نوع پرداخت</Label>
                      <Select value={paymentTypeFilter} onValueChange={(v) => setPaymentTypeFilter(v as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="همه انواع" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">همه انواع</SelectItem>
                          <SelectItem value={PaymentTypeApiEnum.Paya}>پایا</SelectItem>
                          <SelectItem value={PaymentTypeApiEnum.Satna}>ساتنا</SelectItem>
                          <SelectItem value={PaymentTypeApiEnum.Rtgs}>آنی (RTGS)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Reason Code Filter */}
                    <div className="space-y-2">
                      <Label>کد علت</Label>
                      <Select value={reasonCodeFilter} onValueChange={(v) => setReasonCodeFilter(v as any)}>
                        <SelectTrigger>
                          <SelectValue placeholder="همه کدها" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">همه کدها</SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.InvestmentAndBourse}>
                            سرمایه‌گذاری و بورس
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.ImportGoods}>
                            واردات کالا
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.SalaryAndWages}>
                            حقوق و دستمزد
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.TaxAndDuties}>
                            مالیات و عوارض
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.LoanRepayment}>
                            بازپرداخت وام
                          </SelectItem>
                          <SelectItem value={ReasonCodeApiEnum.OtherPayments}>
                            سایر پرداخت‌ها
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                    <Button onClick={handleApplyFilters} className="flex-1">
                      اعمال فیلتر
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 p-4 border-b bg-muted/10">
              {searchValue && (
                <Badge variant="secondary" className="gap-1.5">
                  جستجو: {searchValue}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setSearchValue("");
                      handleApplyFilters();
                    }}
                  />
                </Badge>
              )}
              {statusFilter && (
                <Badge variant="secondary" className="gap-1.5">
                  {getStatusLabel(statusFilter)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setStatusFilter("");
                      handleApplyFilters();
                    }}
                  />
                </Badge>
              )}
              {paymentTypeFilter && (
                <Badge variant="secondary" className="gap-1.5">
                  {getPaymentTypeLabel(paymentTypeFilter)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setPaymentTypeFilter("");
                      handleApplyFilters();
                    }}
                  />
                </Badge>
              )}
              {reasonCodeFilter && (
                <Badge variant="secondary" className="gap-1.5">
                  {getReasonCodeLabel(reasonCodeFilter)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => {
                      setReasonCodeFilter("");
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
                پاک کردن همه
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
                // Mobile Cards View - بازطراحی شده
                <div className="p-4 space-y-3">
                  {transactions.map((transaction, index) => {
                    const bankCode = getBankCodeFromIban(transaction.destinationIban);
                    const canInquiry = transaction.status === TransactionStatusApiEnum.WaitForBank;

                    return (
                      <Card
                        key={transaction.id}
                        className="border-2 hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            {/* هدر کارت: نام و وضعیت */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {bankCode && (
                                  <div className="shrink-0">
                                    <BankLogo bankCode={bankCode} size="sm" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-base truncate">
                                    {transaction.destinationAccountOwner}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    ردیف {startIndex + index + 1}
                                  </div>
                                </div>
                              </div>
                              <Badge variant={getStatusBadgeVariant(transaction.status) as any} className="shrink-0">
                                {getStatusLabel(transaction.status)}
                              </Badge>
                            </div>

                            <div className="border-t" />

                            {/* اطلاعات اصلی */}
                            <div className="space-y-2.5">
                              {/* مبلغ */}
                              <div className="flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-xs text-muted-foreground">مبلغ:</span>
                                <span className="font-bold text-primary flex-1 truncate">
                                  {formatCurrency(parseFloat(transaction.amount), locale)} ریال
                                </span>
                              </div>

                              {/* کد ملی */}
                              <div className="flex items-center gap-2">
                                <Hash className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-xs text-muted-foreground">کد ملی:</span>
                                <span className="text-sm font-mono flex-1">
                                  {transaction.nationalCode}
                                </span>
                              </div>

                              {/* شماره شبا */}
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-xs text-muted-foreground">شبا:</span>
                                <span className="text-xs font-mono flex-1 truncate">
                                  {transaction.destinationIban}
                                </span>
                              </div>

                              {/* نوع پرداخت */}
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                <span className="text-xs text-muted-foreground">نوع:</span>
                                <span className="text-sm font-medium">
                                  {getPaymentTypeLabel(transaction.paymentType)}
                                </span>
                              </div>

                              {/* کد علت */}
                              <div className="flex items-start gap-2">
                                <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                <span className="text-xs text-muted-foreground">علت:</span>
                                <span className="text-sm flex-1">
                                  {getReasonCodeLabel(transaction.reasonCode)}
                                </span>
                              </div>

                              {/* کد رهگیری */}
                              {transaction.trackingId && (
                                <div className="flex items-center gap-2 pt-2 border-t">
                                  <span className="text-xs text-muted-foreground">کد رهگیری:</span>
                                  <span className="text-sm font-mono font-medium flex-1">
                                    {transaction.trackingId}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* دکمه‌های عملیات */}
                            <div className="pt-2 flex gap-2 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(transaction)}
                                className="flex-1 gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                مشاهده جزئیات
                              </Button>
                              {canInquiry && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleInquiry(transaction)}
                                  className="gap-2"
                                >
                                  <RefreshCw className="h-4 w-4" />
                                  استعلام
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {transactions.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground mb-3">
                        تراکنشی یافت نشد
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
                            نام و نام خانوادگی
                            <SortIcon field="destinationAccountOwner" />
                          </div>
                        </TableHead>
                        <TableHead
                          className="cursor-pointer select-none hover:bg-muted/50 transition-colors"
                          onClick={() => handleSort("nationalCode")}
                        >
                          <div className="flex items-center gap-2">
                            کد ملی
                            <SortIcon field="nationalCode" />
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
                        <TableHead>نوع پرداخت</TableHead>
                        <TableHead>کد علت</TableHead>
                        <TableHead>وضعیت</TableHead>
                        <TableHead className="text-left">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction, index) => {
                        const bankCode = getBankCodeFromIban(transaction.destinationIban);
                        const canInquiry = transaction.status === TransactionStatusApiEnum.WaitForBank;

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
                              <Badge variant={getStatusBadgeVariant(transaction.status) as any}>
                                {getStatusLabel(transaction.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-left">
                              <div className="flex items-center gap-1 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(transaction)}
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                  title="مشاهده جزئیات"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {canInquiry && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleInquiry(transaction)}
                                    className="h-8 w-8 p-0 hover:bg-primary/10"
                                    title="استعلام تراکنش"
                                  >
                                    <RefreshCw className="h-4 w-4" />
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
                        تراکنشی یافت نشد
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
                        {Math.min(startIndex + pageSize, totalItems)} از {totalItems} تراکنش
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
                          قبلی
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
                          بعدی
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
