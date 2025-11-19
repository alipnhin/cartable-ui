"use client";

import { useEffect, useState, useRef } from "react";
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
import { cn } from "@/lib/utils";
import { PersianDatePicker } from "@/components/ui/persian-datepicker";
import { AccountSelector } from "@/components/common/AccountSelector";

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
  const [statusOpen, setStatusOpen] = useState(false);
  const prevOpenRef = useRef(open);

  // فقط وقتی FilterSheet باز می‌شود، filters را به localFilters کپی می‌کنیم
  // این مشکل از دست رفتن focus در textbox را حل می‌کند
  useEffect(() => {
    // فقط وقتی از بسته به باز تغییر کند
    if (open && !prevOpenRef.current) {
      setLocalFilters(filters);
    }
    prevOpenRef.current = open;
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

  const FilterContent = () => (
    <div className="space-y-6">
      {/* عنوان دستور پرداخت */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.orderTitleLabel")}</Label>
        <Input
          placeholder={t("filters.orderTitlePlaceholder")}
          value={localFilters.orderTitle}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, orderTitle: e.target.value })
          }
          className={cn("h-10", isMobile && "h-12 text-base")}
        />
      </div>

      {/* شماره دستور پرداخت */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.orderNumberLabel")}</Label>
        <Input
          placeholder={t("filters.orderNumberPlaceholder")}
          value={localFilters.orderNumber}
          onChange={(e) =>
            setLocalFilters({ ...localFilters, orderNumber: e.target.value })
          }
          className={cn("h-10", isMobile && "h-12 text-base")}
        />
      </div>

      {/* کد رهگیری */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.trackingIdLabel")}</Label>
        <Input
          placeholder={t("filters.trackingIdPlaceholder")}
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

      {/* Account Selector */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.account")}</Label>
        <AccountSelector
          value={localFilters.accountId || ""}
          onValueChange={(value) =>
            setLocalFilters({ ...localFilters, accountId: value })
          }
          includeAll={true}
        />
      </div>

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
                  <CommandEmpty>{t("filters.notFound")}</CommandEmpty>
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
          <Label className="text-sm font-medium">{t("filters.fromDate")}</Label>
          <PersianDatePicker
            value={localFilters.dateFrom}
            onChange={(value) =>
              setLocalFilters({ ...localFilters, dateFrom: value })
            }
            placeholder={t("common.selectDate")}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("filters.toDate")}</Label>
          <PersianDatePicker
            value={localFilters.dateTo}
            onChange={(value) =>
              setLocalFilters({ ...localFilters, dateTo: value })
            }
            placeholder={t("common.selectDate")}
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
          {isLoading ? t("filters.applyingFilter") : t("filters.applyFilter")}
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
