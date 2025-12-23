/**
 * Account Groups List Page
 * صفحه لیست گروه‌های حساب
 * Path: app/account-groups/page.tsx
 */

"use client";

import { useState, useMemo, useEffect } from "react";
import { AppLayout, PageHeader } from "@/components/layout";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useAccountGroupStore } from "@/store/account-group-store";
import { GroupTable } from "./components/group-table";
import { GroupCard } from "./components/group-card";
import { CreateEditGroupDialog } from "./components/create-edit-group-dialog";
import {
  useAccountGroupsQuery,
  useAccountGroupMutations,
} from "@/hooks/useAccountGroupsQuery";
import type { AccountGroupDetail } from "@/types/account-group-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/lib/error-handler";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { LayoutGrid, List, Search, Loader2 } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import { useRegisterRefresh } from "@/contexts/pull-to-refresh-context";

type DialogState = {
  type: "edit" | "delete" | "toggle" | null;
  group: AccountGroupDetail | null;
};

export default function AccountGroupsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const triggerRefresh = useAccountGroupStore((s) => s.triggerRefresh);

  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    group: null,
  });

  // Set default view mode based on device
  useEffect(() => {
    if (isMobile) {
      setViewMode("card");
    }
  }, [isMobile]);

  // استفاده از React Query
  const {
    groups,
    isLoading,
    error: queryError,
    refetch,
  } = useAccountGroupsQuery({
    filterParams: {
      pageNumber: 1,
      pageSize: 100,
      title: searchText || undefined,
      isEnable:
        selectedStatus === "all" ? undefined : selectedStatus === "active",
    },
  });

  // ثبت refetch برای Pull-to-Refresh
  useRegisterRefresh(async () => {
    await refetch();
  });

  // استفاده از mutations
  const mutations = useAccountGroupMutations();

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

  // فیلتر جستجو (client-side برای واکنش سریع‌تر)
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchSearch =
        !searchText ||
        group.title.toLowerCase().includes(searchText.toLowerCase()) ||
        group.description?.toLowerCase().includes(searchText.toLowerCase());
      return matchSearch;
    });
  }, [groups, searchText]);

  // تغییر وضعیت
  const handleToggleStatus = async () => {
    if (!dialogState.group) return;

    const currentGroup = dialogState.group;
    mutations.changeStatus.mutate(
      {
        bankGatewayGroupId: currentGroup.id,
        status: !currentGroup.isEnable,
      },
      {
        onSuccess: () => {
          toast({
            title: t("toast.success"),
            description: `گروه با موفقیت ${
              currentGroup.isEnable ? "غیرفعال" : "فعال"
            } شد`,
            variant: "success",
          });
          triggerRefresh();
          setDialogState({ type: null, group: null });
        },
        onError: (error) => {
          toast({
            title: t("toast.error"),
            description: getErrorMessage(error),
            variant: "error",
          });
        },
      }
    );
  };

  // حذف گروه
  const handleDelete = async () => {
    if (!dialogState.group) return;

    mutations.delete.mutate(dialogState.group.id, {
      onSuccess: () => {
        toast({
          title: t("toast.success"),
          description: "گروه با موفقیت حذف شد",
          variant: "success",
        });
        triggerRefresh();
        setDialogState({ type: null, group: null });
      },
      onError: (error) => {
        toast({
          title: t("toast.error"),
          description: getErrorMessage(error),
          variant: "error",
        });
      },
    });
  };

  // Skeleton برای لودینگ
  const GroupsSkeleton = () => (
    <div className="space-y-4">
      {viewMode === "card" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <div className="h-2 bg-primary/20" />
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3">
                  <Skeleton className="h-12 w-12 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
                <div className="flex justify-between pt-3 border-t">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex gap-4 pb-3 border-b">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 flex-1" />
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                  {Array.from({ length: 6 }).map((_, j) => (
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

  const pageContent = (
    <>
      {/* فیلترها و کنترل‌ها */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* سمت راست: جستجو و دکمه افزودن */}
        <div className="flex gap-2 w-full sm:w-auto">
          <InputGroup className="flex-1 sm:w-72 h-10">
            <InputGroupInput
              placeholder="جستجو در عنوان یا شرح..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="h-10"
            />
            <InputGroupAddon>
              <Search className="h-4 w-4 ms-2" />
            </InputGroupAddon>
          </InputGroup>
        </div>

        {/* سمت چپ: فیلترها و view toggle */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* فیلتر وضعیت */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-28 h-10">
              <SelectValue placeholder="وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="active">فعال</SelectItem>
              <SelectItem value="inactive">غیرفعال</SelectItem>
            </SelectContent>
          </Select>

          {/* View Toggle */}
          <div className="flex items-center border rounded-md h-10">
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="h-full px-3 rounded-l-none border-0"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "card" ? "secondary" : "ghost"}
              size="sm"
              className="h-full px-3 rounded-r-none border-0"
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
          <GroupsSkeleton />
        ) : filteredGroups.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 px-4">
                  <div className="rounded-full bg-primary/10 p-6 mb-6">
                    <LayoutGrid className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {searchText || selectedStatus !== "all"
                      ? "گروهی یافت نشد"
                      : "هنوز گروهی ایجاد نشده است"}
                  </h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    {searchText || selectedStatus !== "all"
                      ? "با فیلترهای فعلی هیچ گروهی یافت نشد. لطفاً فیلترها را تغییر دهید یا جستجوی دیگری انجام دهید."
                      : "برای مدیریت بهتر حساب‌های خود، گروه‌های مختلفی ایجاد کنید و حساب‌ها را در آن‌ها دسته‌بندی نمایید."}
                  </p>
                  {!searchText && selectedStatus === "all" && (
                    <CreateEditGroupDialog
                      onSuccess={() => {
                        refetch();
                        triggerRefresh();
                      }}
                      trigger={
                        <Button size="lg" className="gap-2">
                          <LayoutGrid className="h-5 w-5" />
                          ایجاد اولین گروه
                        </Button>
                      }
                    />
                  )}
                </CardContent>
              </Card>
            ) : viewMode === "card" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    group={group}
                    onEdit={(g) => setDialogState({ type: "edit", group: g })}
                    onToggleStatus={(g) =>
                      setDialogState({ type: "toggle", group: g })
                    }
                    onDelete={(g) => setDialogState({ type: "delete", group: g })}
                  />
                ))}
              </div>
            ) : (
              <GroupTable
                groups={filteredGroups}
                onEdit={(g) => setDialogState({ type: "edit", group: g })}
                onToggleStatus={(g) => setDialogState({ type: "toggle", group: g })}
                onDelete={(g) => setDialogState({ type: "delete", group: g })}
              />
            )}
      </div>

      {/* تعداد نتایج */}
      {!isLoading && filteredGroups.length > 0 && (
        <div className="mt-4 text-sm text-muted-foreground text-center">
          نمایش {filteredGroups.length} از {groups.length} گروه
        </div>
      )}
    </>
  );

  return (
    <AppLayout>
      <PageTitle title="مدیریت گروه حساب" />
      <PageHeader
        title="مدیریت گروه حساب"
        description="مشاهده، ایجاد و مدیریت گروه‌های حساب"
        actions={
          <CreateEditGroupDialog
            onSuccess={() => {
              refetch();
              triggerRefresh();
            }}
          />
        }
      />

      {pageContent}

      {/* Edit Dialog */}
      {dialogState.type === "edit" && dialogState.group && (
        <CreateEditGroupDialog
          group={dialogState.group}
          onSuccess={() => {
            refetch();
            triggerRefresh();
            setDialogState({ type: null, group: null });
          }}
          trigger={<div />}
        />
      )}

      {/* Toggle Status Dialog */}
      <AlertDialog
        open={dialogState.type === "toggle"}
        onOpenChange={(open) =>
          !open && setDialogState({ type: null, group: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تغییر وضعیت گروه</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید این گروه را{" "}
              {dialogState.group?.isEnable ? "غیرفعال" : "فعال"} کنید؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutations.changeStatus.isPending}>
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              disabled={mutations.changeStatus.isPending}
            >
              {mutations.changeStatus.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                  در حال انجام...
                </>
              ) : (
                "تأیید"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog
        open={dialogState.type === "delete"}
        onOpenChange={(open) =>
          !open && setDialogState({ type: null, group: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف گروه حساب</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید گروه «{dialogState.group?.title}» را
              حذف کنید؟ این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={mutations.delete.isPending}>
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={mutations.delete.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {mutations.delete.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin me-2" />
                  در حال حذف...
                </>
              ) : (
                "حذف"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
