"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersianDatePicker } from "@/components/ui/persian-datepicker";
import AccountSelector from "@/components/common/AccountSelector";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderStatus } from "@/types/order";
import { Filter, X, ChevronDown, Search } from "lucide-react";

interface OrderFiltersType {
  status: OrderStatus | "";
  orderTitle: string;
  orderNumber: string;
  trackingId: string;
  dateFrom: string;
  dateTo: string;
  accountId: string;
}

interface OrderFiltersProps {
  filters: OrderFiltersType;
  onFiltersChange: (filters: OrderFiltersType) => void;
}

export function OrderFilters({ filters, onFiltersChange }: OrderFiltersProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] = useState(filters);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sync local filters with props
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const statusOptions = [
    {
      value: OrderStatus.WaitingForOwnersApproval,
      label: t("paymentCartable.statusLabels.waitingForApproval"),
    },
    {
      value: OrderStatus.OwnersApproved,
      label: t("paymentCartable.statusLabels.approved"),
    },
    {
      value: OrderStatus.SubmittedToBank,
      label: t("paymentCartable.statusLabels.submittedToBank"),
    },
    {
      value: OrderStatus.BankSucceeded,
      label: t("paymentCartable.statusLabels.succeeded"),
    },
    {
      value: OrderStatus.OwnerRejected,
      label: t("paymentCartable.statusLabels.rejected"),
    },
    {
      value: OrderStatus.BankRejected,
      label: t("paymentCartable.statusLabels.bankRejected"),
    },
    {
      value: OrderStatus.Draft,
      label: t("paymentCartable.statusLabels.draft"),
    },
    {
      value: OrderStatus.DoneWithError,
      label: t("paymentCartable.statusLabels.doneWithError"),
    },
    {
      value: OrderStatus.Canceled,
      label: t("paymentCartable.statusLabels.canceled"),
    },
    {
      value: OrderStatus.Expired,
      label: t("paymentCartable.statusLabels.expired"),
    },
    {
      value: OrderStatus.WaitForManagerApproval,
      label: t("paymentCartable.statusLabels.waitForManagerApproval"),
    },
  ];

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setIsDrawerOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: OrderFiltersType = {
      status: "",
      orderTitle: "",
      orderNumber: "",
      trackingId: "",
      dateFrom: "",
      dateTo: "",
      accountId: "",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  // Count advanced filters only
  const advancedFiltersCount =
    (localFilters.orderTitle ? 1 : 0) +
    (localFilters.trackingId ? 1 : 0) +
    (localFilters.dateFrom ? 1 : 0) +
    (localFilters.dateTo ? 1 : 0);

  // Advanced filters content
  const advancedFiltersContent = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* عنوان دستور پرداخت */}
      <div className="space-y-2">
        <Label className="text-sm">{t("filters.orderTitleLabel")}</Label>
        <Input
          value={localFilters.orderTitle}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, orderTitle: e.target.value }))
          }
          placeholder={t("filters.orderTitlePlaceholder")}
        />
      </div>

      {/* کد رهگیری بانک */}
      <div className="space-y-2">
        <Label className="text-sm">{t("filters.trackingIdLabel")}</Label>
        <Input
          value={localFilters.trackingId}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, trackingId: e.target.value }))
          }
          placeholder={t("filters.trackingIdPlaceholder")}
          dir="ltr"
        />
      </div>

      {/* تاریخ ثبت از */}
      <div className="space-y-2">
        <Label className="text-sm">{t("filters.fromDate")}</Label>
        <PersianDatePicker
          value={localFilters.dateFrom}
          onChange={(date) =>
            setLocalFilters((prev) => ({ ...prev, dateFrom: date }))
          }
          placeholder={t("common.selectDate")}
        />
      </div>

      {/* تاریخ ثبت تا */}
      <div className="space-y-2">
        <Label className="text-sm">{t("filters.toDate")}</Label>
        <PersianDatePicker
          value={localFilters.dateTo}
          onChange={(date) =>
            setLocalFilters((prev) => ({ ...prev, dateTo: date }))
          }
          placeholder={t("common.selectDate")}
        />
      </div>
    </div>
  );

  // Mobile filters content
  const mobileFiltersContent = (
    <div className="space-y-4">
      {/* فیلترهای اصلی */}
      <div className="space-y-4">
        {/* وضعیت */}
        <div className="space-y-2">
          <Label className="text-sm">{t("filters.status")}</Label>
          <Select
            value={
              localFilters.status !== "" ? String(localFilters.status) : "all"
            }
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                status: value === "all" ? "" : (value as OrderStatus),
              }))
            }
          >
            <SelectTrigger size="lg" className="h-12">
              <SelectValue placeholder={t("filters.allStatuses")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* حساب مبدا */}
        <div className="space-y-2">
          <Label className="text-sm">{t("filters.account")}</Label>
          <AccountSelector
            value={localFilters.accountId}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, accountId: value }))
            }
            showAllOption={true}
          />
        </div>

        {/* شماره دستور پرداخت */}
        <div className="space-y-2">
          <Label className="text-sm">{t("filters.orderNumberLabel")}</Label>
          <Input
            value={localFilters.orderNumber}
            onChange={(e) =>
              setLocalFilters((prev) => ({
                ...prev,
                orderNumber: e.target.value,
              }))
            }
            placeholder={t("filters.orderNumberPlaceholder")}
            dir="ltr"
          />
        </div>
      </div>

      {/* فیلترهای پیشرفته */}
      {advancedFiltersContent}
    </div>
  );

  // Mobile view
  if (isMobile) {
    return (
      <Card className="mb-4">
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
              <DrawerFooter className="flex-row gap-2 mb-8">
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="flex-1 gap-2"
                >
                  <X className="h-4 w-4" />
                  پاک کردن
                </Button>
                <DrawerClose asChild>
                  <Button onClick={handleApplyFilters} className="flex-1 gap-2">
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

  // Desktop view
  return (
    <Card className="mb-4">
      <CardContent className="p-4 space-y-4">
        {/* فیلترهای اصلی - سه ستونه */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* وضعیت */}
          <div className="space-y-2">
            <Label className="text-sm">{t("filters.status")}</Label>
            <Select
              value={
                localFilters.status !== "" ? String(localFilters.status) : "all"
              }
              onValueChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: value === "all" ? "" : (value as OrderStatus),
                }))
              }
            >
              <SelectTrigger size="lg">
                <SelectValue placeholder={t("filters.allStatuses")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={String(option.value)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* حساب مبدا */}
          <div className="space-y-2">
            <Label className="text-sm">{t("filters.account")}</Label>
            <AccountSelector
              value={localFilters.accountId}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, accountId: value }))
              }
              showAllOption={true}
            />
          </div>

          {/* شماره دستور پرداخت */}
          <div className="space-y-2">
            <Label className="text-sm">{t("filters.orderNumberLabel")}</Label>
            <Input
              value={localFilters.orderNumber}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  orderNumber: e.target.value,
                }))
              }
              placeholder={t("filters.orderNumberPlaceholder")}
              dir="ltr"
            />
          </div>
        </div>

        {/* فیلترهای پیشرفته - آکاردیون */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleContent className="pb-4">
            {advancedFiltersContent}
          </CollapsibleContent>
        </Collapsible>

        {/* دکمه‌ها */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            فیلترهای بیشتر
            {advancedFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {advancedFiltersCount}
              </Badge>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isAdvancedOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            بازنشانی
          </Button>
          <Button
            size="sm"
            onClick={handleApplyFilters}
            className="gap-2 ms-auto"
          >
            <Search className="h-4 w-4" />
            اعمال فیلتر
          </Button>
        </div>

        {/* نمایش فیلترهای فعال */}
        {advancedFiltersCount > 0 && !isAdvancedOpen && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {localFilters.orderTitle && (
              <Badge variant="secondary" className="gap-1">
                عنوان: {localFilters.orderTitle}
                <button
                  onClick={() => {
                    const updated = { ...localFilters, orderTitle: "" };
                    setLocalFilters(updated);
                    onFiltersChange(updated);
                  }}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {localFilters.trackingId && (
              <Badge variant="secondary" className="gap-1">
                کد رهگیری: {localFilters.trackingId}
                <button
                  onClick={() => {
                    const updated = { ...localFilters, trackingId: "" };
                    setLocalFilters(updated);
                    onFiltersChange(updated);
                  }}
                  className="hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {(localFilters.dateFrom || localFilters.dateTo) && (
              <Badge variant="secondary" className="gap-1">
                بازه تاریخ
                <button
                  onClick={() => {
                    const updated = {
                      ...localFilters,
                      dateFrom: "",
                      dateTo: "",
                    };
                    setLocalFilters(updated);
                    onFiltersChange(updated);
                  }}
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
