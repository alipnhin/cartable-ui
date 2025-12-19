"use client";

import { useCallback, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { OrderDetailHeader } from "./components/order-detail-header";
import { OrderDetailTransactions } from "./components/order-detail-transactions";
import { OrderDetailApprovers } from "./components/order-detail-approvers";
import { OrderDetailHistory } from "./components/order-detail-history";
import { OrderDetailStatistics } from "./components/order-detail-statistics";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { getErrorMessage } from "@/lib/error-handler";
import { mapOrderDetailsToHeader } from "@/lib/order-utils";
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
import { ExportProgressDialog } from "@/app/reports/components/export-progress-dialog";
import { TransactionFilterParams } from "@/types/api";
import { OtpDialog } from "@/components/common/otp-dialog";
import { InquiryLoadingDialog } from "./components/inquiry-loading-dialog";
import { usePaymentOrderDetailQuery } from "@/hooks/usePaymentOrderDetailQuery";
import { usePaymentOrderTransactionsQuery } from "@/hooks/usePaymentOrderTransactionsQuery";
import { usePaymentOrderActions } from "@/hooks/usePaymentOrderActions";
import { usePaymentOrderPermissions } from "@/hooks/usePaymentOrderPermissions";
import { usePaymentOrderOtpFlow } from "@/hooks/usePaymentOrderOtpFlow";
import { usePaymentOrderExport } from "@/hooks/usePaymentOrderExport";
import { PageTitle } from "@/components/common/page-title";

export default function PaymentOrderDetailPage() {
  const params = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  const orderId = params.id as string;

  // Transaction pagination and filters
  const [transactionPage, setTransactionPage] = useState(1);
  const [transactionPageSize] = useState(25);
  const [transactionFilters, setTransactionFilters] = useState<
    Partial<TransactionFilterParams>
  >({});

  // Dialog states
  const [showSendToBankDialog, setShowSendToBankDialog] = useState(false);

  // Inquiry loading states (برای نمایش دایالوگ لودینگ)
  const [inquiringTransactionId, setInquiringTransactionId] = useState<
    string | null
  >(null);

  // React Query hooks
  const {
    data: orderData,
    isLoading,
    error: queryError,
    refetch: refetchOrderData,
  } = usePaymentOrderDetailQuery(orderId);

  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = usePaymentOrderTransactionsQuery({
    withdrawalOrderId: orderId,
    pageNumber: transactionPage,
    pageSize: transactionPageSize,
    ...transactionFilters,
  });

  // Payment order actions
  const actions = usePaymentOrderActions(orderId);

  // ✅ Custom hooks for business logic
  const permissions = usePaymentOrderPermissions({
    orderStatus: orderData?.orderDetails?.status,
    statistics: orderData?.statistics,
  });

  const otpFlow = usePaymentOrderOtpFlow(orderId);
  const exportFlow = usePaymentOrderExport();

  /**
   * استعلام دستور پرداخت
   */
  const handleInquiryOrder = useCallback(() => {
    actions.inquiry.mutate(undefined, {
      onSuccess: () => {
        toast({
          title: t("common.success"),
          description: t("paymentOrders.inquiryOrderSuccess"),
          variant: "success",
        });
      },
      onError: (err) => {
        const errorMessage = getErrorMessage(err);
        toast({
          title: t("common.error"),
          description: errorMessage,
          variant: "error",
        });
      },
    });
  }, [actions.inquiry, toast, t]);

  /**
   * نمایش دایالوگ تایید ارسال به بانک
   */
  const confirmSendToBank = useCallback(() => {
    setShowSendToBankDialog(true);
  }, []);

  /**
   * ارسال به بانک
   */
  const handleSendToBank = useCallback(() => {
    setShowSendToBankDialog(false);

    actions.sendToBank.mutate(undefined, {
      onSuccess: (message) => {
        toast({
          title: t("common.success"),
          description: message || t("paymentOrders.sendToBankSuccess"),
          variant: "success",
        });
      },
      onError: (err) => {
        const errorMessage = getErrorMessage(err);
        toast({
          title: t("common.error"),
          description: errorMessage,
          variant: "error",
        });
      },
    });
  }, [actions.sendToBank, toast, t]);

  /**
   * ریلود کامل صفحه - بدون await غیرضروری
   */
  const reloadPage = useCallback(() => {
    refetchOrderData();
    refetchTransactions();
  }, [refetchOrderData, refetchTransactions]);

  /**
   * آپدیت لیست تراکنش‌ها (بعد از استعلام یک تراکنش)
   */
  const refreshTransactions = useCallback(() => {
    refetchTransactions();
  }, [refetchTransactions]);

  /**
   * استعلام تراکنش
   */
  const handleInquiryTransaction = useCallback(
    (transactionId: string) => {
      setInquiringTransactionId(transactionId);

      actions.inquiryTransaction.mutate(transactionId, {
        onSuccess: () => {
          toast({
            title: t("common.success"),
            description: t("paymentOrders.inquiryTransactionSuccess"),
            variant: "success",
          });
        },
        onError: (err) => {
          const errorMessage = getErrorMessage(err);
          toast({
            title: t("common.error"),
            description: errorMessage,
            variant: "error",
          });
        },
        onSettled: () => {
          setInquiringTransactionId(null);
        },
      });
    },
    [actions.inquiryTransaction, toast, t]
  );

  /**
   * دانلود فایل اکسل تراکنش‌ها
   */
  const handleExportExcel = useCallback(async () => {
    await exportFlow.startExport(
      orderId,
      orderData?.orderDetails.orderId || orderId
    );
  }, [orderId, orderData?.orderDetails.orderId, exportFlow]);

  /**
   * آپدیت فیلترهای تراکنش
   */
  const handleFilterChange = (filters?: Partial<TransactionFilterParams>) => {
    setTransactionFilters(filters || {});
    setTransactionPage(1); // ریست pagination
  };

  // Extract data از React Query
  const orderDetails = orderData?.orderDetails;
  const statistics = orderData?.statistics;
  const transactions = transactionsData?.items || [];
  const totalTransactionPages = transactionsData?.totalPageCount || 0;
  const totalTransactions = transactionsData?.totalItemCount || 0;

  // Error از React Query
  const error = queryError ? getErrorMessage(queryError) : null;

  // تبدیل orderDetails به فرمت مورد نیاز header با useMemo (برای جلوگیری از re-render)
  // IMPORTANT: All hooks must be called before any early returns
  const orderForHeader = useMemo(() => {
    if (!orderDetails) return null;
    return mapOrderDetailsToHeader(orderDetails);
  }, [orderDetails]);

  // محاسبه تعداد امضاها
  const approvalCount = useMemo(() => {
    if (!orderDetails) return 0;
    return orderDetails.approvers.filter((a) => a.status === "Accepted").length;
  }, [orderDetails?.approvers]);

  const totalApprovers = useMemo(() => {
    return orderDetails?.approvers.length || 0;
  }, [orderDetails?.approvers]);

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
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg"
                >
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
                    <div
                      key={row}
                      className="flex justify-between items-center"
                    >
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

  return (
    <>
      <PageTitle title={orderDetails?.name || t("paymentOrders.detailTitle")} />
      <FixHeader returnUrl="/payment-orders">
        <Button variant="dashed" onClick={reloadPage} className="gap-2">
          <RefreshCw />
          {t("common.refresh")}
        </Button>
      </FixHeader>
      <div className="container mx-auto p-4 md:p-6 space-y-6 mt-14">
        {/* Header با کارت‌های آماری */}
        {orderForHeader && (
          <OrderDetailHeader
            order={orderForHeader}
            canInquiry={permissions.canInquiry}
            canApproveReject={permissions.canApproveReject}
            canSendToBank={permissions.canSendToBank}
            onInquiry={handleInquiryOrder}
            onApprove={otpFlow.startApproveFlow}
            onReject={otpFlow.startRejectFlow}
            onSendToBank={confirmSendToBank}
            waitForBankCount={permissions.waitForBankCount}
            approvalCount={approvalCount}
            totalApprovers={totalApprovers}
          />
        )}

        {/* تب‌های جزئیات */}
        <Tabs defaultValue="statistics" className="w-full space-y-6 ">
          {/* Tab Navigation */}
          <div className="rounded-lg  bg-card py-3 px-2 transition-all duration-200 hover:shadow-lg hover:border-primary/20 border-2">
            <TabsList
              className="w-full justify-center bg-transparent h-auto gap-2 flex-wrap"
              size="md"
              variant="button"
            >
              <TabsTrigger value="statistics">
                <BarChart3 />{" "}
                <span className="hidden sm:inline">
                  {t("paymentOrders.statisticsTab")}
                </span>
                <span className="sm:hidden">
                  {t("paymentOrders.statisticsShort")}
                </span>
              </TabsTrigger>

              <TabsTrigger value="transactions">
                <FileText className="" />
                <span className="hidden sm:inline">
                  {t("paymentOrders.transactionsTab")}
                </span>
                <span className="sm:hidden">
                  {t("paymentOrders.transactionsShort")}
                </span>
                <span className="text-xs bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                  {totalTransactions}
                </span>
              </TabsTrigger>

              <TabsTrigger value="approvers">
                <Users />
                <span className="hidden sm:inline">
                  {t("paymentOrders.approversTab")}
                </span>
                <span className="sm:hidden">
                  {t("paymentOrders.approversShort")}
                </span>
              </TabsTrigger>

              <TabsTrigger value="history">
                <History />
                <span className="hidden sm:inline">
                  {t("paymentOrders.historyTab")}
                </span>
                <span className="sm:hidden">
                  {t("paymentOrders.historyShort")}
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
              onFilterChange={handleFilterChange}
              onInquiryTransaction={handleInquiryTransaction}
              onExport={handleExportExcel}
              inquiringTransactionId={inquiringTransactionId}
            />
          </TabsContent>

          <TabsContent value="approvers" className="mt-0">
            {orderDetails && (
              <OrderDetailApprovers approvers={orderDetails.approvers} />
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            {orderDetails && (
              <OrderDetailHistory changeHistory={orderDetails.changeHistory} />
            )}
          </TabsContent>
        </Tabs>

        {/* دایالوگ تایید ارسال به بانک */}
        <AlertDialog
          open={showSendToBankDialog}
          onOpenChange={setShowSendToBankDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>تایید ارسال به بانک</AlertDialogTitle>
              <AlertDialogDescription>
                آیا از ارسال این دستور پرداخت به بانک اطمینان دارید؟
                <br />
                <br />
                پس از ارسال، دستور پرداخت به سیستم بانک ارسال خواهد شد و قابل
                ویرایش نخواهد بود.
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
          open={otpFlow.otpDialog.open}
          onOpenChange={(open) =>
            open ? undefined : otpFlow.closeDialog()
          }
          title={
            otpFlow.otpDialog.type === "approve"
              ? "تایید دستور پرداخت"
              : "رد دستور پرداخت"
          }
          description={
            otpFlow.otpDialog.type === "approve"
              ? "برای تایید دستور پرداخت، کد ارسال شده به موبایل خود را وارد نمایید"
              : "برای رد دستور پرداخت، کد ارسال شده به موبایل خود را وارد نمایید"
          }
          onConfirm={otpFlow.confirmOtp}
          onResend={otpFlow.resendOtp}
          isRequestingOtp={otpFlow.otpDialog.isRequestingOtp}
        />

        {/* دایالوگ پیشرفت دانلود اکسل */}
        <ExportProgressDialog
          open={exportFlow.dialogOpen}
          onOpenChange={(open) => !open && exportFlow.cancelExport()}
          status={exportFlow.status}
          totalRecords={totalTransactions}
          onCancel={exportFlow.cancelExport}
          errorMessage={exportFlow.error}
        />

        {/* دایالوگ لودینگ استعلام دستور پرداخت */}
        <InquiryLoadingDialog open={actions.inquiry.isPending} type="order" />

        {/* دایالوگ لودینگ استعلام تراکنش */}
        <InquiryLoadingDialog
          open={inquiringTransactionId !== null}
          type="transaction"
        />
      </div>
    </>
  );
}
