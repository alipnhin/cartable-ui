"use client";

import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Check, ChevronsUpDown } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderStatus } from "@/types/order";
import { mockAccounts } from "@/mocks/mockAccounts";
import { cn } from "@/lib/utils";
import DatePicker from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/colors/purple.css";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: OrderStatus | ""; // تک انتخابی
    search: string;
    orderTitle: string;
    orderNumber: string;
    trackingId: string;
    dateFrom: string;
    dateTo: string;
    accountId: string;
  };
  onFiltersChange: (filters: FilterSheetProps["filters"]) => void;
  onReset: () => void;
  isLoading?: boolean; // برای نمایش loading هنگام اعمال فیلتر
}

export function FilterSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onReset,
  isLoading = false,
}: FilterSheetProps) {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] = useState(filters);
  const [accountOpen, setAccountOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // فقط وقتی FilterSheet باز می‌شود، filters را به localFilters کپی می‌کنیم
  // این مشکل از دست رفتن focus در textbox را حل می‌کند
  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

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
      value: OrderStatus.Succeeded,
      label: t("paymentCartable.statusLabels.succeeded"),
    },
    {
      value: OrderStatus.Rejected,
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
      value: OrderStatus.PartiallySucceeded,
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
  ];

  // تغییر وضعیت - تک انتخابی
  const handleStatusSelect = (status: OrderStatus | "") => {
    setLocalFilters({ ...localFilters, status });
    setStatusOpen(false); // بستن popover بعد از انتخاب
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    onReset();
    onOpenChange(false);
  };

  const activeFiltersCount =
    (localFilters.status ? 1 : 0) +
    (localFilters.orderTitle ? 1 : 0) +
    (localFilters.orderNumber ? 1 : 0) +
    (localFilters.trackingId ? 1 : 0) +
    (localFilters.search ? 1 : 0) +
    (localFilters.dateFrom ? 1 : 0) +
    (localFilters.dateTo ? 1 : 0) +
    (localFilters.accountId && localFilters.accountId !== "all" ? 1 : 0);

  const selectedAccount = mockAccounts.find(
    (acc) => acc.id === localFilters.accountId
  );

  const FilterContent = () => (
    <div className="space-y-6">
      {/* عنوان دستور پرداخت */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">عنوان دستور پرداخت</Label>
        <Input
          placeholder="جستجو بر اساس عنوان..."
          value={localFilters.orderTitle}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, orderTitle: e.target.value })
          }
          className={cn("h-10", isMobile && "h-12 text-base")}
        />
      </div>

      {/* شماره دستور پرداخت */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">شماره دستور پرداخت</Label>
        <Input
          placeholder="مثال: 1001..."
          value={localFilters.orderNumber}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, orderNumber: e.target.value })
          }
          className={cn("h-10", isMobile && "h-12 text-base")}
        />
      </div>

      {/* کد رهگیری */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">کد رهگیری</Label>
        <Input
          placeholder="جستجو بر اساس کد رهگیری..."
          value={localFilters.trackingId}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, trackingId: e.target.value })
          }
          className={cn("h-10", isMobile && "h-12 text-base")}
        />
      </div>

      {/* Search - جستجوی عمومی */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.search")}</Label>
        <Input
          placeholder={t("filters.searchPlaceholder")}
          value={localFilters.search}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, search: e.target.value })
          }
          className={cn("h-10", isMobile && "h-12 text-base")}
        />
      </div>

      {/* Account Combobox */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.account")}</Label>
        {isMobile ? (
          <button
            onClick={() => setAccountOpen(true)}
            className="w-full flex items-center justify-between h-12 px-4 rounded-lg border border-input bg-background text-start text-base"
          >
            <span className="truncate">
              {selectedAccount
                ? selectedAccount.accountTitle
                : t("filters.allAccounts")}
            </span>
            <ChevronsUpDown className="ms-2 h-5 w-5 shrink-0 opacity-50" />
          </button>
        ) : (
          <Popover open={accountOpen} onOpenChange={setAccountOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={accountOpen}
                className="w-full justify-between h-10"
              >
                {selectedAccount
                  ? selectedAccount.accountTitle
                  : t("filters.allAccounts")}
                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-100 p-0" align="start">
              <Command>
                <CommandInput placeholder={t("filters.search")} />
                <CommandList>
                  <CommandEmpty>موردی یافت نشد</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => {
                        setLocalFilters({ ...localFilters, accountId: "all" });
                        setAccountOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "me-2 h-4 w-4",
                          localFilters.accountId === "all" ||
                            !localFilters.accountId
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {t("filters.allAccounts")}
                    </CommandItem>
                    {mockAccounts.map((account) => (
                      <CommandItem
                        key={account.id}
                        value={account.id}
                        onSelect={() => {
                          setLocalFilters({
                            ...localFilters,
                            accountId: account.id,
                          });
                          setAccountOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "me-2 h-4 w-4",
                            localFilters.accountId === account.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {account.accountTitle}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Mobile Drawer for Account Selection */}
      {isMobile && (
        <Drawer open={accountOpen} onOpenChange={setAccountOpen}>
          <DrawerContent className="max-h-[70vh]">
            <DrawerHeader>
              <DrawerTitle>{t("filters.account")}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto p-4 space-y-2">
              <button
                onClick={() => {
                  setLocalFilters({ ...localFilters, accountId: "all" });
                  setAccountOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-lg text-base text-start transition-colors",
                  localFilters.accountId === "all" || !localFilters.accountId
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                {(localFilters.accountId === "all" ||
                  !localFilters.accountId) && <Check className="h-5 w-5" />}
                <span className="flex-1">{t("filters.allAccounts")}</span>
              </button>
              {mockAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => {
                    setLocalFilters({
                      ...localFilters,
                      accountId: account.id,
                    });
                    setAccountOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-lg text-base text-start transition-colors",
                    localFilters.accountId === account.id
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  {localFilters.accountId === account.id && (
                    <Check className="h-5 w-5" />
                  )}
                  <span className="flex-1">{account.accountTitle}</span>
                </button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Status Single-select Combobox - تک انتخابی */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.status")}</Label>
        {isMobile ? (
          <button
            onClick={() => setStatusOpen(true)}
            className="w-full flex items-center justify-between h-12 px-4 rounded-lg border border-input bg-background text-start text-base"
          >
            <span className="truncate">
              {localFilters.status
                ? statusOptions.find((opt) => opt.value === localFilters.status)
                    ?.label
                : t("filters.allStatuses")}
            </span>
            <ChevronsUpDown className="ms-2 h-5 w-5 shrink-0 opacity-50" />
          </button>
        ) : (
          <Popover open={statusOpen} onOpenChange={setStatusOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={statusOpen}
                className="w-full justify-between h-10"
              >
                <span className="truncate">
                  {localFilters.status
                    ? statusOptions.find(
                        (opt) => opt.value === localFilters.status
                      )?.label
                    : t("filters.allStatuses")}
                </span>
                <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-100 p-0" align="start">
              <Command>
                <CommandInput placeholder={t("filters.search")} />
                <CommandList>
                  <CommandEmpty>موردی یافت نشد</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value="all"
                      onSelect={() => handleStatusSelect("")}
                    >
                      <Check
                        className={cn(
                          "me-2 h-4 w-4",
                          !localFilters.status ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {t("filters.allStatuses")}
                    </CommandItem>
                    {statusOptions.map((option) => {
                      const isSelected = localFilters.status === option.value;
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleStatusSelect(option.value)}
                        >
                          <Check
                            className={cn(
                              "me-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {option.label}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Mobile Drawer for Status Selection - تک انتخابی */}
      {isMobile && (
        <Drawer open={statusOpen} onOpenChange={setStatusOpen}>
          <DrawerContent className="max-h-[70vh]">
            <DrawerHeader>
              <DrawerTitle>{t("filters.status")}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto p-4 space-y-2">
              <button
                onClick={() => handleStatusSelect("")}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-lg text-base text-start transition-colors",
                  !localFilters.status
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                {!localFilters.status && <Check className="h-5 w-5" />}
                <span className="flex-1">{t("filters.allStatuses")}</span>
              </button>
              {statusOptions.map((option) => {
                const isSelected = localFilters.status === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusSelect(option.value)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-lg text-base text-start transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    {isSelected && <Check className="h-5 w-5" />}
                    <span className="flex-1">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Date Range - تاریخ شمسی و میلادی */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">از تاریخ</Label>
          <DatePicker
            value={localFilters.dateFrom}
            onChange={(date: Value) => {
              if (date && typeof date === "object" && "toDate" in date) {
                const isoDate = date.toDate().toISOString().split("T")[0];
                setLocalFilters({ ...localFilters, dateFrom: isoDate });
              } else if (!date) {
                setLocalFilters({ ...localFilters, dateFrom: "" });
              }
            }}
            calendar={locale === "fa" ? persian : gregorian}
            locale={locale === "fa" ? persian_fa : gregorian_en}
            format={locale === "fa" ? "YYYY/MM/DD" : "YYYY-MM-DD"}
            className={cn("purple", isMobile && "rmdp-mobile")}
            calendarPosition={locale === "fa" ? "bottom-right" : "bottom-left"}
            inputClass={cn(
              "w-full px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              isMobile ? "h-12 text-base" : "h-10"
            )}
            containerClassName="w-full"
            placeholder={locale === "fa" ? "انتخاب تاریخ" : "Select date"}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">تا تاریخ</Label>
          <DatePicker
            value={localFilters.dateTo}
            onChange={(date: Value) => {
              if (date && typeof date === "object" && "toDate" in date) {
                const isoDate = date.toDate().toISOString().split("T")[0];
                setLocalFilters({ ...localFilters, dateTo: isoDate });
              } else if (!date) {
                setLocalFilters({ ...localFilters, dateTo: "" });
              }
            }}
            calendar={locale === "fa" ? persian : gregorian}
            locale={locale === "fa" ? persian_fa : gregorian_en}
            format={locale === "fa" ? "YYYY/MM/DD" : "YYYY-MM-DD"}
            className={cn("purple", isMobile && "rmdp-mobile")}
            calendarPosition={locale === "fa" ? "bottom-right" : "bottom-left"}
            inputClass={cn(
              "w-full px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              isMobile ? "h-12 text-base" : "h-10"
            )}
            containerClassName="w-full"
            placeholder={locale === "fa" ? "انتخاب تاریخ" : "Select date"}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          size={isMobile ? "lg" : "md"}
          className={cn("flex-1", isMobile && "text-base")}
          onClick={handleReset}
          disabled={isLoading}
        >
          {t("filters.reset")}
        </Button>
        <Button
          size={isMobile ? "lg" : "md"}
          className={cn("flex-1", isMobile && "text-base")}
          onClick={handleApply}
          disabled={isLoading}
        >
          {isLoading ? "در حال اعمال..." : "اعمال فیلتر"}
          {activeFiltersCount > 0 && !isLoading && (
            <Badge variant="secondary" className="ms-2 bg-white/20 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-lg font-bold">
              {t("filters.title")}
            </DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto p-4 pb-8">
            <FilterContent />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("filters.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <FilterContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
