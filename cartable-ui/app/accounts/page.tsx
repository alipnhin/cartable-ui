/**
 * Accounts List Page
 * صفحه لیست حساب‌های بانکی
 */

"use client";

import { useState, useMemo } from "react";
import { AppLayout, PageHeader } from "@/components/layout";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockAccounts } from "@/mocks/mockAccounts";
import { Account } from "@/types";
import { AccountsTable } from "./components/accounts-table";
import { AccountsCards } from "./components/accounts-cards";
import { AccountsFilters } from "./components/accounts-filters";

export default function AccountsPage() {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const [searchText, setSearchText] = useState("");
  const [selectedBank, setSelectedBank] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // فیلتر کردن حساب‌ها
  const filteredAccounts = useMemo(() => {
    return mockAccounts.filter((account) => {
      // فیلتر جستجو
      const matchSearch =
        !searchText ||
        account.accountTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        account.accountNumber.includes(searchText) ||
        account.sheba.includes(searchText);

      // فیلتر بانک
      const matchBank =
        selectedBank === "all" || account.bankName === selectedBank;

      // فیلتر وضعیت
      const matchStatus =
        selectedStatus === "all" ||
        (selectedStatus === "active" && account.isActive) ||
        (selectedStatus === "inactive" && !account.isActive);

      return matchSearch && matchBank && matchStatus;
    });
  }, [searchText, selectedBank, selectedStatus]);

  // لیست بانک‌های منحصر به فرد
  const uniqueBanks = useMemo(() => {
    const banks = Array.from(new Set(mockAccounts.map((acc) => acc.bankName)));
    return banks;
  }, []);

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
        {isMobile ? (
          <AccountsCards accounts={filteredAccounts} />
        ) : (
          <AccountsTable accounts={filteredAccounts} />
        )}
      </div>

      {/* تعداد نتایج */}
      <div className="mt-4 text-sm text-muted-foreground text-center">
        {t("common.showing")} {filteredAccounts.length} {t("common.of")}{" "}
        {mockAccounts.length} {t("accounts.accounts")}
      </div>
    </AppLayout>
  );
}
