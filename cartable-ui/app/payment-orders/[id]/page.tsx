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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  FileText,
  Users,
  History,
  BarChart3,
  AlertCircle,
  FileX,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FixHeader } from "@/components/layout/Fix-Header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getWithdrawalOrderDetails,
  getWithdrawalStatistics,
  getWithdrawalTransactions,
  inquiryOrderById,
  inquiryTransactionById,
  sendToBank,
  exportOrderTransactionsToExcel,
  downloadBlobAsFile,
} from "@/services/paymentOrdersService";
import { ExportProgressDialog, ExportStatus } from "@/app/reports/components/export-progress-dialog";
import {
  sendOperationOtp,
  approvePayment,
} from "@/services/cartableService";
import {
  WithdrawalOrderDetails,
  WithdrawalStatistics,
  WithdrawalTransaction,
  TransactionFilterParams,
  PaymentStatusEnum,
  OperationTypeEnum,
} from "@/types/api";
import { OtpDialog } from "@/components/common/otp-dialog";

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

  // Dialog states
  const [showSendToBankDialog, setShowSendToBankDialog] = useState(false);

  // OTP dialog state
  const [otpDialog, setOtpDialog] = useState<{
    open: boolean;
    type: "approve" | "reject";
    isRequestingOtp: boolean;
  }>({
    open: false,
    type: "approve",
    isRequestingOtp: false,
  });

  // Export state
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<ExportStatus>("idle");
  const [exportError, setExportError] = useState<string>("");

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
      setError(t("paymentOrders.detailsFetchError"));
      toast({
        title: t("common.error"),
        description: t("paymentOrders.detailsFetchError"),
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
        title: t("common.error"),
        description: t("paymentOrders.transactionsFetchError"),
        variant: "error",
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  /**
   * استعلام دستور پرداخت
   */
  const handleInquiryOrder = async () => {
    if (!session?.accessToken || !orderId) return;

    try {
      await inquiryOrderById(orderId, session.accessToken);

      toast({
        title: t("common.success"),
        description: t("paymentOrders.inquiryOrderSuccess"),
        variant: "success",
      });

      // ریلود کامل صفحه
      await reloadPage();
    } catch (err: any) {
      console.error("Error inquiring order:", err);

      // نمایش پیام خطای دقیق‌تر از API
      const errorMessage = err?.response?.data?.message ||
                          err?.response?.data?.error ||
                          err?.message ||
                          t("paymentOrders.inquiryOrderError");

      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "error",
      });
    }
  };

  /**
   * نمایش دایالوگ تایید ارسال به بانک
   */
  const confirmSendToBank = () => {
    setShowSendToBankDialog(true);
  };

  /**
   * ارسال به بانک
   */
  const handleSendToBank = async () => {
    if (!session?.accessToken || !orderId) return;

    setShowSendToBankDialog(false);

    try {
      const message = await sendToBank(orderId, session.accessToken);

      toast({
        title: t("common.success"),
        description: message || t("paymentOrders.sendToBankSuccess"),
        variant: "success",
      });

      // ریلود کامل صفحه
      await reloadPage();
    } catch (err) {
      console.error("Error sending to bank:", err);
      toast({
        title: t("common.error"),
        description: t("paymentOrders.sendToBankError"),
        variant: "error",
      });
    }
  };

  /**
   * ریلود کامل صفحه
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

  /**
   * استعلام تراکنش
   */
  const handleInquiryTransaction = async (transactionId: string) => {
    if (!session?.accessToken) return;

    try {
      await inquiryTransactionById(transactionId, session.accessToken);

      toast({
        title: t("common.success"),
        description: t("paymentOrders.inquiryTransactionSuccess"),
        variant: "success",
      });

      // فقط لیست تراکنش‌ها را refresh کن (نه کل صفحه)
      await refreshTransactions();
    } catch (err) {
      console.error("Error inquiring transaction:", err);
      toast({
        title: t("common.error"),
        description: t("paymentOrders.inquiryTransactionError"),
        variant: "error",
      });
    }
  };

  /**
   * تایید دستور پرداخت (مرحله 1: درخواست OTP)
   */
  const handleApprove = async () => {
    if (!session?.accessToken || !orderId) return;

    // نمایش دیالوگ در حالت loading
    setOtpDialog({
      open: true,
      type: "approve",
      isRequestingOtp: true,
    });

    try {
      // مرحله 1: درخواست ارسال کد OTP
      await sendOperationOtp(
        {
          objectId: orderId,
          operation: OperationTypeEnum.ApproveCartablePayment,
        },
        session.accessToken
      );

      // موفقیت - نمایش فرم OTP
      setOtpDialog({
        open: true,
        type: "approve",
        isRequestingOtp: false,
      });

      toast({
        title: t("common.success"),
        description: t("paymentOrders.otpSentSuccess"),
        variant: "success",
      });
    } catch (err) {
      console.error("Error requesting OTP for approve:", err);
      toast({
        title: t("common.error"),
        description: t("paymentOrders.otpSendError"),
        variant: "error",
      });
      // بستن دیالوگ در صورت خطا
      setOtpDialog({ open: false, type: "approve", isRequestingOtp: false });
    }
  };

  /**
   * رد دستور پرداخت (مرحله 1: درخواست OTP)
   */
  const handleReject = async () => {
    if (!session?.accessToken || !orderId) return;

    // نمایش دیالوگ در حالت loading
    setOtpDialog({
      open: true,
      type: "reject",
      isRequestingOtp: true,
    });

    try {
      // مرحله 1: درخواست ارسال کد OTP
      await sendOperationOtp(
        {
          objectId: orderId,
          operation: OperationTypeEnum.RejectCartablePayment,
        },
        session.accessToken
      );

      // موفقیت - نمایش فرم OTP
      setOtpDialog({
        open: true,
        type: "reject",
        isRequestingOtp: false,
      });

      toast({
        title: t("common.success"),
        description: t("paymentOrders.otpSentSuccess"),
        variant: "success",
      });
    } catch (err) {
      console.error("Error requesting OTP for reject:", err);
      toast({
        title: t("common.error"),
        description: t("paymentOrders.otpSendError"),
        variant: "error",
      });
      // بستن دیالوگ در صورت خطا
      setOtpDialog({ open: false, type: "reject", isRequestingOtp: false });
    }
  };

  /**
   * تایید کد OTP و انجام عملیات (مرحله 2: تایید یا رد با OTP)
   */
  const handleOtpConfirm = async (otp: string) => {
    if (!session?.accessToken || !orderId) return;

    const operationType =
      otpDialog.type === "approve"
        ? OperationTypeEnum.ApproveCartablePayment
        : OperationTypeEnum.RejectCartablePayment;

    try {
      await approvePayment(
        {
          operationType,
          withdrawalOrderId: orderId,
          otpCode: otp,
        },
        session.accessToken
      );

      toast({
        title: t("common.success"),
        description:
          otpDialog.type === "approve"
            ? t("paymentOrders.orderApprovedSuccess")
            : t("paymentOrders.orderRejectedSuccess"),
        variant: "success",
      });

      // بستن دیالوگ
      setOtpDialog({ open: false, type: "approve", isRequestingOtp: false });

      // ریلود کامل صفحه
      await reloadPage();
    } catch (err) {
      console.error("Error confirming OTP:", err);
      toast({
        title: t("common.error"),
        description: t("paymentOrders.otpInvalid"),
        variant: "error",
      });
      throw err; // برای نمایش خطا در OtpDialog
    }
  };

  /**
   * ارسال مجدد کد OTP
   */
  const handleOtpResend = async () => {
    if (!session?.accessToken || !orderId) return;

    const operationType =
      otpDialog.type === "approve"
        ? OperationTypeEnum.ApproveCartablePayment
        : OperationTypeEnum.RejectCartablePayment;

    try {
      await sendOperationOtp(
        {
          objectId: orderId,
          operation: operationType,
        },
        session.accessToken
      );

      toast({
        title: t("common.success"),
        description: t("paymentOrders.otpResentSuccess"),
        variant: "success",
      });
    } catch (err) {
      console.error("Error resending OTP:", err);
      toast({
        title: t("common.error"),
        description: t("paymentOrders.otpResendError"),
        variant: "error",
      });
      throw err;
    }
  };

  /**
   * دانلود فایل اکسل تراکنش‌ها
   */
  const handleExportExcel = async () => {
    if (!session?.accessToken || !orderId) return;

    setExportDialogOpen(true);
    setExportStatus("preparing");
    setExportError("");

    try {
      setExportStatus("downloading");
      const blob = await exportOrderTransactionsToExcel(orderId, session.accessToken);
      const filename = `transactions-${orderDetails?.orderId || orderId}-${new Date().toISOString().split("T")[0]}.xlsx`;
      downloadBlobAsFile(blob, filename);
      setExportStatus("success");
    } catch (error) {
      console.error("Error exporting transactions:", error);
      setExportError(t("paymentOrders.exportError"));
      setExportStatus("error");
    }
  };

  /**
   * لغو دانلود
   */
  const handleCancelExport = () => {
    setExportDialogOpen(false);
    setExportStatus("idle");
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

  // Loading state with Skeleton
  if (isLoading) {
    return (
      <>
        <FixHeader returnUrl="/payment-orders" />
        <div className="container mx-auto p-4 md:p-6 space-y-6 mt-14">
          {/* Header Skeleton */}
          <Card className="p-6">
            <div className="flex flex-wrap sm:flex-nowrap gap-4 mb-8">
              <Skeleton className="w-16 h-16 rounded-lg shrink-0" />
              <div className="flex-1 space-y-3">
                <Skeleton className="h-6 w-48" />
                <div className="flex flex-wrap gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-24" />
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>

            {/* Info Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {[1, 2].map((col) => (
                <div key={col} className="flex flex-col gap-4">
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </Card>

          {/* Tabs Skeleton */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-10 w-28 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Content Skeleton */}
          <Card className="p-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          </Card>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <FixHeader returnUrl="/payment-orders" />
        <div className="container mx-auto p-4 md:p-6 mt-14">
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {t("paymentOrders.errorTitle")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {error}
                </p>
              </div>
              <Link
                href="/payment-orders"
                className="inline-flex items-center gap-2 mt-2 text-primary hover:underline text-sm font-medium"
              >
                <ArrowRight className="h-4 w-4" />
                {t("paymentOrders.backToList")}
              </Link>
            </div>
          </Card>
        </div>
      </>
    );
  }

  // 404 state - Order not found
  if (!orderDetails) {
    return (
      <>
        <FixHeader returnUrl="/payment-orders" />
        <div className="container mx-auto p-4 md:p-6 mt-14">
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <FileX className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="text-lg font-semibold text-foreground">
                  {t("paymentOrders.orderNotFound")}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {t("paymentOrders.orderNotFoundText")}
                </p>
              </div>
              <Link
                href="/payment-orders"
                className="inline-flex items-center gap-2 mt-2 text-primary hover:underline text-sm font-medium"
              >
                <ArrowRight className="h-4 w-4" />
                {t("paymentOrders.backToList")}
              </Link>
            </div>
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
  const canSendToBank = orderDetails.status === PaymentStatusEnum.OwnersApproved;

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
      <FixHeader returnUrl="/payment-orders">
        <Button
          variant="ghost"
          size="sm"
          onClick={reloadPage}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          {t("common.refresh")}
        </Button>
      </FixHeader>
      <div className="container mx-auto p-4 md:p-6 space-y-6 mt-14">
        {/* Header با کارت‌های آماری */}
        <OrderDetailHeader
          order={orderForHeader}
          canInquiry={canInquiry}
          canApproveReject={canApproveReject}
          canSendToBank={canSendToBank}
          onInquiry={handleInquiryOrder}
          onApprove={handleApprove}
          onReject={handleReject}
          onSendToBank={confirmSendToBank}
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
                <span className="hidden sm:inline">{t("paymentOrders.statisticsTab")}</span>
                <span className="sm:hidden">{t("paymentOrders.statisticsShort")}</span>
              </TabsTrigger>

              <TabsTrigger value="transactions">
                <FileText className="" />
                <span className="hidden sm:inline">{t("paymentOrders.transactionsTab")}</span>
                <span className="sm:hidden">{t("paymentOrders.transactionsShort")}</span>
                <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                  {totalTransactions}
                </span>
              </TabsTrigger>

              <TabsTrigger value="approvers">
                <Users />
                <span className="hidden sm:inline">{t("paymentOrders.approversTab")}</span>
                <span className="sm:hidden">{t("paymentOrders.approversShort")}</span>
                <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                  {orderDetails.approvers.length}
                </span>
              </TabsTrigger>

              <TabsTrigger value="history">
                <History />
                <span className="hidden sm:inline">{t("paymentOrders.historyTab")}</span>
                <span className="sm:hidden">{t("paymentOrders.historyShort")}</span>
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
              onInquiryTransaction={handleInquiryTransaction}
              onExport={handleExportExcel}
            />
          </TabsContent>

          <TabsContent value="approvers" className="mt-0">
            <OrderDetailApprovers approvers={orderDetails.approvers} />
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <OrderDetailHistory changeHistory={orderDetails.changeHistory} />
          </TabsContent>
        </Tabs>

        {/* دایالوگ تایید ارسال به بانک */}
        <AlertDialog open={showSendToBankDialog} onOpenChange={setShowSendToBankDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تایید ارسال به بانک</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از ارسال این دستور پرداخت به بانک اطمینان دارید؟
                <br />
                <br />
                پس از ارسال، دستور پرداخت به سیستم بانک ارسال خواهد شد و قابل ویرایش نخواهد بود.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>انصراف</AlertDialogCancel>
              <AlertDialogAction onClick={handleSendToBank}>
                تایید و ارسال
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* دایالوگ OTP برای تایید/رد */}
        <OtpDialog
          open={otpDialog.open}
          onOpenChange={(open) =>
            setOtpDialog((prev) => ({ ...prev, open }))
          }
          title={
            otpDialog.type === "approve"
              ? "تایید دستور پرداخت"
              : "رد دستور پرداخت"
          }
          description={
            otpDialog.type === "approve"
              ? "برای تایید دستور پرداخت، کد ارسال شده به موبایل خود را وارد نمایید"
              : "برای رد دستور پرداخت، کد ارسال شده به موبایل خود را وارد نمایید"
          }
          onConfirm={handleOtpConfirm}
          onResend={handleOtpResend}
          isRequestingOtp={otpDialog.isRequestingOtp}
        />

        {/* دایالوگ پیشرفت دانلود اکسل */}
        <ExportProgressDialog
          open={exportDialogOpen}
          onOpenChange={setExportDialogOpen}
          status={exportStatus}
          totalRecords={totalTransactions}
          onCancel={handleCancelExport}
          errorMessage={exportError}
        />
      </div>
    </>
  );
}
