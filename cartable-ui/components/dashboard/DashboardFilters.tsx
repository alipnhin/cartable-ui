"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Filter, Search, Calendar } from "lucide-react";
import { Label } from "@/components/ui/label";
import AccountSelector from "@/components/common/AccountSelector";
import PersianDatePicker from "@/components/common/PersianDatePicker";
import useTranslation from "@/hooks/useTranslation";

interface DashboardFiltersProps {
  onFilterApply: (filters: {
    bankGatewayId?: string;
    fromDate: string;
    toDate: string;
  }) => void;
  initialFilters?: {
    bankGatewayId?: string;
    fromDate: string;
    toDate: string;
  };
}

export default function DashboardFilters({
  onFilterApply,
  initialFilters,
}: DashboardFiltersProps) {
  const { t, locale } = useTranslation();

  // Default to last 7 days
  const getDefaultDates = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      from: weekAgo.toISOString().split("T")[0],
      to: today.toISOString().split("T")[0],
    };
  };

  const defaultDates = getDefaultDates();
  const defaults = initialFilters || {
    bankGatewayId: undefined,
    fromDate: defaultDates.from,
    toDate: defaultDates.to,
  };

  const [selectedAccount, setSelectedAccount] = useState<string>(
    defaults.bankGatewayId || "all"
  );
  const [fromDate, setFromDate] = useState<string>(
    defaults.fromDate || defaultDates.from
  );
  const [toDate, setToDate] = useState<string>(
    defaults.toDate || defaultDates.to
  );

  const handleApplyFilters = () => {
    onFilterApply({
      bankGatewayId:
        selectedAccount && selectedAccount !== "all"
          ? selectedAccount
          : undefined,
      fromDate: fromDate
        ? new Date(fromDate).toISOString()
        : new Date().toISOString(),
      toDate: toDate
        ? new Date(toDate).toISOString()
        : new Date().toISOString(),
    });
  };

  return (
    <Card className="mb-5 animate-fade-in border-2">
      <div className="p-4 lg:p-5">
        <div className="flex flex-wrap items-end gap-3 lg:gap-4">
          {/* Account Selection */}
          <div className="flex-1 min-w-[200px] lg:flex-initial lg:w-56">
            <Label className="text-xs font-medium mb-1.5 block text-muted-foreground">
              {t("dashboard.filters.bankAccount")}
            </Label>
            <AccountSelector
              value={selectedAccount}
              onValueChange={setSelectedAccount}
              placeholder={t("dashboard.filters.allAccounts")}
              showAllOption={true}
              className="bg-background h-9"
            />
          </div>

          {/* From Date */}
          <div className="flex-1 min-w-[160px] lg:flex-initial lg:w-48">
            <Label className="text-xs font-medium mb-1.5 block text-muted-foreground">
              {t("dashboard.filters.fromDate")}
            </Label>
            <PersianDatePicker
              value={fromDate}
              onChange={setFromDate}
              placeholder={t("common.selectDate")}
              locale={locale === "fa" ? "fa" : "en"}
            />
          </div>

          {/* To Date */}
          <div className="flex-1 min-w-[160px] lg:flex-initial lg:w-48">
            <Label className="text-xs font-medium mb-1.5 block text-muted-foreground">
              {t("dashboard.filters.toDate")}
            </Label>
            <PersianDatePicker
              value={toDate}
              onChange={setToDate}
              placeholder={t("common.selectDate")}
              locale={locale === "fa" ? "fa" : "en"}
            />
          </div>

          {/* Apply Filter Button */}
          <div className="w-full lg:w-auto lg:ms-auto">
            <Button
              onClick={handleApplyFilters}
              className="w-full lg:w-auto gap-2 h-9"
            >
              <Search className="w-4 h-4" />
              {t("dashboard.filters.applyFilter")}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
