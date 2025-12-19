/**
 * Accounts List Page
 * صفحه لیست حساب‌های بانکی
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { AppLayout, PageHeader } from "@/components/layout";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { AccountsTable } from "./components/accounts-table";
import { AccountsCards } from "./components/accounts-cards";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAccountsQuery } from "@/hooks/useAccountsQuery";
import { getErrorMessage } from "@/lib/error-handler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Group, LayoutGrid, List, Search } from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/common/page-title";

export default function AccountsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  // Set default view mode based on device
  useEffect(() => {
    if (isMobile) {
      setViewMode("card");
    }
  }, [isMobile]);

  // استفاده از React Query hook
  const {
    accounts,
    isLoading,
    error: queryError,
    refetch,
  } = useAccountsQuery();

  // نمایش toast برای خطا
  useEffect(() => {
    if (queryError) {
      const errorMessage = getErrorMessage(queryError);
      toast({
        title: t("toast.error"),
        description: errorMessage,
        variant: "error",
      });
    }
  }, [queryError, toast, t]);

  // فیلتر کردن حساب‌ها
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      // فیلتر جستجو
      const matchSearch =
        !searchText ||
        account.title.toLowerCase().includes(searchText.toLowerCase()) ||
        account.accountNumber.includes(searchText) ||
        account.shebaNumber.includes(searchText) ||
        account.bankName.toLowerCase().includes(searchText.toLowerCase());

      // فیلتر وضعیت
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && account.isEnable) ||
        (selectedStatus === "inactive" && !account.isEnable);

      return matchSearch && matchStatus;
    });
  }, [accounts, searchText, selectedStatus]);

  // Skeleton برای لودینگ
  const AccountsSkeleton = () => (
    <div className="space-y-4">
      {viewMode === "card" ? (
        // Card skeleton
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-5 w-10" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
                <div className="flex justify-between pt-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Table skeleton
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex gap-4 pb-3 border-b">
                {Array.from({ length: 7 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 flex-1" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                  {Array.from({ length: 7 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 flex-1" />
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <AppLayout>
      <PageTitle title={t("accounts.pageTitle")} />
      <PageHeader
        title={t("accounts.pageTitle")}
        description={t("accounts.pageSubtitle")}
        actions={
          <Button variant="primary" className="relative">
            <Group />
            <Link href="/account-groups"> مدیریت گروه حساب</Link>
            <span className="border-2 border-background rounded-full size-3 bg-destructive absolute -top-1 -end-1 animate-bounce" />
          </Button>
        }
      />

      {/* فیلترها و کنترل‌ها */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* سمت راست: جستجو */}
        <div className="w-full sm:w-auto">
          <InputGroup>
            <InputGroupInput
              className="w-full sm:w-72 h-8.5 "
              placeholder={t("accounts.searchPlaceholder") || "جستجو..."}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <InputGroupAddon>
              <Search className=" ms-2" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* سمت چپ: فیلترها و view toggle */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          {/* فیلتر وضعیت */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger size="lg" className="w-28 text-[0.8125rem]">
              <SelectValue placeholder={t("common.status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all") || "همه"}</SelectItem>
              <SelectItem value="active">
                {t("common.active") || "فعال"}
              </SelectItem>
              <SelectItem value="inactive">
                {t("common.inactive") || "غیرفعال"}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-8.5 px-2.5 rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="sm"
              className="h-8.5 px-2.5 rounded-r-none"
              onClick={() => setViewMode("card")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* نمایش جدول یا کارت‌ها */}
      <div>
        {isLoading ? (
          <AccountsSkeleton />
        ) : viewMode === "card" ? (
          <AccountsCards accounts={filteredAccounts} />
        ) : (
          <AccountsTable accounts={filteredAccounts} />
        )}
      </div>

      {/* تعداد نتایج */}
      {!isLoading && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          {t("common.showing") || "نمایش"} {filteredAccounts.length}{" "}
          {t("common.of") || "از"} {accounts.length}{" "}
          {t("accounts.accounts") || "حساب"}
        </div>
      )}
    </AppLayout>
  );
}
