/**
 * Account Group Detail Page
 * صفحه جزئیات و مدیریت حساب‌های گروه
 * Path: app/account-groups/[id]/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FixHeader } from "@/components/layout/Fix-Header";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardHeading,
  CardTitle,
  CardToolbar,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  getAccountGroupById,
  removeGroupAccount,
} from "@/services/accountGroupService";
import { getAccountsList, AccountListItem } from "@/services/accountService";
import type {
  AccountGroupDetail,
  AccountGroupItem,
} from "@/types/account-group-types";
import { CreateEditGroupDialog } from "../components/create-edit-group-dialog";
import { AddAccountsDialog } from "../components/add-accounts-dialog";
import { GroupAccountCard } from "../components/group-account-card";
import { RefreshCw, Folders, Edit2, Loader2 } from "lucide-react";

export default function AccountGroupDetailPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const { data: session } = useSession();
  const isMobile = useIsMobile();
  const groupId = params?.id as string;

  const [group, setGroup] = useState<AccountGroupDetail | null>(null);
  const [allAccounts, setAllAccounts] = useState<AccountListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountToRemove, setAccountToRemove] =
    useState<AccountGroupItem | null>(null);

  const getIcon = (iconName?: string) => {
    if (!iconName) return null;
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-6 w-6" /> : null;
  };

  // واکشی اطلاعات گروه
  const fetchGroupDetail = async () => {
    if (!session?.accessToken || !groupId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [groupData, accountsData] = await Promise.all([
        getAccountGroupById(groupId, session.accessToken),
        getAccountsList(session.accessToken),
      ]);
      setGroup(groupData);
      setAllAccounts(accountsData);
    } catch (err) {
      console.error("Error fetching group detail:", err);
      setError("خطا در دریافت اطلاعات گروه");
      toast({
        title: t("toast.error"),
        description: "خطا در دریافت اطلاعات گروه",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupDetail();
  }, [groupId, session?.accessToken]);

  // حذف حساب از گروه
  const handleRemoveAccount = async () => {
    if (!accountToRemove || !session?.accessToken) return;

    setIsUpdating(true);
    try {
      await removeGroupAccount(accountToRemove.id, session.accessToken);
      toast({
        title: t("toast.success"),
        description: "حساب با موفقیت از گروه حذف شد",
        variant: "success",
      });
      await fetchGroupDetail();
    } catch (error: any) {
      console.error("Error removing account:", error);
      toast({
        title: t("toast.error"),
        description: error.response?.data || "خطا در حذف حساب از گروه",
        variant: "error",
      });
    } finally {
      setIsUpdating(false);
      setAccountToRemove(null);
    }
  };

  // یافتن اطلاعات بانک برای هر حساب
  const getAccountBankInfo = (accountId: string) => {
    const account = allAccounts.find((acc) => acc.id === accountId);
    return {
      bankCode: account?.bankCode,
      bankName: account?.bankName,
    };
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <FixHeader returnUrl="/account-groups" />
        <div className="container mx-auto p-4 md:p-6 space-y-6 mt-14">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-9 w-32" />
            <Skeleton className="h-9 w-28" />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <Skeleton className="h-16 w-16 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-64" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 rounded-xl" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Error state
  if (error || !group) {
    return (
      <>
        <FixHeader returnUrl="/account-groups" />
        <div className="container mx-auto p-4 md:p-6 mt-14">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Folders className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">گروه یافت نشد</h2>
            <p className="text-muted-foreground mb-6">
              {error || "گروه مورد نظر یافت نشد"}
            </p>
            <Button onClick={() => router.push("/account-groups")}>
              بازگشت به لیست گروه‌ها
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <FixHeader returnUrl="/account-groups">
        <div className="flex gap-2">
          <Button
            variant="dashed"
            onClick={fetchGroupDetail}
            disabled={isUpdating}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isUpdating ? "animate-spin" : ""}`}
            />
            {!isMobile && t("common.refresh")}
          </Button>
          <CreateEditGroupDialog group={group} onSuccess={fetchGroupDetail} />
        </div>
      </FixHeader>

      <div className="container mx-auto p-4 md:p-6 space-y-6 mt-14">
        {/* اطلاعات گروه */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-xl"
                style={{
                  backgroundColor: `${group.color || "#360185"}20`,
                  color: group.color || "#360185",
                }}
              >
                {getIcon(group.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-1">{group.title}</h2>
                    {group.description && (
                      <p className="text-sm text-muted-foreground">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant={group.isEnable ? "success" : "secondary"}
                    appearance="light"
                  >
                    {group.isEnable ? "فعال" : "غیرفعال"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>رنگ:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded border"
                      style={{ backgroundColor: group.color }}
                    />
                    <span className="font-mono text-xs">{group.color}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* حساب‌های گروه */}
        <Card>
          <CardHeader className="py-4">
            <CardHeading>
              <CardTitle className="flex items-center gap-2">
                <Folders className="h-5 w-5" />
                حساب‌های گروه
                <Badge variant="secondary" appearance="light">
                  {group.items?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeading>
            <CardToolbar>
              <AddAccountsDialog
                groupId={groupId}
                existingAccountIds={
                  group.items?.map((item) => item.bankGatewayId) || []
                }
                onSuccess={fetchGroupDetail}
              />
            </CardToolbar>
          </CardHeader>

          <CardContent>
            {group.items && group.items.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {group.items.map((item) => {
                  const bankInfo = getAccountBankInfo(item.bankGatewayId);
                  return (
                    <GroupAccountCard
                      key={item.id}
                      account={item}
                      bankCode={bankInfo.bankCode}
                      bankName={bankInfo.bankName}
                      onRemove={setAccountToRemove}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed">
                <Folders className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground text-sm mb-4">
                  هنوز حسابی به این گروه اضافه نشده است
                </p>
                <AddAccountsDialog
                  groupId={groupId}
                  existingAccountIds={[]}
                  onSuccess={fetchGroupDetail}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Remove Account Dialog */}
      <AlertDialog
        open={!!accountToRemove}
        onOpenChange={(open) => !open && setAccountToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف حساب از گروه</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید حساب «{accountToRemove?.accountTitle}
              » را از این گروه حذف کنید؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveAccount}
              disabled={isUpdating}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                  در حال حذف...
                </>
              ) : (
                "حذف از گروه"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
