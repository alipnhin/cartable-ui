/**
 * Account Detail Page
 * صفحه جزئیات و مدیریت حساب بانکی
 */

"use client";

import { useState, useMemo } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { ArrowLeft, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTranslation from "@/hooks/useTranslation";
import { getAccountById } from "@/mocks/mockAccounts";
import { mockUsers } from "@/mocks/mockUsers";
import { AccountInfo } from "./components/account-info";
import { AccountSigners } from "./components/account-signers";

export default function AccountDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const accountId = params?.id as string;

  // گرفتن tab از query string
  const defaultTab = searchParams?.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(defaultTab);

  // گرفتن اطلاعات حساب
  const account = useMemo(() => {
    return getAccountById(accountId);
  }, [accountId]);

  // گرفتن امضاداران
  const signers = useMemo(() => {
    if (!account) return [];
    return mockUsers.filter((user) => account.signerIds.includes(user.id));
  }, [account]);

  if (!account) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl font-bold mb-2">
            {t("common.messages.notFound")}
          </h2>
          <p className="text-muted-foreground mb-6">حساب مورد نظر یافت نشد</p>
          <Button onClick={() => router.push("/accounts")}>
            بازگشت به لیست حساب‌ها
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header ساده با دکمه بازگشت */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ms-2"
        >
          <ArrowLeft className="me-2 h-4 w-4" />
          بازگشت
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">{account.accountTitle}</h1>
            <p className="text-muted-foreground">
              {account.bankName} - {account.sheba}
            </p>
          </div>
          <Button
            variant="outline"
            className="hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            <Edit className="me-2 h-4 w-4" />
            {t("accounts.editAccount")}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="info">
            {t("accounts.accountInfo") || "اطلاعات حساب"}
          </TabsTrigger>
          <TabsTrigger value="signers">
            {t("accounts.signers") || "امضاداران"} ({signers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6">
          <AccountInfo account={account} />
        </TabsContent>

        <TabsContent value="signers" className="mt-6">
          <AccountSigners account={account} signers={signers} />
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
