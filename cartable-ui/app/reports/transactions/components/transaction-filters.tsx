"use client";

import { TransactionFiltersType } from "../page";
import { TransactionStatus } from "@/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PersianDatePicker } from "@/components/ui/persian-datepicker";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Filter, X, Calendar, DollarSign, CheckSquare } from "lucide-react";
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

  const statusOptions = [
    { value: TransactionStatus.BankSucceeded, label: t("status.succeeded") },
    { value: TransactionStatus.WaitForExecution, label: t("status.pending") },
    { value: TransactionStatus.WaitForBank, label: t("status.pending") },
    { value: TransactionStatus.Failed, label: t("status.failed") },
    { value: TransactionStatus.BankRejected, label: t("status.bankRejected") },
  ];

  const handleStatusToggle = (status: TransactionStatus) => {
    const newStatuses = localFilters.status.includes(status)
      ? localFilters.status.filter((s) => s !== status)
      : [...localFilters.status, status];
    setLocalFilters({ ...localFilters, status: newStatuses });
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: TransactionFiltersType = {
      search: "",
      status: [],
      fromDate: "",
      toDate: "",
      minAmount: 0,
      maxAmount: 0,
      accountIds: [],
      orderIds: [],
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFiltersCount =
    filters.status.length +
    (filters.fromDate ? 1 : 0) +
    (filters.toDate ? 1 : 0) +
    (filters.minAmount > 0 ? 1 : 0) +
    (filters.maxAmount > 0 ? 1 : 0);

  const filterContent = (
    <div className="space-y-6">
      {/* بخش وضعیت */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">
            {t("filters.status")}
          </Label>
        </div>
        <Separator />
        <div className="space-y-3">
          {statusOptions.map((option) => (
            <div
              key={option.value}
              className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id={`status-${option.value}`}
                checked={localFilters.status.includes(option.value)}
                onCheckedChange={() => handleStatusToggle(option.value)}
              />
              <Label
                htmlFor={`status-${option.value}`}
                className="text-sm font-normal cursor-pointer flex-1"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* بخش بازه تاریخ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">
            {t("reports.dateRange")}
          </Label>
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

      {/* بخش بازه مبلغ */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <Label className="text-base font-semibold">
            {t("reports.amountRange")}
          </Label>
        </div>
        <Separator />
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="minAmount" className="text-sm text-muted-foreground">
              {t("reports.minAmount")}
            </Label>
            <Input
              id="minAmount"
              type="number"
              value={localFilters.minAmount || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  minAmount: Number(e.target.value),
                })
              }
              placeholder="0"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxAmount" className="text-sm text-muted-foreground">
              {t("reports.maxAmount")}
            </Label>
            <Input
              id="maxAmount"
              type="number"
              value={localFilters.maxAmount || ""}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  maxAmount: Number(e.target.value),
                })
              }
              placeholder="0"
              className="w-full"
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
                  size={isMobile ? "md" : "default"}
                  className="gap-2 min-w-fit"
                >
                  <Filter className="h-4 w-4" />
                  {!isMobile && t("filters.advancedFilters")}
                  {activeFiltersCount > 0 && (
                    <span className="ms-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full min-w-[20px] text-center">
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
                    <Button onClick={handleApplyFilters} className="flex-1 gap-2">
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
                {/* وضعیت‌های فعال */}
                {filters.status.map((status) => {
                  const option = statusOptions.find((opt) => opt.value === status);
                  return (
                    <Badge
                      key={status}
                      variant="secondary"
                      className="gap-1 hover:bg-secondary/80 transition-colors"
                    >
                      {option?.label}
                      <button
                        onClick={() => {
                          onFiltersChange({
                            ...filters,
                            status: filters.status.filter((s) => s !== status),
                          });
                        }}
                        className="hover:bg-muted rounded-full p-0.5 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}

                {/* تاریخ از */}
                {filters.fromDate && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    {t("reports.fromDate")}: {filters.fromDate}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, fromDate: "" });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* تاریخ تا */}
                {filters.toDate && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    {t("reports.toDate")}: {filters.toDate}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, toDate: "" });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* حداقل مبلغ */}
                {filters.minAmount > 0 && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    {t("reports.minAmount")}: {filters.minAmount.toLocaleString("fa-IR")}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, minAmount: 0 });
                      }}
                      className="hover:bg-muted rounded-full p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}

                {/* حداکثر مبلغ */}
                {filters.maxAmount > 0 && (
                  <Badge
                    variant="secondary"
                    className="gap-1 hover:bg-secondary/80 transition-colors"
                  >
                    {t("reports.maxAmount")}: {filters.maxAmount.toLocaleString("fa-IR")}
                    <button
                      onClick={() => {
                        onFiltersChange({ ...filters, maxAmount: 0 });
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
