"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { TransactionFilters } from "./components/transaction-filters";
import { TransactionTable } from "./components/transaction-table";
import { TransactionStats } from "./components/transaction-stats";
import { TransactionCharts } from "./components/transaction-charts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTranslation from "@/hooks/useTranslation";
import { BarChart3, Table as TableIcon } from "lucide-react";
import { AppLayout, PageHeader } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getTransactionsList,
  exportTransactionsToExcel,
  downloadBlobAsFile,
  getDefaultDateRange,
  TransactionItem,
  TransactionsRequest,
} from "@/services/transactionService";
import { toast } from "sonner";

export interface TransactionFiltersType {
  search: string;
  status: number | null;
  paymentType: number | null;
  fromDate: string;
  toDate: string;
  bankGatewayId: string;
  nationalCode: string;
  destinationIban: string;
  accountNumber: string;
  orderId: string;
  transferFromDate: string;
  transferToDate: string;
}

export default function TransactionReportsPage() {
  const { t } = useTranslation();
  const { data: session } = useSession();

  // Get default date range (last 7 days)
  const defaultDates = getDefaultDateRange();

  const [filters, setFilters] = useState<TransactionFiltersType>({
    search: "",
    status: null,
    paymentType: null,
    fromDate: defaultDates.fromDate,
    toDate: defaultDates.toDate,
    bankGatewayId: "",
    nationalCode: "",
    destinationIban: "",
    accountNumber: "",
    orderId: "",
    transferFromDate: "",
    transferToDate: "",
  });

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Fetch transactions from API
  const fetchTransactions = useCallback(async () => {
    if (!session?.accessToken) return;

    setLoading(true);
    try {
      const request: TransactionsRequest = {
        pageNumber: currentPage,
        pageSize: pageSize,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      // Add optional filters
      if (filters.status !== null) request.status = filters.status;
      if (filters.paymentType !== null) request.paymentType = filters.paymentType;
      if (filters.bankGatewayId && filters.bankGatewayId !== "all") {
        request.bankGatewayId = filters.bankGatewayId;
      }
      if (filters.nationalCode) request.nationalCode = filters.nationalCode;
      if (filters.destinationIban) request.destinationIban = filters.destinationIban;
      if (filters.accountNumber) request.accountNumber = filters.accountNumber;
      if (filters.orderId) request.orderId = filters.orderId;
      if (filters.transferFromDate) request.transferFromDate = filters.transferFromDate;
      if (filters.transferToDate) request.transferToDate = filters.transferToDate;

      const response = await getTransactionsList(request, session.accessToken);
      setTransactions(response.data);
      setTotalRecords(response.recordsFiltered);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("خطا در دریافت لیست تراکنش‌ها");
    } finally {
      setLoading(false);
    }
  }, [session, currentPage, pageSize, filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Handle export to Excel
  const handleExport = async () => {
    if (!session?.accessToken) return;

    setExporting(true);
    try {
      const request: TransactionsRequest = {
        pageNumber: 1,
        pageSize: totalRecords || 10000, // Export all records
        fromDate: filters.fromDate,
        toDate: filters.toDate,
      };

      // Add optional filters (same as fetch)
      if (filters.status !== null) request.status = filters.status;
      if (filters.paymentType !== null) request.paymentType = filters.paymentType;
      if (filters.bankGatewayId && filters.bankGatewayId !== "all") {
        request.bankGatewayId = filters.bankGatewayId;
      }
      if (filters.nationalCode) request.nationalCode = filters.nationalCode;
      if (filters.destinationIban) request.destinationIban = filters.destinationIban;
      if (filters.accountNumber) request.accountNumber = filters.accountNumber;
      if (filters.orderId) request.orderId = filters.orderId;
      if (filters.transferFromDate) request.transferFromDate = filters.transferFromDate;
      if (filters.transferToDate) request.transferToDate = filters.transferToDate;

      const blob = await exportTransactionsToExcel(request, session.accessToken);
      const filename = `transactions-${new Date().toISOString().split("T")[0]}.xlsx`;
      downloadBlobAsFile(blob, filename);
      toast.success("فایل اکسل با موفقیت دانلود شد");
    } catch (error) {
      console.error("Error exporting transactions:", error);
      toast.error("خطا در دانلود فایل اکسل");
    } finally {
      setExporting(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: TransactionFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Loading skeleton
  if (loading && transactions.length === 0) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <PageHeader
            title={t("reports.transactionReports")}
            description={t("reports.transactionReportsDesc")}
          />

          {/* Stats skeleton */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </Card>
            ))}
          </div>

          {/* Filters skeleton */}
          <Card className="p-4">
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
            </div>
          </Card>

          {/* Table skeleton */}
          <Card className="p-6">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <PageHeader
          title={t("reports.transactionReports")}
          description={t("reports.transactionReportsDesc")}
        />

        {/* آمارهای کلی */}
        <TransactionStats transactions={transactions} />

        {/* فیلترها */}
        <TransactionFilters filters={filters} onFiltersChange={handleFiltersChange} />

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
            <TransactionTable
              transactions={transactions}
              totalRecords={totalRecords}
              currentPage={currentPage}
              pageSize={pageSize}
              loading={loading}
              exporting={exporting}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              onExport={handleExport}
            />
          </TabsContent>

          <TabsContent value="charts" className="mt-6">
            <TransactionCharts transactions={transactions} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
