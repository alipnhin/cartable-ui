/**
 * Accounts List Page
 * صفحه لیست حساب‌های بانکی
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AppLayout, PageHeader } from "@/components/layout";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { AccountsTable } from "./components/accounts-table";
import { AccountsCards } from "./components/accounts-cards";
import { AccountsFilters } from "./components/accounts-filters";
import { getAccountsList, AccountListItem } from "@/services/accountService";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AccountsPage() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { data: session } = useSession();

  const [accounts, setAccounts] = useState<AccountListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedBank, setSelectedBank] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // واکشی لیست حساب‌ها
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!session?.accessToken) return;

      setIsLoading(true);
      try {
        const data = await getAccountsList(session.accessToken);
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast({
          title: t("toast.error"),
          description: t("accounts.fetchError") || "خطا در دریافت لیست حساب‌ها",
          variant: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, [session?.accessToken]);

  // فیلتر کردن حساب‌ها
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      // فیلتر جستجو
      const matchSearch =
        !searchText ||
        account.title.toLowerCase().includes(searchText.toLowerCase()) ||
        account.accountNumber.includes(searchText) ||
        account.shebaNumber.includes(searchText);

      // فیلتر بانک
      const matchBank =
        selectedBank === "all" || account.bankName === selectedBank;

      // فیلتر وضعیت
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && account.isEnable) ||
        (selectedStatus === "inactive" && !account.isEnable);

      return matchSearch && matchBank && matchStatus;
    });
  }, [accounts, searchText, selectedBank, selectedStatus]);

  // لیست بانک‌های منحصر به فرد
  const uniqueBanks = useMemo(() => {
    const banks = Array.from(new Set(accounts.map((acc) => acc.bankName)));
    return banks;
  }, [accounts]);

  // Skeleton برای لودینگ
  const AccountsSkeleton = () => (
    <div className="space-y-4">
      {isMobile ? (
        // Mobile skeleton
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-48" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        // Desktop skeleton
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex gap-4 pb-3 border-b">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-20" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <Skeleton key={j} className="h-4 w-20" />
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
      <PageHeader
        title={t("accounts.pageTitle")}
        description={t("accounts.pageSubtitle")}
      />

      {/* فیلترها */}
      <AccountsFilters
        searchText={searchText}
        setSearchText={setSearchText}
        selectedBank={selectedBank}
        setSelectedBank={setSelectedBank}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        uniqueBanks={uniqueBanks}
      />

      {/* نمایش جدول یا کارت‌ها */}
      <div className="mt-6">
        {isLoading ? (
          <AccountsSkeleton />
        ) : isMobile ? (
          <AccountsCards accounts={filteredAccounts} />
        ) : (
          <AccountsTable accounts={filteredAccounts} />
        )}
      </div>

      {/* تعداد نتایج */}
      {!isLoading && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          {t("common.showing")} {filteredAccounts.length} {t("common.of")}{" "}
          {accounts.length} {t("accounts.accounts")}
        </div>
      )}
    </AppLayout>
  );
}
