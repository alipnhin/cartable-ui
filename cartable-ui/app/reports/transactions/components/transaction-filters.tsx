"use client";

import { TransactionFiltersType } from "../page";
import { TransactionStatus } from "@/types/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, InputWrapper } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Search, Filter, X, Calendar } from "lucide-react";
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
    (filters.status.length > 0 ? 1 : 0) +
    (filters.fromDate ? 1 : 0) +
    (filters.toDate ? 1 : 0) +
    (filters.minAmount > 0 ? 1 : 0) +
    (filters.maxAmount > 0 ? 1 : 0);

  const filterContent = (
    <div className="space-y-4">
      {/* وضعیت */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          {t("filters.status")}
        </label>
        <div className="space-y-2">
          {statusOptions.map((option) => (
            <div key={option.value} className="flex items-center gap-2">
              <Checkbox
                checked={localFilters.status.includes(option.value)}
                onCheckedChange={() => handleStatusToggle(option.value)}
              />
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* بازه تاریخ */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          {t("reports.dateRange")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="date"
            value={localFilters.fromDate}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, fromDate: e.target.value })
            }
            placeholder={t("reports.fromDate")}
          />
          <Input
            type="date"
            value={localFilters.toDate}
            onChange={(e) =>
              setLocalFilters({ ...localFilters, toDate: e.target.value })
            }
            placeholder={t("reports.toDate")}
          />
        </div>
      </div>

      {/* بازه مبلغ */}
      <div>
        <label className="text-sm font-medium mb-2 block">
          {t("reports.amountRange")}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            value={localFilters.minAmount || ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                minAmount: Number(e.target.value),
              })
            }
            placeholder={t("reports.minAmount")}
          />
          <Input
            type="number"
            value={localFilters.maxAmount || ""}
            onChange={(e) =>
              setLocalFilters({
                ...localFilters,
                maxAmount: Number(e.target.value),
              })
            }
            placeholder={t("reports.maxAmount")}
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-lg">{t("filters.title")}</CardTitle>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">
              {activeFiltersCount} {t("filters.activeFilters")}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <InputWrapper>
          <Search />
          <Input
            placeholder={t("filters.searchPlaceholder")}
            value={filters.search}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
            className="pe-10"
          />
        </InputWrapper>
        {/* فیلترهای پیشرفته */}
        <div className="flex gap-2">
          {isMobile ? (
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" className="flex-1">
                  <Filter className="h-4 w-4 me-2" />
                  {t("filters.advancedFilters")}
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="ms-2">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>{t("filters.advancedFilters")}</DrawerTitle>
                </DrawerHeader>
                <div className="px-4 max-h-[60vh] overflow-y-auto">
                  {filterContent}
                </div>
                <DrawerFooter className="flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={handleResetFilters}
                    className="flex-1"
                  >
                    {t("filters.reset")}
                  </Button>
                  <DrawerClose asChild>
                    <Button onClick={handleApplyFilters} className="flex-1">
                      {t("common.buttons.filter")}
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                {filterContent}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleResetFilters}>
                  <X className="h-4 w-4 me-2" />
                  {t("filters.reset")}
                </Button>
                <Button onClick={handleApplyFilters}>
                  <Filter className="h-4 w-4 me-2" />
                  {t("common.buttons.filter")}
                </Button>
              </div>
            </>
          )}
        </div>

        {/* نمایش فیلترهای فعال */}
        {filters.status.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.status.map((status) => {
              const option = statusOptions.find((opt) => opt.value === status);
              return (
                <Badge key={status} variant="secondary">
                  {option?.label}
                  <X
                    className="ms-1 h-3 w-3 cursor-pointer"
                    onClick={() => {
                      onFiltersChange({
                        ...filters,
                        status: filters.status.filter((s) => s !== status),
                      });
                    }}
                  />
                </Badge>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
