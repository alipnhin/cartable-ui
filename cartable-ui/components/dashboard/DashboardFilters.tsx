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
    <Card className="mb-5 shadow-sm animate-fade-in">
      <div className="p-5">
        <div className="flex flex-wrap items-end gap-4">
          {/* Filter Icon */}
          <div className="hidden lg:flex items-center">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center ml-3">
              <Filter className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Account Selection */}
          <div className="flex-1 min-w-[200px] lg:flex-initial lg:w-64">
            <Label className="text-sm font-medium mb-2 block">
              {t("dashboard.filters.bankAccount")}
            </Label>
            <AccountSelector
              value={selectedAccount}
              onValueChange={setSelectedAccount}
              placeholder={t("dashboard.filters.allAccounts")}
              showAllOption={true}
              className="bg-background"
            />
          </div>

          {/* From Date */}
          <div className="flex-1 min-w-[180px] lg:flex-initial lg:w-56">
            <Label className="text-sm font-medium mb-2  flex items-center gap-2">
              <Calendar className="w-4 h-4" />
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
          <div className="flex-1 min-w-[180px] lg:flex-initial lg:w-56">
            <Label className="text-sm font-medium mb-2  flex items-center gap-2">
              <Calendar className="w-4 h-4" />
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
          <div className="w-full lg:w-auto lg:mr-auto">
            <Button
              onClick={handleApplyFilters}
              className="w-full lg:w-auto gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {t("dashboard.filters.applyFilter")}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
