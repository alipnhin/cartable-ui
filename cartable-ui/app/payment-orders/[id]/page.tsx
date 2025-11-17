"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { OrderDetailHeader } from "./components/order-detail-header";
import { OrderDetailTransactions } from "./components/order-detail-transactions";
import { OrderDetailApprovers } from "./components/order-detail-approvers";
import { OrderDetailHistory } from "./components/order-detail-history";
import { OrderDetailStatistics } from "./components/order-detail-statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowRight,
  FileText,
  Users,
  History,
  BarChart3,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { FixHeader } from "@/components/layout/Fix-Header";
import {
  getWithdrawalOrderDetails,
  getWithdrawalStatistics,
  getWithdrawalTransactions,
} from "@/services/paymentOrdersService";
import {
  WithdrawalOrderDetails,
  WithdrawalStatistics,
  WithdrawalTransaction,
  TransactionFilterParams,
  PaymentStatusEnum,
} from "@/types/api";

export default function PaymentOrderDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: session } = useSession();
  const orderId = params.id as string;

  // State for order details
  const [orderDetails, setOrderDetails] = useState<WithdrawalOrderDetails | null>(null);
  const [statistics, setStatistics] = useState<WithdrawalStatistics | null>(null);
  const [transactions, setTransactions] = useState<WithdrawalTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Transaction pagination and filters
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionPageSize] = useState(25); // پیشفرض 25
  const [totalTransactionPages, setTotalTransactionPages] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);

  /**
   * واکشی جزئیات دستور پرداخت و آمار
   */
  const fetchOrderData = async () => {
    if (!session?.accessToken || !orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      // واکشی موازی جزئیات و آمار
      const [detailsData, statsData] = await Promise.all([
        getWithdrawalOrderDetails(orderId, session.accessToken),
        getWithdrawalStatistics(orderId, session.accessToken),
      ]);

      setOrderDetails(detailsData);
      setStatistics(statsData);
    } catch (err) {
      console.error("Error fetching order data:", err);
      setError("خطا در دریافت اطلاعات دستور پرداخت");
      toast({
        title: t("toast.error"),
        description: "خطا در دریافت اطلاعات دستور پرداخت",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * واکشی لیست تراکنش‌ها
   */
  const fetchTransactions = async (filters?: Partial<TransactionFilterParams>) => {
    if (!session?.accessToken || !orderId) return;

    setIsLoadingTransactions(true);

    try {
      const params: TransactionFilterParams = {
        withdrawalOrderId: orderId,
        pageNumber: transactionPage,
        pageSize: transactionPageSize,
        ...filters,
      };

      const response = await getWithdrawalTransactions(params, session.accessToken);

      setTransactions(response.items);
      setTotalTransactionPages(response.totalPageCount);
      setTotalTransactions(response.totalItemCount);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      toast({
        title: t("toast.error"),
        description: "خطا در دریافت لیست تراکنش‌ها",
        variant: "error",
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  /**
   * ریلود کامل صفحه (بعد از استعلام دستور پرداخت)
   */
  const reloadPage = async () => {
    await fetchOrderData();
    await fetchTransactions();
  };

  /**
   * آپدیت لیست تراکنش‌ها (بعد از استعلام یک تراکنش)
   */
  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  // واکشی اولیه داده‌ها
  useEffect(() => {
    fetchOrderData();
  }, [orderId, session?.accessToken]);

  // واکشی تراکنش‌ها
  useEffect(() => {
    if (orderDetails) {
      fetchTransactions();
    }
  }, [orderId, session?.accessToken, transactionPage, orderDetails]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <FixHeader returnUrl="/payment-orders" />
        <div className="container mx-auto p-4 md:p-6 mt-14">
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">در حال بارگذاری...</p>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // Error state
  if (error || !orderDetails) {
    return (
      <>
        <FixHeader returnUrl="/payment-orders" />
        <div className="container mx-auto p-4 md:p-6 mt-14">
          <Card className="p-8 text-center">
            <p className="text-lg text-muted-foreground">
              {error || "دستور پرداخت یافت نشد"}
            </p>
            <Link
              href="/payment-orders"
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
            >
              <ArrowRight className="h-4 w-4" />
              بازگشت به لیست
            </Link>
          </Card>
        </div>
      </>
    );
  }

  // تبدیل orderDetails به فرمت مورد نیاز header
  const orderForHeader = {
    id: orderDetails.id,
    orderId: orderDetails.orderId,
    title: orderDetails.name,
    accountSheba: orderDetails.sourceIban,
    bankName: orderDetails.bankName,
    numberOfTransactions: parseInt(orderDetails.numberOfTransactions),
    totalAmount: parseFloat(orderDetails.totalAmount),
    status: orderDetails.status as any, // Map enum
    createdAt: orderDetails.createdDateTime,
    description: orderDetails.description,
    trackingId: orderDetails.trackingId,
    gatewayTitle: orderDetails.gatewayTitle,
    accountTitle: orderDetails.name, // عنوان حساب
    accountNumber: orderDetails.accountNumber,
  };

  const canInquiry = orderDetails.status === PaymentStatusEnum.SubmittedToBank;
  const canApproveReject = orderDetails.status === PaymentStatusEnum.WaitingForOwnersApproval;

  // محاسبه تعداد تراکنش‌های در صف بانک
  const waitForBankCount = statistics
    ? statistics.statusStatistics.breakdown.find(
        (s) => s.status === "WaitForBank"
      )?.count || 0
    : 0;

  // محاسبه تعداد امضاها
  const approvalCount = orderDetails.approvers.filter(
    (a) => a.status === "Accepted"
  ).length;
  const totalApprovers = orderDetails.approvers.length;

  return (
    <>
      <FixHeader returnUrl="/payment-orders" />
      <div className="container mx-auto p-4 md:p-6 space-y-6 mt-14">
        {/* Header با کارت‌های آماری */}
        <OrderDetailHeader
          order={orderForHeader}
          canInquiry={canInquiry}
          canApproveReject={canApproveReject}
          onInquiry={reloadPage}
          onApprove={reloadPage}
          onReject={reloadPage}
          waitForBankCount={waitForBankCount}
          approvalCount={approvalCount}
          totalApprovers={totalApprovers}
        />

        {/* تب‌های جزئیات */}
        <Tabs defaultValue="statistics" className="w-full space-y-6">
          {/* Tab Navigation */}
          <div className="rounded-lg border bg-card p-4">
            <TabsList
              className="w-full justify-center bg-transparent h-auto gap-3 flex-wrap"
              size="lg"
              variant="button"
            >
              <TabsTrigger value="statistics">
                <BarChart3 />{" "}
                <span className="hidden sm:inline">آمار</span>
                <span className="sm:hidden">آمار</span>
              </TabsTrigger>

              <TabsTrigger value="transactions">
                <FileText className="" />
                <span className="hidden sm:inline">تراکنش‌ها</span>
                <span className="sm:hidden">تراکنش‌ها</span>
                <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                  {totalTransactions}
                </span>
              </TabsTrigger>

              <TabsTrigger value="approvers">
                <Users />
                <span className="hidden sm:inline">تاییدکنندگان</span>
                <span className="sm:hidden">تایید</span>
                <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                  {orderDetails.approvers.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="history">
                <History />
                <span className="hidden sm:inline">تاریخچه</span>
                <span className="sm:hidden">تاریخچه</span>
                <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                  {orderDetails.changeHistory.length}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <TabsContent value="statistics" className="mt-0">
            {statistics && <OrderDetailStatistics statistics={statistics} />}
          </TabsContent>

          <TabsContent value="transactions" className="mt-0">
            <OrderDetailTransactions
              transactions={transactions}
              isLoading={isLoadingTransactions}
              pageNumber={transactionPage}
              totalPages={totalTransactionPages}
              totalItems={totalTransactions}
              pageSize={transactionPageSize}
              onPageChange={setTransactionPage}
              onRefresh={refreshTransactions}
              onFilterChange={fetchTransactions}
            />
          </TabsContent>

          <TabsContent value="approvers" className="mt-0">
            <OrderDetailApprovers approvers={orderDetails.approvers} />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <OrderDetailHistory changeHistory={orderDetails.changeHistory} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
