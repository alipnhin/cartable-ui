"use client";

import { TransactionFiltersType } from "../page";
import { Card, CardContent } from "@/components/ui/card";
import { Input, InputWrapper } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PersianDatePicker } from "@/components/ui/persian-datepicker";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import AccountSelector from "@/components/common/AccountSelector";
import {
  TransactionStatusMap,
  PaymentTypeMap,
  getDefaultDateRange,
} from "@/services/transactionService";
import {
  Search,
  Filter,
  X,
  Calendar,
  CheckSquare,
  CreditCard,
  Building2,
  Hash,
  FileText,
  User,
} from "lucide-react";
import { useState } from "react";

interface TransactionFiltersProps {
  filters: TransactionFiltersType;
  onFiltersChange: (filters: TransactionFiltersType) => void;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
}: TransactionFiltersProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    const defaultDates = getDefaultDateRange();
    const resetFilters: TransactionFiltersType = {
      search: "",
      status: null,
      paymentType: null,
      fromDate: defaultDates.fromDate,
      toDate: defaultDates.toDate,
      bankGatewayId: "",
      nationalCode: "",
      destinationIban: "",
      accountNumber: "",
      orderId: "",
      transferFromDate: "",
      transferToDate: "",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFiltersCount =
    (filters.status !== null ? 1 : 0) +
    (filters.paymentType !== null ? 1 : 0) +
    (filters.bankGatewayId && filters.bankGatewayId !== "all" ? 1 : 0) +
    (filters.nationalCode ? 1 : 0) +
    (filters.destinationIban ? 1 : 0) +
    (filters.accountNumber ? 1 : 0) +
    (filters.orderId ? 1 : 0) +
    (filters.transferFromDate ? 1 : 0) +
    (filters.transferToDate ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* بخش حساب */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">حساب</Label>
        </div>
        <Separator />
        <AccountSelector
          value={localFilters.bankGatewayId}
          onValueChange={(value) =>
            setLocalFilters({ ...localFilters, bankGatewayId: value })
          }
          placeholder="انتخاب حساب"
          showAllOption={true}
        />
      </div>

      {/* بخش وضعیت */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">{t("filters.status")}</Label>
        </div>
        <Separator />
        <Select
          value={localFilters.status?.toString() || "all"}
          onValueChange={(value) =>
            setLocalFilters({
              ...localFilters,
              status: value === "all" ? null : Number(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="همه وضعیت‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            {Object.entries(TransactionStatusMap).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* بخش نوع پرداخت */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">نوع پرداخت</Label>
        </div>
        <Separator />
        <Select
          value={localFilters.paymentType?.toString() || "all"}
          onValueChange={(value) =>
            setLocalFilters({
              ...localFilters,
              paymentType: value === "all" ? null : Number(value),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="همه انواع" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه انواع</SelectItem>
            {Object.entries(PaymentTypeMap).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* بخش بازه تاریخ ثبت */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">تاریخ ثبت</Label>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="fromDate" className="text-sm text-muted-foreground">
              {t("reports.fromDate")}
            </Label>
            <PersianDatePicker
              value={localFilters.fromDate}
              onChange={(date) =>
                setLocalFilters({ ...localFilters, fromDate: date })
              }
              placeholder={t("reports.fromDate")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="toDate" className="text-sm text-muted-foreground">
              {t("reports.toDate")}
            </Label>
            <PersianDatePicker
              value={localFilters.toDate}
              onChange={(date) =>
                setLocalFilters({ ...localFilters, toDate: date })
              }
              placeholder={t("reports.toDate")}
            />
          </div>
        </div>
      </div>

      {/* بخش بازه تاریخ انتقال */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">تاریخ انتقال</Label>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">از تاریخ</Label>
            <PersianDatePicker
              value={localFilters.transferFromDate}
              onChange={(date) =>
                setLocalFilters({ ...localFilters, transferFromDate: date })
              }
              placeholder="از تاریخ انتقال"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">تا تاریخ</Label>
            <PersianDatePicker
              value={localFilters.transferToDate}
              onChange={(date) =>
                setLocalFilters({ ...localFilters, transferToDate: date })
              }
              placeholder="تا تاریخ انتقال"
            />
          </div>
        </div>
      </div>

      {/* بخش فیلترهای متنی */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">سایر فیلترها</Label>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <User className="h-3 w-3" />
              کد ملی
            </Label>
            <Input
              value={localFilters.nationalCode}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, nationalCode: e.target.value })
              }
              placeholder="کد ملی"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Hash className="h-3 w-3" />
              شماره شبا مقصد
            </Label>
            <Input
              value={localFilters.destinationIban}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  destinationIban: e.target.value,
                })
              }
              placeholder="IR..."
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Hash className="h-3 w-3" />
              شماره حساب
            </Label>
            <Input
              value={localFilters.accountNumber}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  accountNumber: e.target.value,
                })
              }
              placeholder="شماره حساب"
              dir="ltr"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground flex items-center gap-2">
              <Hash className="h-3 w-3" />
              شناسه دستور
            </Label>
            <Input
              value={localFilters.orderId}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, orderId: e.target.value })
              }
              placeholder="شناسه دستور پرداخت"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* جستجو و دکمه فیلتر */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <InputWrapper>
                <Search className="h-4 w-4" />
                <Input
                  placeholder={t("filters.searchPlaceholder")}
                  value={filters.search}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, search: e.target.value })
                  }
                  className="pe-10"
                />
              </InputWrapper>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size={isMobile ? "md" : "sm"}
                  className="gap-2 min-w-fit"
                >
                  <Filter className="h-4 w-4" />
                  {!isMobile && t("filters.advancedFilters")}
                  {activeFiltersCount > 0 && (
                    <span className="ms-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full min-w-5 text-center">
                      {activeFiltersCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:max-w-md overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {t("filters.advancedFilters")}
                  </SheetTitle>
                </SheetHeader>
                <div className="py-6">{filterContent}</div>
                <SheetFooter className="flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="flex-1 gap-2"
                  >
                    <X className="h-4 w-4" />
                    {t("filters.reset")}
                  </Button>
                  <SheetClose asChild>
                    <Button
                      onClick={handleApplyFilters}
                      className="flex-1 gap-2"
                    >
                      <Filter className="h-4 w-4" />
                      {t("common.buttons.apply")}
                    </Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* نمایش فیلترهای فعال */}
      {activeFiltersCount > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground shrink-0">
                <Filter className="h-4 w-4" />
                {t("filters.activeFilters")}:
              </div>
              <div className="flex flex-wrap gap-2 flex-1">
                {/* وضعیت */}
                {filters.status !== null && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    {TransactionStatusMap[filters.status]?.label || "نامشخص"}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, status: null });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* نوع پرداخت */}
                {filters.paymentType !== null && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    {PaymentTypeMap[filters.paymentType]?.label || "نامشخص"}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, paymentType: null });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* حساب */}
                {filters.bankGatewayId && filters.bankGatewayId !== "all" && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    حساب انتخاب شده
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, bankGatewayId: "" });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* کد ملی */}
                {filters.nationalCode && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    کد ملی: {filters.nationalCode}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, nationalCode: "" });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* شماره شبا */}
                {filters.destinationIban && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    شبا: {filters.destinationIban.slice(0, 10)}...
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, destinationIban: "" });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* شماره حساب */}
                {filters.accountNumber && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    شماره حساب: {filters.accountNumber}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, accountNumber: "" });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* شناسه دستور */}
                {filters.orderId && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    شناسه: {filters.orderId}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, orderId: "" });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* دکمه پاک کردن همه */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-6 text-xs hover:bg-muted"
                >
                  {t("filters.clearAll")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
