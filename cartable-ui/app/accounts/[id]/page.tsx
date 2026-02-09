/**
 * Account Detail Page
 * صفحه جزئیات و مدیریت حساب بانکی
 * مرحله 1: فقط نمایش اطلاعات
 */

"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { FixHeader } from "@/components/layout/Fix-Header";
import {
  Users,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { AccountInfo } from "./components/account-info";
import { SignerCard } from "./components/signer-card";
import { MinimumSignaturesForm } from "./components/minimum-signatures-form";
import { AddSignerDialog } from "./components/add-signer-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/lib/error-handler";
import { useAccountDetailQuery, useAccountMutations } from "@/hooks/useAccountDetailQuery";
import { useRegisterRefresh } from "@/contexts/pull-to-refresh-context";
import { ErrorState } from "@/components/common/error-state";
import { PageTitle } from "@/components/common/page-title";

export default function AccountDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const accountId = params?.id as string;

  // استفاده از React Query hook
  const {
    data: account,
    isLoading,
    error: queryError,
    refetch,
  } = useAccountDetailQuery(accountId);

  // استفاده از mutations
  const mutations = useAccountMutations(accountId);

  // ثبت refetch برای Pull-to-Refresh
  useRegisterRefresh(async () => {
    await refetch();
  });

  /**
   * تغییر حداقل امضا
   */
  const handleSaveMinSignatures = async (value: number) => {
    if (!account) return;

    mutations.changeMinSignature.mutate(
      {
        minimumSignature: value,
        bankGatewayId: account.id,
      },
      {
        onSuccess: () => {
          toast({
            title: t("toast.success"),
            description: "حداقل امضا با موفقیت تغییر کرد",
            variant: "success",
          });
        },
        onError: (err) => {
          const errorMessage = getErrorMessage(err);
          toast({
            title: t("toast.error"),
            description: errorMessage,
            variant: "error",
          });
        },
      }
    );
  };

  /**
   * تغییر وضعیت امضادار (فعال/غیرفعال)
   */
  const handleRequestStatusChange = async (
    signerId: string,
    currentStatus: string | number
  ) => {
    // Status 1 or "Enable" = active, so we disable it
    // Status 2 or "Disable" or 4 or "Rejected" = inactive, so we enable it
    if (currentStatus === 1 || currentStatus === "Enable") {
      mutations.disableSigner.mutate(signerId, {
        onSuccess: () => {
          toast({
            title: t("toast.success"),
            description: "درخواست غیرفعال‌سازی ثبت شد",
            variant: "success",
          });
        },
        onError: (err) => {
          const errorMessage = getErrorMessage(err);
          toast({
            title: t("toast.error"),
            description: errorMessage,
            variant: "error",
          });
        },
      });
    } else {
      mutations.enableSigner.mutate(signerId, {
        onSuccess: () => {
          toast({
            title: t("toast.success"),
            description: "درخواست فعال‌سازی ثبت شد",
            variant: "success",
          });
        },
        onError: (err) => {
          const errorMessage = getErrorMessage(err);
          toast({
            title: t("toast.error"),
            description: errorMessage,
            variant: "error",
          });
        },
      });
    }
  };

  /**
   * افزودن امضادار جدید
   */
  const handleAddSigner = async () => {
    // Reload data after adding signer
    await refetch();
  };

  // Error state
  const error = queryError ? getErrorMessage(queryError) : null;

  // تعداد امضاداران فعال
  const activeSignersCount =
    account?.users?.filter((u) => u.status === 1 || u.status === "Enable")
      .length ?? 0;

  // Loading state
  if (isLoading) {
    return (
      <>
        <FixHeader returnUrl="/accounts" />
        <div className="container mx-auto p-4 md:p-6 space-y-6 mt-14">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="space-y-6">
            {/* Account Info Skeleton */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <Skeleton className="h-16 w-16 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-5 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Signers Skeleton */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-9 w-32" />
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stats skeleton */}
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-5 w-28 rounded-full" />
                </div>

                {/* Min signatures skeleton */}
                <Skeleton className="h-20 w-full rounded-lg" />

                {/* Signer cards skeleton */}
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i} className="flex flex-col">
                      <CardContent className="p-4 flex flex-col items-center pt-6">
                        <Skeleton className="h-14 w-14 rounded-full mb-3" />
                        <Skeleton className="h-4 w-24 mb-1" />
                        <Skeleton className="h-5 w-20 rounded-full mb-2" />
                        <Skeleton className="h-3 w-16 mb-2" />
                        <Skeleton className="h-3 w-20" />
                      </CardContent>
                      <div className="flex items-center px-4 min-h-12 border-t justify-center">
                        <Skeleton className="h-7 w-20" />
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error && !account) {
    return (
      <>
        <PageTitle title={t("accounts.detailTitle")} />
        <FixHeader returnUrl="/accounts" />
        <div className="container mx-auto p-4 md:p-6 mt-14">
          <ErrorState
            title={t("common.messages.notFound")}
            message={error || "حساب مورد نظر یافت نشد"}
            onRetry={() => refetch()}
          />
        </div>
      </>
    );
  }

  // 404 state - Account not found
  if (!isLoading && !account) {
    return (
      <>
        <FixHeader returnUrl="/accounts" />
        <div className="container mx-auto p-4 md:p-6 mt-14">
          <div className="flex flex-col items-center justify-center min-h-100">
            <h2 className="text-2xl font-bold mb-2">
              {t("common.messages.notFound")}
            </h2>
            <p className="text-muted-foreground mb-6">
              حساب مورد نظر یافت نشد
            </p>
            <Button onClick={() => router.push("/accounts")}>
              بازگشت به لیست حساب‌ها
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle title={account?.title || t("accounts.detailTitle")} />
      <FixHeader returnUrl="/accounts">
        <Button
          variant="dashed"
          onClick={() => refetch()}
          disabled={mutations.changeMinSignature.isPending || mutations.enableSigner.isPending || mutations.disableSigner.isPending}
          className="gap-2"
        >
          <RefreshCw className={`${(mutations.changeMinSignature.isPending || mutations.enableSigner.isPending || mutations.disableSigner.isPending) ? "animate-spin" : ""}`} />
          {t("common.refresh")}
        </Button>
      </FixHeader>
      <div className="container mx-auto p-4 md:p-6 space-y-6 mt-14">
        <div className="space-y-6">
          {/* بخش اطلاعات حساب */}
          <AccountInfo account={account} />

          {/* بخش امضاداران */}
          <Card>
            <CardHeader className="py-4">
              <CardHeading>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  امضاداران حساب
                </CardTitle>
              </CardHeading>
              <CardToolbar>
                <AddSignerDialog
                  accountId={accountId}
                  existingSignerIds={account.users?.map((u) => u.userId) ?? []}
                  onAdd={handleAddSigner}
                />
              </CardToolbar>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* فرم حداقل امضا با آمار */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">کل:</span>
                    <span className="font-bold">
                      {account.users?.length ?? 0}
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-muted-foreground">فعال:</span>
                    <span className="font-bold text-success">
                      {activeSignersCount}
                    </span>
                  </div>
                </div>
                {activeSignersCount < account.minimumSignature ? (
                  <Badge variant="destructive" className="gap-1 py-3">
                    <XCircle className="h-3 w-3" />
                    امضاداران فعال کافی نیست
                  </Badge>
                ) : (
                  <Badge className="gap-1 bg-success hover:bg-success/90 py-3">
                    <CheckCircle2 className="h-3 w-3" />
                    تعداد کافی است
                  </Badge>
                )}
              </div>

              {/* فرم حداقل امضا */}
              <MinimumSignaturesForm
                currentValue={account.minimumSignature}
                maxValue={account.users?.length ?? 0}
                onSave={handleSaveMinSignatures}
                isLoading={mutations.changeMinSignature.isPending}
              />

              {/* لیست امضاداران */}
              {account.users && account.users.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {account.users.map((signer) => (
                    <SignerCard
                      key={signer.id}
                      signer={signer}
                      onRequestStatusChange={handleRequestStatusChange}
                      isUpdating={mutations.enableSigner.isPending || mutations.disableSigner.isPending}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/30 rounded-lg border-2 border-dashed">
                  <Users className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground text-sm">
                    امضاداری تعریف نشده است. از دکمه «افزودن امضادار» استفاده
                    کنید.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
