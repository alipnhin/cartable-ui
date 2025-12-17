"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { AppLayout, PageHeader } from "@/components/layout";
import { OrderCard, OrderCardSkeleton } from "./components/order-card";
import { DataTable } from "./components/data-table";
import { createColumns } from "./components/columns";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Download,
  X,
  ClipboardCheck,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { OtpDialog } from "@/components/common/otp-dialog";
import { cn } from "@/lib/utils";
import { IStatisticsItems, Statistics } from "./components/statistics";
import { useAccountGroupStore } from "@/store/account-group-store";
import { ErrorState } from "@/components/common/error-state";
import {
  getApproverCartable,
  sendOperationOtp,
  approvePayment,
  sendBatchOperationOtp,
  batchApprovePayments,
} from "@/services/cartableService";
import { mapPaymentListDtosToPaymentOrders } from "@/lib/api-mappers";
import { PaymentOrder } from "@/types/order";
import { OperationTypeEnum } from "@/types/api";
import { getErrorMessage } from "@/lib/error-handler";

export default function MyCartablePage() {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { data: session } = useSession();
  const groupId = useAccountGroupStore((s) => s.groupId);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>(
    {}
  );
  /**
   * State برای مدیریت دیالوگ OTP
   * - isBatchOperation: مشخص می‌کند که آیا عملیات از نوع گروهی است یا تکی
   *   این فلگ بر اساس نوع عملیات (کلیک روی دکمه تکی یا گروهی) تعیین می‌شود،
   *   نه بر اساس تعداد آیتم‌های انتخاب شده
   */
  const [otpDialog, setOtpDialog] = useState<{
    open: boolean;
    type: "approve" | "reject";
    orderIds: string[];
    isRequestingOtp: boolean;
    isBatchOperation: boolean;
  }>({
    open: false,
    type: "approve",
    orderIds: [],
    isRequestingOtp: false,
    isBatchOperation: false,
  });

  /**
   * State مدیریت داده‌های صفحه
   * - orders: لیست دستورهای پرداخت
   * - isLoading: وضعیت بارگذاری داده‌ها
   * - pageNumber, pageSize: اطلاعات صفحه‌بندی
   * - totalItems, totalPages: تعداد کل آیتم‌ها و صفحات
   */
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * واکشی اولیه داده‌ها از API
   * این effect هر بار که شماره صفحه یا توکن تغییر کند، اجرا می‌شود
   */
  useEffect(() => {
    const fetchOrders = async () => {
      if (!session?.accessToken) return;

      setIsLoading(true);
      setError(null);

      try {
        // خواندن accountGroupId از localStorage
        const savedGroupId =
          typeof window !== "undefined"
            ? localStorage.getItem("selected-account-group")
            : null;

        const response = await getApproverCartable(
          {
            pageNumber,
            pageSize,
            orderBy: "createdDateTime",
            accountGroupId: savedGroupId || undefined,
          },
          session.accessToken
        );

        // تبدیل داده‌های API به فرمت داخلی
        const mappedOrders = mapPaymentListDtosToPaymentOrders(response.items);
        setOrders(mappedOrders);
        setTotalItems(response.totalItemCount);
        setTotalPages(response.totalPageCount);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [session?.accessToken, pageNumber, pageSize, groupId]);

  /**
   * بارگذاری مجدد داده‌ها
   * این تابع برای رفرش کردن لیست بعد از عملیات موفق (تأیید/رد) استفاده می‌شود
   * برای جلوگیری از تکرار کد، واکشی داده‌ها در یک تابع جداگانه قرار گرفته است
   */
  const reloadData = useCallback(async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      // خواندن accountGroupId از localStorage
      const savedGroupId =
        typeof window !== "undefined"
          ? localStorage.getItem("selected-account-group")
          : null;

      const response = await getApproverCartable(
        {
          pageNumber,
          pageSize,
          orderBy: "createdDateTime",
          accountGroupId: savedGroupId || undefined,
        },
        session.accessToken
      );

      const mappedOrders = mapPaymentListDtosToPaymentOrders(response.items);
      setOrders(mappedOrders);
      setTotalItems(response.totalItemCount);
      setTotalPages(response.totalPageCount);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, pageNumber, pageSize]);

  /**
   * مدیریت عملیات تأیید تکی
   * این تابع برای تأیید یک دستور پرداخت واحد استفاده می‌شود
   * مراحل:
   * 1. نمایش دیالوگ با حالت loading
   * 2. درخواست ارسال کد OTP به سرور
   * 3. در صورت موفقیت، نمایش فرم ورود کد
   */
  const handleSingleApprove = useCallback(
    async (orderId: string) => {
      if (!session?.accessToken) return;

      // باز کردن دیالوگ با حالت loading
      setOtpDialog({
        open: true,
        type: "approve",
        orderIds: [orderId],
        isRequestingOtp: true,
        isBatchOperation: false, // عملیات تکی
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
          orderIds: [orderId],
          isRequestingOtp: false,
          isBatchOperation: false,
        });

        toast({
          title: t("toast.success"),
          description: t("otp.codeSent"),
          variant: "success",
        });
      } catch (error) {
        // بستن دیالوگ و نمایش خطا
        setOtpDialog({
          open: false,
          type: "approve",
          orderIds: [],
          isRequestingOtp: false,
          isBatchOperation: false,
        });
        toast({
          title: t("toast.error"),
          description: getErrorMessage(error),
          variant: "error",
        });
      }
    },
    [session?.accessToken, t, toast]
  );

  /**
   * مدیریت عملیات رد تکی
   * این تابع برای رد یک دستور پرداخت واحد استفاده می‌شود
   * مراحل:
   * 1. نمایش دیالوگ با حالت loading
   * 2. درخواست ارسال کد OTP به سرور
   * 3. در صورت موفقیت، نمایش فرم ورود کد
   */
  const handleSingleReject = useCallback(
    async (orderId: string) => {
      if (!session?.accessToken) return;

      // باز کردن دیالوگ با حالت loading
      setOtpDialog({
        open: true,
        type: "reject",
        orderIds: [orderId],
        isRequestingOtp: true,
        isBatchOperation: false, // عملیات تکی
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
          orderIds: [orderId],
          isRequestingOtp: false,
          isBatchOperation: false,
        });

        toast({
          title: t("toast.success"),
          description: t("otp.codeSent"),
          variant: "success",
        });
      } catch (error) {
        // بستن دیالوگ و نمایش خطا
        setOtpDialog({
          open: false,
          type: "reject",
          orderIds: [],
          isRequestingOtp: false,
          isBatchOperation: false,
        });
        toast({
          title: t("toast.error"),
          description: getErrorMessage(error),
          variant: "error",
        });
      }
    },
    [session?.accessToken, t, toast]
  );

  /**
   * مدیریت عملیات تأیید گروهی
   * این تابع برای تأیید چندین دستور پرداخت به صورت همزمان استفاده می‌شود
   * توجه: حتی اگر فقط یک آیتم انتخاب شده باشد، از API عملیات گروهی استفاده می‌شود
   * مراحل:
   * 1. دریافت لیست آیتم‌های انتخاب شده
   * 2. نمایش دیالوگ با حالت loading
   * 3. درخواست ارسال کد OTP برای عملیات گروهی
   * 4. در صورت موفقیت، نمایش فرم ورود کد
   */
  const handleBulkApprove = async () => {
    if (!session?.accessToken) return;

    const orderIds = isMobile
      ? selectedOrders
      : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);

    if (orderIds.length === 0) return;

    // باز کردن دیالوگ با حالت loading
    setOtpDialog({
      open: true,
      type: "approve",
      orderIds,
      isRequestingOtp: true,
      isBatchOperation: true, // عملیات گروهی - حتی اگر یک آیتم باشد
    });

    try {
      // مرحله 1: درخواست ارسال کد OTP برای عملیات گروهی
      await sendBatchOperationOtp(
        {
          objectIds: orderIds,
          operation: OperationTypeEnum.ApproveCartablePayment,
        },
        session.accessToken
      );

      // موفقیت - نمایش فرم OTP
      setOtpDialog({
        open: true,
        type: "approve",
        orderIds,
        isRequestingOtp: false,
        isBatchOperation: true,
      });

      toast({
        title: t("toast.success"),
        description: t("otp.codeSent"),
        variant: "success",
      });
    } catch (error) {
      // بستن دیالوگ و نمایش خطا
      setOtpDialog({
        open: false,
        type: "approve",
        orderIds: [],
        isRequestingOtp: false,
        isBatchOperation: false,
      });
      toast({
        title: t("toast.error"),
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  /**
   * مدیریت عملیات رد گروهی
   * این تابع برای رد چندین دستور پرداخت به صورت همزمان استفاده می‌شود
   * توجه: حتی اگر فقط یک آیتم انتخاب شده باشد، از API عملیات گروهی استفاده می‌شود
   * مراحل:
   * 1. دریافت لیست آیتم‌های انتخاب شده
   * 2. نمایش دیالوگ با حالت loading
   * 3. درخواست ارسال کد OTP برای عملیات گروهی
   * 4. در صورت موفقیت، نمایش فرم ورود کد
   */
  const handleBulkReject = async () => {
    if (!session?.accessToken) return;

    const orderIds = isMobile
      ? selectedOrders
      : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);

    if (orderIds.length === 0) return;

    // باز کردن دیالوگ با حالت loading
    setOtpDialog({
      open: true,
      type: "reject",
      orderIds,
      isRequestingOtp: true,
      isBatchOperation: true, // عملیات گروهی - حتی اگر یک آیتم باشد
    });

    try {
      // مرحله 1: درخواست ارسال کد OTP برای عملیات گروهی
      await sendBatchOperationOtp(
        {
          objectIds: orderIds,
          operation: OperationTypeEnum.RejectCartablePayment,
        },
        session.accessToken
      );

      // موفقیت - نمایش فرم OTP
      setOtpDialog({
        open: true,
        type: "reject",
        orderIds,
        isRequestingOtp: false,
        isBatchOperation: true,
      });

      toast({
        title: t("toast.success"),
        description: t("otp.codeSent"),
        variant: "success",
      });
    } catch (error) {
      // بستن دیالوگ و نمایش خطا
      setOtpDialog({
        open: false,
        type: "reject",
        orderIds: [],
        isRequestingOtp: false,
        isBatchOperation: false,
      });
      toast({
        title: t("toast.error"),
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  /**
   * لغو انتخاب همه آیتم‌ها
   * این تابع برای پاک کردن انتخاب‌ها در هر دو حالت موبایل و دسکتاپ استفاده می‌شود
   */
  const handleCancelSelection = () => {
    setSelectedOrders([]);
    setSelectedRowIds({});
  };

  /**
   * تأیید عملیات با کد OTP وارد شده
   * این تابع بر اساس نوع عملیات (تکی یا گروهی) API مناسب را فراخوانی می‌کند
   * تشخیص نوع عملیات از طریق فلگ isBatchOperation انجام می‌شود، نه تعداد آیتم‌ها
   * مراحل:
   * 1. ارسال درخواست تأیید با کد OTP به سرور
   * 2. نمایش پیام موفقیت
   * 3. پاک کردن انتخاب‌ها
   * 4. بارگذاری مجدد لیست برای نمایش تغییرات
   */
  const handleOtpConfirm = async (otp: string) => {
    if (!session?.accessToken) return;

    try {
      const operationType =
        otpDialog.type === "approve"
          ? OperationTypeEnum.ApproveCartablePayment
          : OperationTypeEnum.RejectCartablePayment;

      // تشخیص عملیات تکی یا گروهی بر اساس فلگ، نه تعداد آیتم‌ها
      if (!otpDialog.isBatchOperation) {
        // عملیات تکی
        await approvePayment(
          {
            operationType,
            withdrawalOrderId: otpDialog.orderIds[0],
            otpCode: otp,
          },
          session.accessToken
        );
      } else {
        // عملیات گروهی - حتی اگر فقط یک آیتم انتخاب شده باشد
        await batchApprovePayments(
          {
            objectIds: otpDialog.orderIds,
            operationType,
            otpCode: otp,
          },
          session.accessToken
        );
      }

      const action = otpDialog.type === "approve" ? "تأیید" : "رد";
      const count = otpDialog.orderIds.length;

      toast({
        title: t("toast.success"),
        description: `${count} دستور با موفقیت ${action} شد`,
        variant: "success",
      });

      // پاک کردن انتخاب‌ها
      setSelectedOrders([]);
      setSelectedRowIds({});

      // بارگذاری مجدد لیست برای نمایش تغییرات
      await reloadData();
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: getErrorMessage(error),
        variant: "error",
      });
      throw error; // برای اینکه OTP dialog خطا را نمایش دهد
    }
  };

  /**
   * ارسال مجدد کد OTP
   * این تابع برای ارسال مجدد کد OTP در صورت عدم دریافت یا انقضا استفاده می‌شود
   * بر اساس نوع عملیات (تکی یا گروهی)، API مناسب فراخوانی می‌شود
   */
  const handleOtpResend = async () => {
    if (!session?.accessToken) return;

    try {
      const operationType =
        otpDialog.type === "approve"
          ? OperationTypeEnum.ApproveCartablePayment
          : OperationTypeEnum.RejectCartablePayment;

      // تشخیص عملیات تکی یا گروهی بر اساس فلگ، نه تعداد آیتم‌ها
      if (!otpDialog.isBatchOperation) {
        // ارسال مجدد برای عملیات تکی
        await sendOperationOtp(
          {
            objectId: otpDialog.orderIds[0],
            operation: operationType,
          },
          session.accessToken
        );
      } else {
        // ارسال مجدد برای عملیات گروهی - حتی اگر فقط یک آیتم باشد
        await sendBatchOperationOtp(
          {
            objectIds: otpDialog.orderIds,
            operation: operationType,
          },
          session.accessToken
        );
      }

      toast({
        title: t("toast.info"),
        description: t("otp.codeSent"),
        variant: "info",
      });
    } catch (error) {
      toast({
        title: t("toast.error"),
        description: getErrorMessage(error),
        variant: "error",
      });
    }
  };

  /**
   * مدیریت عملیات خروجی Excel/CSV
   * در نسخه فعلی فقط پیام نمایش می‌دهد
   */
  const handleExport = () => {
    toast({
      title: t("toast.info"),
      description: t("toast.exportStarted"),
      variant: "info",
    });
  };

  /**
   * مدیریت انتخاب/حذف انتخاب یک دستور در نمای موبایل
   * @param orderId شناسه دستور پرداخت
   */
  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  /**
   * مدیریت تغییرات انتخاب سطرها در جدول دسکتاپ
   * این callback از TanStack Table صدا زده می‌شود
   * @param newSelection object شامل row IDs و وضعیت انتخاب آن‌ها
   */
  const handleRowSelectionChange = (newSelection: Record<string, boolean>) => {
    setSelectedRowIds(newSelection);
  };

  /**
   * ایجاد ستون‌های جدول با استفاده از useMemo
   * useMemo از recreate شدن ستون‌ها در هر render جلوگیری می‌کند
   * dependencies شامل locale و handler ها است تا تغییرات به درستی اعمال شود
   */
  const columns = useMemo(
    () => createColumns(locale, handleSingleApprove, handleSingleReject, t),
    [locale, handleSingleApprove, handleSingleReject, t]
  );

  /**
   * بررسی وجود آیتم‌های انتخاب شده
   * در موبایل از selectedOrders و در دسکتاپ از selectedRowIds استفاده می‌شود
   */
  const hasSelection = isMobile
    ? selectedOrders.length > 0
    : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]).length > 0;

  /**
   * تعداد آیتم‌های انتخاب شده
   * این مقدار برای نمایش در UI استفاده می‌شود
   */
  const selectedCount = isMobile
    ? selectedOrders.length
    : Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]).length;

  /**
   * محاسبه آمار برای نمایش در بخش Statistics
   * شامل:
   * - تعداد کل دستورهای پرداخت
   * - مجموع تراکنش‌های تمام دستورها
   * - مجموع مبلغ تمام دستورها (با فرمت فارسی)
   */
  const items: IStatisticsItems = [
    {
      number: `${totalItems}`,
      label: `${t("myCartable.totalOrders")}`,
    },
    {
      number: `${orders.reduce(
        (sum, order) => sum + (order.numberOfTransactions || 0),
        0
      )}`,
      label: `${t("myCartable.totalTransactions")}`,
    },
    {
      number: `${new Intl.NumberFormat().format(
        orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      )}`,
      label: `${t("myCartable.totalAmount")}`,
    },
  ];

  // نمایش error state با retry button
  if (error && !isLoading && orders.length === 0) {
    return (
      <AppLayout>
        <PageHeader
          title={t("myCartable.pageTitle")}
          description={t("myCartable.pageSubtitle")}
        />
        <ErrorState
          title={t("toast.error")}
          message={error}
          onRetry={reloadData}
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-4">
        <PageHeader
          title={t("myCartable.pageTitle")}
          description={t("myCartable.pageSubtitle")}
          badge={totalItems > 0 ? totalItems.toString() : undefined}
          actions={
            totalItems > 0 &&
            !isMobile &&
            !hasSelection && (
              <Button variant="outline" onClick={handleExport}>
                <Download className="" />
                {t("common.buttons.export")}
              </Button>
            )
          }
        />

        <div className="col-span-1 lg:col-span-3">
          <Statistics items={items} />
        </div>

        {!isMobile && hasSelection && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border">
            <Button
              mode="icon"
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={handleCancelSelection}
            >
              <X className="" />
            </Button>
            <div className="flex-1 text-sm font-medium">
              {selectedCount} {t("common.selected")}
            </div>
            <Button
              variant="destructive"
              className="px-4"
              onClick={handleBulkReject}
            >
              <XCircle className="h-4 w-4 me-2" />
              {t("common.buttons.reject")}
            </Button>
            <Button variant="primary" className="" onClick={handleBulkApprove}>
              <CheckCircle className="h-4 w-4 me-2" />
              {t("common.buttons.approve")}
            </Button>
          </div>
        )}

        {/* Desktop: Table */}
        {!isMobile ? (
          <DataTable
            columns={columns}
            data={orders}
            isLoading={isLoading}
            onRowSelectionChange={handleRowSelectionChange}
          />
        ) : (
          /* Mobile: Cards */
          <div className="space-y-3 pb-24">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 3 }).map((_, i) => (
                <OrderCardSkeleton key={i} />
              ))
            ) : (
              <>
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onApprove={handleSingleApprove}
                    onReject={handleSingleReject}
                    selected={selectedOrders.includes(order.id)}
                    onSelect={handleOrderSelect}
                  />
                ))}
                {orders.length === 0 && (
                  <div className="flex flex-col items-center py-20 px-4 text-center mt-10">
                    <div className="p-4 rounded-2xl bg-muted/30">
                      <ClipboardCheck className="h-10 w-10 text-muted-foreground" />
                    </div>

                    <h3 className="mt-6 text-lg font-semibold text-foreground/80">
                      {t("managerCartable.noOrders")}
                    </h3>

                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      {t("managerCartable.noOrdersDescription")}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Bar for Mobile Selection */}
      {isMobile && hasSelection && (
        <div
          className={cn(
            "fixed bottom-24 left-0 right-0 z-40 p-4",
            "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80",
            "border-t shadow-lg"
          )}
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 text-sm font-medium min-w-0">
                <span className="truncate">
                  {selectedOrders.length} {t("common.selected")}
                </span>
              </div>
              <Button
                size="md"
                variant="ghost"
                onClick={handleCancelSelection}
                className="shrink-0 h-8 w-8 p-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex gap-2 mb-6">
              <Button
                size="lg"
                variant="destructive"
                className=" flex-1  flex items-center justify-center gap-2"
                onClick={handleBulkReject}
              >
                <XCircle className="h-5 w-5" />
                <span className="truncate">{t("common.buttons.reject")}</span>
              </Button>
              <Button
                size="lg"
                variant="primary"
                className=" flex-1  flex items-center justify-center gap-2"
                onClick={handleBulkApprove}
              >
                <CheckCircle className="h-5 w-5" />
                <span className="truncate">{t("common.buttons.approve")}</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Dialog */}
      <OtpDialog
        open={otpDialog.open}
        onOpenChange={(open) => setOtpDialog({ ...otpDialog, open })}
        title={
          otpDialog.type === "approve"
            ? t("otp.approveTitle")
            : t("otp.rejectTitle")
        }
        description={
          otpDialog.orderIds.length === 1
            ? t("otp.singleOrderDescription")
            : t("otp.multipleOrdersDescription", {
                count: otpDialog.orderIds.length,
              })
        }
        onConfirm={handleOtpConfirm}
        onResend={handleOtpResend}
        isRequestingOtp={otpDialog.isRequestingOtp}
      />
    </AppLayout>
  );
}
