"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";
import { TransactionFilters } from "./components/transaction-filters";
import { TransactionTable } from "./components/transaction-table";
import { TransactionStats } from "./components/transaction-stats";
import useTranslation from "@/hooks/useTranslation";
import { AppLayout, PageHeader } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getTransactionsList,
  exportTransactionsToExcel,
  downloadBlobAsFile,
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

  // Get default date range (last 7 days) - use useMemo to avoid recreation
  const defaultDates = useMemo(() => {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);
    return {
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
    };
  }, []);

  // Individual filter states (like payment-orders page)
  const [status, setStatus] = useState<number | null>(null);
  const [paymentType, setPaymentType] = useState<number | null>(null);
  const [fromDate, setFromDate] = useState(defaultDates.fromDate);
  const [toDate, setToDate] = useState(defaultDates.toDate);
  const [bankGatewayId, setBankGatewayId] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [destinationIban, setDestinationIban] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [orderId, setOrderId] = useState("");
  const [transferFromDate, setTransferFromDate] = useState("");
  const [transferToDate, setTransferToDate] = useState("");
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Combined filters for components
  const filters = useMemo(
    () => ({
      search,
      status,
      paymentType,
      fromDate,
      toDate,
      bankGatewayId,
      nationalCode,
      destinationIban,
      accountNumber,
      orderId,
      transferFromDate,
      transferToDate,
    }),
    [
      search,
      status,
      paymentType,
      fromDate,
      toDate,
      bankGatewayId,
      nationalCode,
      destinationIban,
      accountNumber,
      orderId,
      transferFromDate,
      transferToDate,
    ]
  );

  // Fetch transactions from API
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session?.accessToken) return;

      setLoading(true);
      try {
        const request: TransactionsRequest = {
          pageNumber: currentPage,
          pageSize: pageSize,
          fromDate: fromDate,
          toDate: toDate,
        };

        // Add optional filters
        if (status !== null) request.status = status;
        if (paymentType !== null) request.paymentType = paymentType;
        if (bankGatewayId && bankGatewayId !== "all") {
          request.bankGatewayId = bankGatewayId;
        }
        if (nationalCode) request.nationalCode = nationalCode;
        if (destinationIban) request.destinationIban = destinationIban;
        if (accountNumber) request.accountNumber = accountNumber;
        if (orderId) request.orderId = orderId;
        if (transferFromDate) request.transferFromDate = transferFromDate;
        if (transferToDate) request.transferToDate = transferToDate;

        const response = await getTransactionsList(request, session.accessToken);
        setTransactions(response.data);
        setTotalRecords(response.recordsFiltered);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("خطا در دریافت لیست تراکنش‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [
    session?.accessToken,
    currentPage,
    pageSize,
    fromDate,
    toDate,
    status,
    paymentType,
    bankGatewayId,
    nationalCode,
    destinationIban,
    accountNumber,
    orderId,
    transferFromDate,
    transferToDate,
  ]);

  // Handle export to Excel
  const handleExport = async () => {
    if (!session?.accessToken) return;

    setExporting(true);
    try {
      const request: TransactionsRequest = {
        pageNumber: 1,
        pageSize: totalRecords || 10000,
        fromDate: fromDate,
        toDate: toDate,
      };

      // Add optional filters
      if (status !== null) request.status = status;
      if (paymentType !== null) request.paymentType = paymentType;
      if (bankGatewayId && bankGatewayId !== "all") {
        request.bankGatewayId = bankGatewayId;
      }
      if (nationalCode) request.nationalCode = nationalCode;
      if (destinationIban) request.destinationIban = destinationIban;
      if (accountNumber) request.accountNumber = accountNumber;
      if (orderId) request.orderId = orderId;
      if (transferFromDate) request.transferFromDate = transferFromDate;
      if (transferToDate) request.transferToDate = transferToDate;

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
    setSearch(newFilters.search);
    setStatus(newFilters.status);
    setPaymentType(newFilters.paymentType);
    setFromDate(newFilters.fromDate);
    setToDate(newFilters.toDate);
    setBankGatewayId(newFilters.bankGatewayId);
    setNationalCode(newFilters.nationalCode);
    setDestinationIban(newFilters.destinationIban);
    setAccountNumber(newFilters.accountNumber);
    setOrderId(newFilters.orderId);
    setTransferFromDate(newFilters.transferFromDate);
    setTransferToDate(newFilters.transferToDate);
    setCurrentPage(1);
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
  if (loading && (transactions?.length ?? 0) === 0) {
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

        {/* جدول */}
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
      </div>
    </AppLayout>
  );
}
