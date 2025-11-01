"use client";

import { useState, useMemo } from "react";
import { mockTransactions } from "@/mocks/mockTransactions";
import { Transaction, TransactionStatus } from "@/types/transaction";
import { Card } from "@/components/ui/card";
import { TransactionFilters } from "./components/transaction-filters";
import { TransactionTable } from "./components/transaction-table";
import { TransactionStats } from "./components/transaction-stats";
import { TransactionCharts } from "./components/transaction-charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTranslation from "@/hooks/useTranslation";
import { BarChart3, Table as TableIcon } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/layout";

export interface TransactionFiltersType {
  search: string;
  status: TransactionStatus[];
  fromDate: string;
  toDate: string;
  minAmount: number;
  maxAmount: number;
  accountIds: string[];
  orderIds: string[];
}

export default function TransactionReportsPage() {
  const { t } = useTranslation();

  const [filters, setFilters] = useState<TransactionFiltersType>({
    search: "",
    status: [],
    fromDate: "",
    toDate: "",
    minAmount: 0,
    maxAmount: 0,
    accountIds: [],
    orderIds: [],
  });

  // فیلتر کردن تراکنش‌ها
  const filteredTransactions = useMemo(() => {
    let result = [...mockTransactions];

    // جستجو
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.ownerName?.toLowerCase().includes(query) ||
          tx.destinationIban?.toLowerCase().includes(query) ||
          tx.accountNumber?.toLowerCase().includes(query)
      );
    }

    // وضعیت
    if (filters.status.length > 0) {
      result = result.filter((tx) => filters.status.includes(tx.status));
    }

    // تاریخ
    if (filters.fromDate) {
      result = result.filter((tx) => tx.createdDateTime >= filters.fromDate);
    }
    if (filters.toDate) {
      result = result.filter((tx) => tx.createdDateTime <= filters.toDate);
    }

    // مبلغ
    if (filters.minAmount > 0) {
      result = result.filter((tx) => tx.amount >= filters.minAmount);
    }
    if (filters.maxAmount > 0) {
      result = result.filter((tx) => tx.amount <= filters.maxAmount);
    }

    // حساب
    if (filters.accountIds.length > 0) {
      result = result.filter((tx) => filters.accountIds.includes(tx.orderId));
    }

    return result;
  }, [filters]);

  return (
    <AppLayout>
      <div className="space-y-4">
        <PageHeader
          title={t("reports.transactionReports")}
          description={t("reports.transactionReportsDesc")}
        />

        {/* آمارهای کلی */}
        <TransactionStats transactions={filteredTransactions} />

        {/* فیلترها */}
        <TransactionFilters filters={filters} onFiltersChange={setFilters} />

        {/* تب‌های نمایش */}
        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="table" className="gap-2">
              <TableIcon className="h-4 w-4" />
              {t("reports.tableView")}
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              {t("reports.chartView")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table" className="mt-6">
            <TransactionTable transactions={filteredTransactions} />
          </TabsContent>

          <TabsContent value="charts" className="mt-6">
            <TransactionCharts transactions={filteredTransactions} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
