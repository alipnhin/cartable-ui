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
import { Check, ChevronsUpDown } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";
import { PersianDatePicker } from "@/components/ui/persian-datepicker";
import AccountSelector from "@/components/common/AccountSelector";

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: OrderStatus | "";
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
  isLoading?: boolean;
}

export function FilterSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onReset,
  isLoading = false,
}: FilterSheetProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] = useState(filters);
  const [statusOpen, setStatusOpen] = useState(false);
  const isInitializedRef = useRef(false);

  // فقط یکبار وقتی دیالوگ باز می‌شود فیلترها را sync می‌کنیم
  useEffect(() => {
    if (open && !isInitializedRef.current) {
      setLocalFilters(filters);
      isInitializedRef.current = true;
    }
    if (!open) {
      isInitializedRef.current = false;
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

  const handleStatusSelect = (status: OrderStatus | "") => {
    setLocalFilters((prev) => ({ ...prev, status }));
    setStatusOpen(false);
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const emptyFilters = {
      status: "" as OrderStatus | "",
      search: "",
      orderTitle: "",
      orderNumber: "",
      trackingId: "",
      dateFrom: "",
      dateTo: "",
      accountId: "",
    };
    setLocalFilters(emptyFilters);
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

  // محتوای فیلترها - به صورت JSX نه function component
  const filterContent = (
    <div className="space-y-6">
      {/* عنوان دستور پرداخت */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("filters.orderTitleLabel")}
        </Label>
        <Input
          placeholder={t("filters.orderTitlePlaceholder")}
          value={localFilters.orderTitle}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, orderTitle: e.target.value }))
          }
          className={cn("h-12", isMobile && "h-12 text-base")}
        />
      </div>

      {/* شماره دستور پرداخت */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("filters.orderNumberLabel")}
        </Label>
        <Input
          placeholder={t("filters.orderNumberPlaceholder")}
          value={localFilters.orderNumber}
          onChange={(e) =>
            setLocalFilters((prev) => ({
              ...prev,
              orderNumber: e.target.value,
            }))
          }
          className={cn("h-10", isMobile && "h-12 text-base")}
        />
      </div>

      {/* کد رهگیری */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t("filters.trackingIdLabel")}
        </Label>
        <Input
          placeholder={t("filters.trackingIdPlaceholder")}
          value={localFilters.trackingId}
          onChange={(e) =>
            setLocalFilters((prev) => ({ ...prev, trackingId: e.target.value }))
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
            setLocalFilters((prev) => ({ ...prev, search: e.target.value }))
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
            setLocalFilters((prev) => ({ ...prev, accountId: value }))
          }
          showAllOption={true}
        />
      </div>

      {/* Status Single-select Combobox */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.status")}</Label>
        {isMobile ? (
          <button
            type="button"
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
                className="w-full justify-between h-12"
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
            <PopoverContent className="w-75 p-0" align="start">
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
                    {statusOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={String(option.value)}
                        onSelect={() => handleStatusSelect(option.value)}
                      >
                        <Check
                          className={cn(
                            "me-2 h-4 w-4",
                            localFilters.status === option.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* Mobile Drawer for Status Selection */}
      {isMobile && (
        <Drawer open={statusOpen} onOpenChange={setStatusOpen}>
          <DrawerContent className="max-h-[70vh]">
            <DrawerHeader>
              <DrawerTitle>{t("filters.status")}</DrawerTitle>
            </DrawerHeader>
            <div className="overflow-y-auto p-4 space-y-2">
              <button
                type="button"
                onClick={() => handleStatusSelect("")}
                className={cn(
                  "w-full flex items-center gap-3 p-4 rounded-lg text-base text-start transition-colors h-12",
                  !localFilters.status
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                {!localFilters.status && <Check className="h-5 w-5" />}
                <span className="flex-1">{t("filters.allStatuses")}</span>
              </button>
              {statusOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => handleStatusSelect(option.value)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-lg text-base text-start transition-colors",
                    localFilters.status === option.value
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted"
                  )}
                >
                  {localFilters.status === option.value && (
                    <Check className="h-5 w-5" />
                  )}
                  <span className="flex-1">{option.label}</span>
                </button>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("filters.fromDate")}</Label>
          <PersianDatePicker
            value={localFilters.dateFrom}
            onChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, dateFrom: value }))
            }
            placeholder={t("common.selectDate")}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t("filters.toDate")}</Label>
          <PersianDatePicker
            value={localFilters.dateTo}
            onChange={(value) =>
              setLocalFilters((prev) => ({ ...prev, dateTo: value }))
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
          <div className="overflow-y-auto p-4 pb-8">{filterContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {t("filters.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">{filterContent}</div>
      </DialogContent>
    </Dialog>
  );
}
