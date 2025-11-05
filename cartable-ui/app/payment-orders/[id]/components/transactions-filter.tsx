"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { TransactionStatus, PaymentMethodEnum } from "@/types/transaction";

interface TransactionsFilterProps {
  filters: {
    status: TransactionStatus[];
    paymentType: PaymentMethodEnum[];
    search: string;
    beneficiaryName: string;
    iban: string;
    trackingCode: string;
  };
  onFiltersChange: (filters: TransactionsFilterProps["filters"]) => void;
  onReset: () => void;
}

const statusOptions = [
  { value: "BankSucceeded", label: "تراکنش انجام شده" },
  { value: "BankRejected", label: "رد شده توسط بانک" },
  { value: "Failed", label: "ناموفق" },
  { value: "WaitForBank", label: "در صف پردازش بانک" },
  { value: "Registered", label: "ثبت شده" },
];

const paymentTypeOptions = [
  { value: "Internal", label: "داخلی" },
  { value: "Paya", label: "پایا" },
  { value: "Satna", label: "ساتنا" },
];

export function TransactionsFilter({
  filters,
  onFiltersChange,
  onReset,
}: TransactionsFilterProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const activeFiltersCount =
    localFilters.status.length +
    localFilters.paymentType.length +
    (localFilters.search ? 1 : 0) +
    (localFilters.beneficiaryName ? 1 : 0) +
    (localFilters.iban ? 1 : 0) +
    (localFilters.trackingCode ? 1 : 0);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const resetFilters = {
      status: [],
      paymentType: [],
      search: "",
      beneficiaryName: "",
      iban: "",
      trackingCode: "",
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
    onReset();
  };

  const toggleStatus = (status: TransactionStatus) => {
    setLocalFilters((prev) => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter((s) => s !== status)
        : [...prev.status, status],
    }));
  };

  const togglePaymentType = (type: PaymentMethodEnum) => {
    setLocalFilters((prev) => ({
      ...prev,
      paymentType: prev.paymentType.includes(type)
        ? prev.paymentType.filter((t) => t !== type)
        : [...prev.paymentType, type],
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="h-4 w-4" />
          فیلتر
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="rounded-full px-2 py-0">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>فیلتر تراکنش‌ها</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label>جستجو</Label>
            <Input
              placeholder="جستجو در تراکنش‌ها..."
              value={localFilters.search}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, search: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>نام ذینفع</Label>
            <Input
              placeholder="نام و نام خانوادگی..."
              value={localFilters.beneficiaryName}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  beneficiaryName: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>شماره شبا</Label>
            <Input
              placeholder="IR..."
              value={localFilters.iban}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, iban: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>کد رهگیری بانک</Label>
            <Input
              placeholder="کد رهگیری..."
              value={localFilters.trackingCode}
              onChange={(e) =>
                setLocalFilters({
                  ...localFilters,
                  trackingCode: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>وضعیت تراکنش</Label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={
                    localFilters.status.includes(
                      option.value as TransactionStatus
                    )
                      ? "primary"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    toggleStatus(option.value as TransactionStatus)
                  }
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>نوع تراکنش</Label>
            <div className="flex flex-wrap gap-2">
              {paymentTypeOptions.map((option) => (
                <Badge
                  key={option.value}
                  variant={
                    localFilters.paymentType.includes(
                      option.value as PaymentMethodEnum
                    )
                      ? "primary"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() =>
                    togglePaymentType(option.value as PaymentMethodEnum)
                  }
                >
                  {option.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <X className="h-4 w-4 me-2" />
              پاک کردن
            </Button>
            <Button onClick={handleApply} className="flex-1">
              اعمال فیلتر
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
