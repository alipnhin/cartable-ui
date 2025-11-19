"use client";

import { TransactionFiltersType } from "../page";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
  Filter,
  X,
  ChevronDown,
  Search,
} from "lucide-react";
import { useState, useEffect } from "react";

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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync local filters with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsDrawerOpen(false);
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

  // Count advanced filters only
  const advancedFiltersCount =
    (filters.status !== null ? 1 : 0) +
    (filters.paymentType !== null ? 1 : 0) +
    (filters.nationalCode ? 1 : 0) +
    (filters.destinationIban ? 1 : 0) +
    (filters.accountNumber ? 1 : 0) +
    (filters.orderId ? 1 : 0) +
    (filters.transferFromDate ? 1 : 0) +
    (filters.transferToDate ? 1 : 0);

  // Advanced filters content (shared between desktop accordion and mobile drawer)
  const advancedFiltersContent = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* وضعیت */}
      <div className="space-y-2">
        <Label className="text-sm">{t("filters.status")}</Label>
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

      {/* نوع پرداخت */}
      <div className="space-y-2">
        <Label className="text-sm">نوع پرداخت</Label>
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

      {/* کد ملی */}
      <div className="space-y-2">
        <Label className="text-sm">کد ملی</Label>
        <Input
          value={localFilters.nationalCode}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, nationalCode: e.target.value })
          }
          placeholder="کد ملی"
        />
      </div>

      {/* شماره شبا مقصد */}
      <div className="space-y-2">
        <Label className="text-sm">شماره شبا مقصد</Label>
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

      {/* شماره حساب */}
      <div className="space-y-2">
        <Label className="text-sm">شماره حساب</Label>
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

      {/* شناسه دستور */}
      <div className="space-y-2">
        <Label className="text-sm">شناسه دستور</Label>
        <Input
          value={localFilters.orderId}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, orderId: e.target.value })
          }
          placeholder="شناسه دستور پرداخت"
          dir="ltr"
        />
      </div>

      {/* تاریخ انتقال از */}
      <div className="space-y-2">
        <Label className="text-sm">تاریخ انتقال از</Label>
        <PersianDatePicker
          value={localFilters.transferFromDate}
          onChange={(date) =>
            setLocalFilters({ ...localFilters, transferFromDate: date })
          }
          placeholder="از تاریخ انتقال"
        />
      </div>

      {/* تاریخ انتقال تا */}
      <div className="space-y-2">
        <Label className="text-sm">تاریخ انتقال تا</Label>
        <PersianDatePicker
          value={localFilters.transferToDate}
          onChange={(date) =>
            setLocalFilters({ ...localFilters, transferToDate: date })
          }
          placeholder="تا تاریخ انتقال"
        />
      </div>
    </div>
  );

  // Mobile filters in drawer
  const mobileFiltersContent = (
    <div className="space-y-4">
      {/* فیلترهای اصلی */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm">انتخاب حساب</Label>
          <AccountSelector
            value={localFilters.bankGatewayId}
            onValueChange={(value) =>
              setLocalFilters({ ...localFilters, bankGatewayId: value })
            }
            placeholder="انتخاب حساب"
            showAllOption={true}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label className="text-sm">{t("reports.fromDate")}</Label>
            <PersianDatePicker
              value={localFilters.fromDate}
              onChange={(date) =>
                setLocalFilters({ ...localFilters, fromDate: date })
              }
              placeholder={t("reports.fromDate")}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">{t("reports.toDate")}</Label>
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

      {/* فیلترهای پیشرفته */}
      {advancedFiltersContent}
    </div>
  );

  // Mobile view - just a button to open drawer
  if (isMobile) {
    return (
      <Card>
        <CardContent className="p-4">
          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full gap-2">
                <Filter className="h-4 w-4" />
                فیلترها
                {advancedFiltersCount > 0 && (
                  <Badge variant="secondary" className="ms-1">
                    {advancedFiltersCount}
                  </Badge>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[85vh]">
              <DrawerHeader>
                <DrawerTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  فیلترها
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4 overflow-y-auto">
                {mobileFiltersContent}
              </div>
              <DrawerFooter className="flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="flex-1 gap-2"
                >
                  <X className="h-4 w-4" />
                  پاک کردن
                </Button>
                <DrawerClose asChild>
                  <Button
                    onClick={handleApplyFilters}
                    className="flex-1 gap-2"
                  >
                    <Search className="h-4 w-4" />
                    اعمال فیلتر
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </CardContent>
      </Card>
    );
  }

  // Desktop view - inline main filters + collapsible advanced
  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        {/* فیلترهای اصلی - سه ستونه + دکمه جستجو */}
        <div className="grid gap-4 md:grid-cols-4 items-end">
          {/* انتخاب حساب */}
          <div className="space-y-2">
            <Label className="text-sm">انتخاب حساب</Label>
            <AccountSelector
              value={localFilters.bankGatewayId}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, bankGatewayId: value })
              }
              placeholder="همه حساب‌ها"
              showAllOption={true}
            />
          </div>

          {/* تاریخ ثبت از */}
          <div className="space-y-2">
            <Label className="text-sm">{t("reports.fromDate")}</Label>
            <PersianDatePicker
              value={localFilters.fromDate}
              onChange={(date) =>
                setLocalFilters({ ...localFilters, fromDate: date })
              }
              placeholder={t("reports.fromDate")}
            />
          </div>

          {/* تاریخ ثبت تا */}
          <div className="space-y-2">
            <Label className="text-sm">{t("reports.toDate")}</Label>
            <PersianDatePicker
              value={localFilters.toDate}
              onChange={(date) =>
                setLocalFilters({ ...localFilters, toDate: date })
              }
              placeholder={t("reports.toDate")}
            />
          </div>

          {/* دکمه جستجو */}
          <Button onClick={handleApplyFilters} className="gap-2">
            <Search className="h-4 w-4" />
            جستجو
          </Button>
        </div>

        {/* فیلترهای پیشرفته - آکاردیون */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-muted/50"
            >
              <span className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                فیلترهای پیشرفته
                {advancedFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {advancedFiltersCount}
                  </Badge>
                )}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  isAdvancedOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="space-y-4">
              {advancedFiltersContent}

              {/* دکمه‌های اکشن */}
              <div className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  پاک کردن فیلترها
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplyFilters}
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  اعمال فیلتر
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* نمایش فیلترهای فعال */}
        {advancedFiltersCount > 0 && !isAdvancedOpen && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {filters.status !== null && (
              <Badge
                variant="secondary"
                className="gap-1"
              >
                {TransactionStatusMap[filters.status]?.label || "نامشخص"}
                <button
                  onClick={() => onFiltersChange({ ...filters, status: null })}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.paymentType !== null && (
              <Badge
                variant="secondary"
                className="gap-1"
              >
                {PaymentTypeMap[filters.paymentType]?.label || "نامشخص"}
                <button
                  onClick={() => onFiltersChange({ ...filters, paymentType: null })}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.nationalCode && (
              <Badge variant="secondary" className="gap-1">
                کد ملی: {filters.nationalCode}
                <button
                  onClick={() => onFiltersChange({ ...filters, nationalCode: "" })}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.orderId && (
              <Badge variant="secondary" className="gap-1">
                شناسه: {filters.orderId}
                <button
                  onClick={() => onFiltersChange({ ...filters, orderId: "" })}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="h-6 text-xs"
            >
              {t("filters.clearAll")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
