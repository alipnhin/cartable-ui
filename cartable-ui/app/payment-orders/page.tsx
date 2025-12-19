"use client";

import { useMemo, useState, useEffect } from "react";
import { AppLayout, PageHeader } from "@/components/layout";
import { DataTable } from "./components/data-table";
import { createColumns } from "./components/columns";
import { OrderCard, OrderCardSkeleton } from "./components/order-card";
import { OrderFilters } from "./components/order-filters";
import { FileBadge, Timer, FileX } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus } from "@/types/order";
import { PaymentStatusEnum } from "@/types/api";
import { useRouter } from "next/navigation";
import { MobilePagination } from "@/components/common/mobile-pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import StatisticCard, { StatisticCardProps } from "./components/statistic-card";
import { useAccountGroupStore } from "@/store/account-group-store";
import { getErrorMessage } from "@/lib/error-handler";
import { usePaymentOrdersQuery } from "@/hooks/usePaymentOrdersQuery";
import { PageTitle } from "@/components/common/page-title";

export default function PaymentOrdersPage() {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const router = useRouter();
  const groupId = useAccountGroupStore((s) => s.groupId);

  /**
   * State برای pagination
   */
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /**
   * State برای sorting سمت سرور
   */
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  /**
   * State برای فیلترها
   * این فیلترها به API ارسال می‌شوند
   */
  const [trackingId, setTrackingId] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [orderTitle, setOrderTitle] = useState("");
  const [accountId, setAccountId] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // فیلترهای یکپارچه برای کامپوننت
  const filters = useMemo(
    () => ({
      status: statusFilter,
      orderTitle,
      orderNumber,
      trackingId,
      dateFrom,
      dateTo,
      accountId,
    }),
    [
      statusFilter,
      orderTitle,
      orderNumber,
      trackingId,
      dateFrom,
      dateTo,
      accountId,
    ]
  );

  // خواندن accountGroupId از localStorage
  const [savedGroupId, setSavedGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("selected-account-group");
      setSavedGroupId(stored);
    }
  }, [groupId]);

  // ساخت پارامترهای API
  const apiFilters = useMemo(() => {
    const params: any = {
      pageNumber,
      pageSize,
    };

    // اضافه کردن accountGroupId
    if (savedGroupId && savedGroupId !== "all") {
      params.accountGroupId = savedGroupId;
    }

    // اضافه کردن sorting
    if (sorting.length > 0) {
      const sortField = sorting[0];
      // تبدیل نام فیلد از frontend به backend format
      const fieldMap: Record<string, string> = {
        orderNumber: "orderId",
        accountTitle: "name",
        totalAmount: "totalAmount",
        numberOfTransactions: "numberOfTransactions",
        status: "status",
        createdDateTime: "createdDateTime",
      };
      const backendField = fieldMap[sortField.id] || sortField.id;
      params.orderBy = sortField.desc ? `${backendField} desc` : backendField;
    } else {
      params.orderBy = "createdDateTime desc";
    }

    // اضافه کردن فیلترهای اختیاری
    if (trackingId) params.trackingId = trackingId;
    if (orderNumber) params.orderId = orderNumber;
    if (orderTitle) params.name = orderTitle;
    if (accountId && accountId !== "all") params.bankGatewayId = accountId;
    if (statusFilter) {
      params.status = statusFilter as unknown as PaymentStatusEnum;
    }
    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      params.fromDate = fromDate.toISOString();
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);
      params.toDate = toDate.toISOString();
    }

    return params;
  }, [
    pageNumber,
    pageSize,
    savedGroupId,
    sorting,
    trackingId,
    orderNumber,
    orderTitle,
    accountId,
    statusFilter,
    dateFrom,
    dateTo,
  ]);

  // استفاده از React Query hook
  const {
    orders,
    isLoading,
    error: queryError,
    totalItems,
    totalPages,
    refetch,
  } = usePaymentOrdersQuery({
    filterParams: apiFilters,
  });

  // نمایش toast برای خطا
  useEffect(() => {
    if (queryError) {
      const errorMessage = getErrorMessage(queryError);
      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "error",
      });
    }
  }, [queryError, toast, t]);

  /**
   * محاسبه آمار
   * آمار بر اساس داده‌های دریافتی از API محاسبه می‌شود
   */
  const stats = useMemo(() => {
    const total = totalItems; // استفاده از totalItems از API
    const pending = orders.filter(
      (o) =>
        o.status === OrderStatus.SubmittedToBank ||
        o.status === OrderStatus.WaitingForOwnersApproval
    ).length;
    const succeeded = orders.filter(
      (o) =>
        o.status === OrderStatus.DoneWithError ||
        o.status === OrderStatus.BankSucceeded
    ).length;
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    return { total, pending, succeeded, totalAmount };
  }, [orders, totalItems]);

  /**
   * تغییر فیلترها
   * بعد از تغییر فیلتر، صفحه به اول برگردانده می‌شود
   */
  const handleFilterChange = (newFilters: typeof filters) => {
    setStatusFilter(newFilters.status);
    setOrderTitle(newFilters.orderTitle);
    setOrderNumber(newFilters.orderNumber);
    setTrackingId(newFilters.trackingId);
    setDateFrom(newFilters.dateFrom);
    setDateTo(newFilters.dateTo);
    setAccountId(newFilters.accountId);
    setPageNumber(1); // بازگشت به صفحه اول
  };

  /**
   * ریست کردن فیلترها
   */
  const handleResetFilters = () => {
    setStatusFilter("");
    setOrderTitle("");
    setOrderNumber("");
    setTrackingId("");
    setDateFrom("");
    setDateTo("");
    setAccountId("");
    setPageNumber(1); // بازگشت به صفحه اول
  };

  /**
   * مشاهده جزئیات دستور پرداخت
   */
  const handleViewOrder = (orderId: string) => {
    router.push(`/payment-orders/${orderId}`);
  };

  /**
   * تغییر صفحه
   * در موبایل از client-side pagination استفاده نمی‌شود
   * و مستقیماً از API صفحه جدید دریافت می‌شود
   */
  const handlePageChange = (page: number) => {
    setPageNumber(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Create columns
  const columns = useMemo(
    () => createColumns(locale, t, handleViewOrder),
    [locale, t]
  );

  const statisticCards: StatisticCardProps[] = [
    {
      icon: FileBadge,
      accentColor: "primary",
      value: stats.total.toString(),
      label: t("paymentCartable.allOrders"),
      currency: false,
    },
    {
      icon: Timer,
      accentColor: "success",
      value: stats.succeeded.toString(),
      label: t("paymentCartable.succeededOrders"),
      currency: false,
    },
    {
      icon: Timer,
      accentColor: "warning",
      value: stats.pending.toString(),
      label: t("paymentCartable.ordersInQueue"),
      currency: false,
    },
    {
      icon: Timer,
      accentColor: "info",
      value: stats.totalAmount,
      label: t("paymentCartable.totalOrdersAmount"),
      currency: true,
    },
  ];

  // نمایش اسکلت لودینگ فقط در بارگذاری اولیه
  if (isLoading && orders.length === 0) {
    return (
      <AppLayout>
        <PageTitle title={t("paymentCartable.pageTitle")} />
        <PageHeader
          title={t("paymentCartable.pageTitle")}
          description={t("paymentCartable.pageSubtitle")}
        />
        {/* Filter skeleton */}
        <Card className=" mb-4">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        {/* Stats skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4  mb-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Table skeleton */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 py-3 border-b last:border-0">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTitle title={t("paymentCartable.pageTitle")} />
      <PageHeader
        title={t("paymentCartable.pageTitle")}
        description={t("paymentCartable.pageSubtitle")}
      />

      {/* Stats Cards */}
      <StatisticCard cards={statisticCards} />

      {/* Inline Filters */}
      <OrderFilters filters={filters} onFiltersChange={handleFilterChange} />

      {/* Data Display */}
      {!isMobile ? (
        <DataTable
          columns={columns}
          data={orders}
          isLoading={isLoading}
          pageNumber={pageNumber}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setPageNumber}
          onPageSizeChange={setPageSize}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      ) : (
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))
          ) : (
            <>
              {orders.length === 0 ? (
                <div className="rounded-xl border bg-card/40 backdrop-blur-sm transition-all duration-200 hover:shadow-xl hover:border-primary/30">
                  <div className="flex flex-col items-center gap-4 py-16 px-6">
                    <div className="rounded-full bg-muted bg-opacity-20 p-4">
                      <FileX className="h-10 w-10 text-muted-foreground/60" />
                    </div>

                    <div className="text-center space-y-1.5">
                      <p className="text-lg font-semibold text-foreground/80">
                        {t("orders.noOrders")}
                      </p>
                      <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-xs mx-auto">
                        فیلترهای جستجو را تغییر دهید یا دستور پرداخت جدید ایجاد
                        کنید
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onView={handleViewOrder}
                  />
                ))
              )}
              {totalPages > 1 && (
                <MobilePagination
                  currentPage={pageNumber}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      )}
    </AppLayout>
  );
}
