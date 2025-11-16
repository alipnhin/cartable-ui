"use client";

import { useMemo, useState } from "react";
import { AppLayout, PageHeader } from "@/components/layout";
import { DataTable } from "./components/data-table";
import { createColumns } from "./components/columns";
import { OrderCard } from "./components/order-card";
import { FilterSheet } from "./components/filter-sheet";
import { Button } from "@/components/ui/button";
import { Download, FileBadge, Filter, Timer } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockOrders } from "@/mocks/mockOrders";
import { useToast } from "@/hooks/use-toast";
import { OrderStatus } from "@/types/order";
import { useRouter } from "next/navigation";
import { MobilePagination } from "@/components/common/mobile-pagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatisticCard, { StatisticCardProps } from "./components/statistic-card";

export default function PaymentOrdersPage() {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  // State for filters
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

  // Apply filters
  const filteredOrders = useMemo(() => {
    let result = [...mockOrders];

    // Filter by status
    if (filters.status.length > 0) {
      result = result.filter((order) => filters.status.includes(order.status));
    }

    // Filter by order title
    if (filters.orderTitle) {
      const titleLower = filters.orderTitle.toLowerCase();
      result = result.filter((order) =>
        order.accountTitle?.toLowerCase().includes(titleLower)
      );
    }

    // Filter by order number
    if (filters.orderNumber) {
      const numberLower = filters.orderNumber.toLowerCase();
      result = result.filter((order) =>
        order.orderNumber?.toLowerCase().includes(numberLower)
      );
    }

    // Filter by tracking ID
    if (filters.trackingId) {
      const trackingLower = filters.trackingId.toLowerCase();
      result = result.filter((order) =>
        order.orderNumber?.toLowerCase().includes(trackingLower)
      );
    }

    // Filter by general search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(searchLower) ||
          order.accountTitle?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by account
    if (filters.accountId && filters.accountId !== "all") {
      result = result.filter((order) => order.accountId === filters.accountId);
    }

    // Filter by date range
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      result = result.filter(
        (order) =>
          order.createdDateTime && new Date(order.createdDateTime) >= fromDate
      );
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter(
        (order) =>
          order.createdDateTime && new Date(order.createdDateTime) <= toDate
      );
    }

    return result;
  }, [filters]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredOrders.length;
    const pending = filteredOrders.filter(
      (o) =>
        o.status === OrderStatus.SubmittedToBank ||
        o.status === OrderStatus.WaitingForOwnersApproval
    ).length;
    const succeeded = filteredOrders.filter(
      (o) =>
        o.status === OrderStatus.PartiallySucceeded ||
        o.status === OrderStatus.Succeeded
    ).length;
    const totalAmount = filteredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    return { total, pending, succeeded, totalAmount };
  }, [filteredOrders]);

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

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

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
  };

  const handleViewOrder = (orderId: string) => {
    // Navigate to order detail page (will be implemented later)
    toast({
      title: t("toast.info"),
      description: `مشاهده جزئیات دستور ${orderId}`,
    });
  };

  // Mobile pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const visibleOrders = isMobile
    ? filteredOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : filteredOrders;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <DataTable columns={columns} data={filteredOrders} isLoading={false} />
      ) : (
        <div className="space-y-3">
          {visibleOrders.map((order) => (
            <OrderCard key={order.id} order={order} onView={handleViewOrder} />
          ))}
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              {t("orders.noOrders")}
            </div>
          )}
          {totalPages > 1 && (
            <MobilePagination
              currentPage={currentPage}
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
