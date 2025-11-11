/**
 * Account Detail Page - Redesigned
 * صفحه جزئیات و مدیریت حساب بانکی (طراحی جدید بدون تب)
 */

"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout";
import { ArrowLeft, Edit2, Users, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useTranslation from "@/hooks/useTranslation";
import { getAccountById } from "@/mocks/mockAccounts";
import { mockUsers } from "@/mocks/mockUsers";
import { AccountInfo } from "./components/account-info";
import { SignerCard } from "./components/signer-card";
import { MinimumSignaturesForm } from "./components/minimum-signatures-form";
import { AddSignerDialog } from "./components/add-signer-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const accountId = params?.id as string;

  // گرفتن اطلاعات حساب
  const account = useMemo(() => {
    return getAccountById(accountId);
  }, [accountId]);

  // گرفتن امضاداران
  const signers = useMemo(() => {
    if (!account) return [];
    return mockUsers.filter((user) => account.signerIds.includes(user.id));
  }, [account]);

  // شمارش امضاداران فعال
  const activeSignersCount = signers.filter((s) => s.isActive).length;

  // هندلرها
  const handleSaveMinSignatures = (value: number) => {
    console.log("Saving min signatures:", value);
    // در اینجا باید API call شود
  };

  const handleRequestStatusChange = (signerId: string, currentStatus: boolean) => {
    console.log(
      `Request ${currentStatus ? "deactivation" : "activation"} for signer:`,
      signerId
    );
    // در اینجا باید API call برای درخواست تغییر وضعیت شود
  };

  const handleAddSigner = (userId: string) => {
    console.log("Adding signer:", userId);
    // در اینجا باید API call شود
  };

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
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 -ms-2"
        >
          <ArrowLeft className="me-2 h-4 w-4" />
          بازگشت
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">{account.accountTitle}</h1>
              <Badge variant={account.isActive ? "success" : "secondary"}>
                {account.isActive ? "فعال" : "غیرفعال"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {account.bankName} - {account.sheba}
            </p>
          </div>
          <Button
            variant="outline"
            className="hover:-translate-y-0.5 active:scale-95 transition-all duration-200 gap-2"
          >
            <Edit2 className="h-4 w-4" />
            {t("accounts.editAccount") || "ویرایش حساب"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* بخش اطلاعات حساب */}
        <AccountInfo account={account} />

        {/* بخش امضاداران */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                امضاداران حساب
              </CardTitle>
              <AddSignerDialog
                accountId={accountId}
                existingSignerIds={account.signerIds}
                onAdd={handleAddSigner}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* آمار امضاداران */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">{signers.length}</div>
                  <div className="text-xs text-muted-foreground">
                    کل امضاداران
                  </div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {activeSignersCount}
                  </div>
                  <div className="text-xs text-muted-foreground">فعال</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {account.minimumSignatureCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    حداقل مورد نیاز
                  </div>
                </div>
              </div>
              {activeSignersCount < account.minimumSignatureCount && (
                <Badge variant="destructive" className="gap-1 flex-shrink-0">
                  <XCircle className="h-3 w-3" />
                  امضاداران فعال کافی نیست
                </Badge>
              )}
              {activeSignersCount >= account.minimumSignatureCount && (
                <Badge className="gap-1 bg-success hover:bg-success/90 flex-shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  تعداد امضادار کافی است
                </Badge>
              )}
            </div>

            {/* فرم حداقل امضا */}
            <MinimumSignaturesForm
              currentValue={account.minimumSignatureCount}
              maxValue={signers.length}
              onSave={handleSaveMinSignatures}
            />

            {/* لیست امضاداران */}
            {signers.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {signers.map((signer) => (
                  <SignerCard
                    key={signer.id}
                    signer={signer}
                    onRequestStatusChange={handleRequestStatusChange}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">
                  امضاداری تعریف نشده است
                </h3>
                <p className="text-muted-foreground mb-6">
                  برای استفاده از این حساب، حداقل {account.minimumSignatureCount}{" "}
                  امضادار نیاز است.
                </p>
                <AddSignerDialog
                  accountId={accountId}
                  existingSignerIds={account.signerIds}
                  onAdd={handleAddSigner}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
