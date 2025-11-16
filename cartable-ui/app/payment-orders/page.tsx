"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { AppLayout, PageHeader } from "@/components/layout";
import { DataTable } from "./components/data-table";
import { createColumns } from "./components/columns";
import { OrderCard } from "./components/order-card";
import { FilterSheet } from "./components/filter-sheet";
import { Button } from "@/components/ui/button";
import { Download, FileBadge, Filter, Timer } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus, PaymentOrder } from "@/types/order";
import { PaymentStatusEnum } from "@/types/api";
import { useRouter } from "next/navigation";
import { MobilePagination } from "@/components/common/mobile-pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatisticCard, { StatisticCardProps } from "./components/statistic-card";
import { searchPaymentOrders } from "@/services/paymentOrdersService";
import { mapPaymentListDtosToPaymentOrders } from "@/lib/api-mappers";

export default function PaymentOrdersPage() {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const router = useRouter();
  const { data: session } = useSession();
  const [showFilters, setShowFilters] = useState(false);

  /**
   * State مدیریت داده‌های صفحه
   */
  const [orders, setOrders] = useState<PaymentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /**
   * State برای فیلترها
   * این فیلترها به API ارسال می‌شوند
   */
  const [filters, setFilters] = useState({
    status: [] as OrderStatus[],
    search: "",
    orderTitle: "",
    orderNumber: "",
    trackingId: "",
    dateFrom: "",
    dateTo: "",
    accountId: "",
  });

  /**
   * واکشی داده‌ها از API
   * این تابع هر بار که فیلترها یا صفحه تغییر کند، اجرا می‌شود
   */
  const fetchOrders = useCallback(async () => {
    if (!session?.accessToken) return;

    setIsLoading(true);
    try {
      // ساخت پارامترهای فیلتر برای API
      const apiFilters: any = {
        pageNumber,
        pageSize,
        orderBy: "createdDateTime",
      };

      // اضافه کردن فیلترهای اختیاری
      if (filters.trackingId) apiFilters.trackingId = filters.trackingId;
      if (filters.orderNumber) apiFilters.orderId = filters.orderNumber;
      if (filters.orderTitle) apiFilters.name = filters.orderTitle;
      if (filters.accountId && filters.accountId !== "all")
        apiFilters.bankGatewayId = filters.accountId;
      if (filters.status.length === 1) {
        // اگر فقط یک وضعیت انتخاب شده، به API ارسال می‌شود
        apiFilters.status = filters.status[0] as unknown as PaymentStatusEnum;
      }
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        apiFilters.fromDate = fromDate.toISOString();
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        apiFilters.toDate = toDate.toISOString();
      }

      const response = await searchPaymentOrders(
        apiFilters,
        session.accessToken
      );

      // تبدیل داده‌های API به فرمت داخلی
      const mappedOrders = mapPaymentListDtosToPaymentOrders(response.items);
      setOrders(mappedOrders);
      setTotalItems(response.totalItemCount);
      setTotalPages(response.totalPageCount);
    } catch (error) {
      console.error("Error fetching payment orders:", error);
      toast({
        title: t("toast.error"),
        description: "خطا در دریافت اطلاعات دستورات پرداخت",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.accessToken, pageNumber, pageSize, filters, toast, t]);

  /**
   * Effect برای واکشی داده‌ها هنگام تغییر فیلترها یا صفحه
   */
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
        o.status === OrderStatus.PartiallySucceeded ||
        o.status === OrderStatus.Succeeded
    ).length;
    const totalAmount = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    return { total, pending, succeeded, totalAmount };
  }, [orders, totalItems]);

  // Handlers
  const handleExport = () => {
    toast({
      title: t("toast.info"),
      description: t("toast.exportStarted"),
    });

    // Simulate export delay
    setTimeout(() => {
      toast({
        title: t("toast.success"),
        description: "فایل Excel آماده دانلود است",
      });
    }, 2000);
  };

  /**
   * تغییر فیلترها
   * بعد از تغییر فیلتر، صفحه به اول برگردانده می‌شود
   */
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPageNumber(1); // بازگشت به صفحه اول
  };

  /**
   * ریست کردن فیلترها
   */
  const handleResetFilters = () => {
    setFilters({
      status: [],
      search: "",
      orderTitle: "",
      orderNumber: "",
      trackingId: "",
      dateFrom: "",
      dateTo: "",
      accountId: "",
    });
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
      label: "کل دستورات",
    },
    {
      icon: Timer,
      accentColor: "success",
      value: stats.succeeded.toString(),
      label: "موفق انجام شده",
    },
    {
      icon: Timer,
      accentColor: "warning",
      value: stats.pending.toString(),
      label: "در صف پردازش",
    },
    {
      icon: Timer,
      accentColor: "info",
      value: stats.totalAmount,
      label: "مبلغ کل دستورات",
    },
  ];

  const activeFiltersCount =
    filters.status.length +
    (filters.orderTitle ? 1 : 0) +
    (filters.orderNumber ? 1 : 0) +
    (filters.trackingId ? 1 : 0) +
    (filters.search ? 1 : 0) +
    (filters.dateFrom ? 1 : 0) +
    (filters.dateTo ? 1 : 0) +
    (filters.accountId && filters.accountId !== "all" ? 1 : 0);

  return (
    <AppLayout>
      <PageHeader
        title={t("paymentCartable.pageTitle")}
        description={t("paymentCartable.pageSubtitle")}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              mode="default"
              onClick={() => setShowFilters(true)}
              className="hover:bg-muted/80 transition-colors"
            >
              <Filter className="" />
              {t("common.buttons.filter")}
              {activeFiltersCount > 0 && (
                <span className="ms-2 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full min-w-5 text-center">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleExport}
              mode={isMobile ? "icon" : "default"}
              className="hover:bg-muted/80 transition-colors"
            >
              <Download className="" />
              {!isMobile && t("common.buttons.export")}
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <StatisticCard cards={statisticCards} />

      {/* Data Display */}
      {!isMobile ? (
        <DataTable columns={columns} data={orders} isLoading={isLoading} />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onView={handleViewOrder} />
          ))}
          {orders.length === 0 && !isLoading && (
            <div className="text-center py-12 text-muted-foreground">
              {t("orders.noOrders")}
            </div>
          )}
          {totalPages > 1 && (
            <MobilePagination
              currentPage={pageNumber}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      )}

      {/* Filter Sheet */}
      <FilterSheet
        open={showFilters}
        onOpenChange={setShowFilters}
        filters={filters}
        onFiltersChange={handleFilterChange}
        onReset={handleResetFilters}
      />
    </AppLayout>
  );
}
