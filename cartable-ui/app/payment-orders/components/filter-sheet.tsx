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

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    status: OrderStatus[];
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
}

export function FilterSheet({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onReset,
}: FilterSheetProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [localFilters, setLocalFilters] = useState(filters);
  const [accountOpen, setAccountOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

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

  const handleStatusToggle = (status: OrderStatus) => {
    const newStatuses = localFilters.status.includes(status)
      ? localFilters.status.filter((s) => s !== status)
      : [...localFilters.status, status];
    setLocalFilters({ ...localFilters, status: newStatuses });
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
    localFilters.status.length +
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
                  (localFilters.accountId === "all" || !localFilters.accountId)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                )}
              >
                {(localFilters.accountId === "all" || !localFilters.accountId) && (
                  <Check className="h-5 w-5" />
                )}
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

      {/* Status Multi-select Combobox */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t("filters.status")}</Label>
        {isMobile ? (
          <button
            onClick={() => setStatusOpen(true)}
            className="w-full flex items-center justify-between h-12 px-4 rounded-lg border border-input bg-background text-start text-base"
          >
            <span className="truncate">
              {localFilters.status.length > 0
                ? `${localFilters.status.length} مورد انتخاب شده`
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
                  {localFilters.status.length > 0
                    ? `${localFilters.status.length} مورد انتخاب شده`
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
                    {statusOptions.map((option) => {
                      const isSelected = localFilters.status.includes(
                        option.value
                      );
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleStatusToggle(option.value)}
                        >
                          <div
                            className={cn(
                              "me-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className="h-3 w-3" />
                          </div>
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
        {/* Selected Status Badges */}
        {localFilters.status.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {localFilters.status.map((status) => {
              const option = statusOptions.find((opt) => opt.value === status);
              return (
                <Badge
                  key={status}
                  variant="secondary"
                  className="text-xs px-2 py-1"
                >
                  {option?.label}
                  <X
                    className="ms-1 h-3 w-3 cursor-pointer"
                    onClick={() => handleStatusToggle(status)}
                  />
                </Badge>
              );
            })}
          </div>
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
              {statusOptions.map((option) => {
                const isSelected = localFilters.status.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusToggle(option.value)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-lg text-base text-start transition-colors",
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded border",
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-input"
                      )}
                    >
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                    <span className="flex-1">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* Date Range */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label className="text-sm font-medium">از تاریخ</Label>
          <Input
            type="date"
            value={localFilters.dateFrom}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, dateFrom: e.target.value })
            }
            className={cn("h-10", isMobile && "h-12 text-base")}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">تا تاریخ</Label>
          <Input
            type="date"
            value={localFilters.dateTo}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, dateTo: e.target.value })
            }
            className={cn("h-10", isMobile && "h-12 text-base")}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          variant="outline"
          className={cn("flex-1", isMobile && "h-12 text-base")}
          onClick={handleReset}
        >
          {t("filters.reset")}
        </Button>
        <Button
          className={cn("flex-1", isMobile && "h-12 text-base")}
          onClick={handleApply}
        >
          اعمال فیلتر
          {activeFiltersCount > 0 && (
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
