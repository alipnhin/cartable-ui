"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Account {
  id: string;
  name: string;
  accountNumber: string;
}

interface DashboardFiltersProps {
  accounts: Account[];
  onFilterApply: (filters: {
    bankGatewayId?: string;
    fromDate: string;
    toDate: string;
  }) => void;
}

export default function DashboardFilters({
  accounts,
  onFilterApply,
}: DashboardFiltersProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>("");

  // Default to last 7 days
  const getDefaultDates = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    return {
      from: weekAgo.toISOString(),
      to: today.toISOString(),
    };
  };

  const [dateRange, setDateRange] = useState(getDefaultDates());

  const handleApplyFilters = () => {
    onFilterApply({
      bankGatewayId: selectedAccount || undefined,
      fromDate: dateRange.from,
      toDate: dateRange.to,
    });
  };

  const formatDateDisplay = () => {
    const from = new Date(dateRange.from);
    const to = new Date(dateRange.to);
    return `${from.toLocaleDateString("fa-IR")} تا ${to.toLocaleDateString("fa-IR")}`;
  };

  return (
    <Card className="mb-5 shadow-sm animate-fade-in">
      <div className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          {/* Filter Icon */}
          <div className="hidden lg:flex items-center">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center ml-3">
              <Filter className="w-5 h-5 text-primary" />
            </div>
          </div>

          {/* Account Selection */}
          <div className="flex-1 min-w-[200px] lg:flex-initial lg:w-64">
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="همه حساب‌ها" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه حساب‌ها</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} - {account.accountNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Display - You can replace this with a proper date picker */}
          <div className="flex-1 min-w-[200px] lg:flex-initial">
            <Button
              variant="outline"
              className="w-full justify-start text-right"
              onClick={() => {
                // TODO: Open date picker
                console.log("Open date picker");
              }}
            >
              <Calendar className="w-4 h-4 ml-2 text-muted-foreground" />
              <span className="text-muted-foreground">{formatDateDisplay()}</span>
            </Button>
          </div>

          {/* Apply Filter Button */}
          <div className="w-full lg:w-auto lg:mr-auto">
            <Button
              onClick={handleApplyFilters}
              className="w-full lg:w-auto gap-2"
            >
              <Search className="w-4 h-4" />
              <span className="hidden md:inline text-sm">اعمال فیلتر</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
