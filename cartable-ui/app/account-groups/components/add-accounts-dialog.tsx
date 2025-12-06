/**
 * Add Accounts to Group Dialog
 * دیالوگ افزودن حساب به گروه
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, InputWrapper } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BankLogo } from "@/components/common/bank-logo";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2, UserPlus } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { getAccountsList, AccountListItem } from "@/services/accountService";
import { addGroupAccounts } from "@/services/accountGroupService";
import { Skeleton } from "@/components/ui/skeleton";

interface AddAccountsDialogProps {
  groupId: string;
  existingAccountIds: string[];
  onSuccess: () => void;
}

export function AddAccountsDialog({
  groupId,
  existingAccountIds,
  onSuccess,
}: AddAccountsDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [accounts, setAccounts] = useState<AccountListItem[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // واکشی لیست حساب‌ها
  useEffect(() => {
    const fetchAccounts = async () => {
      if (!session?.accessToken || !open) return;

      setIsLoadingAccounts(true);
      try {
        const data = await getAccountsList(session.accessToken);
        setAccounts(data);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast({
          title: t("toast.error"),
          description: "خطا در دریافت لیست حساب‌ها",
          variant: "error",
        });
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, [session?.accessToken, open]);

  // فیلتر حساب‌ها: فقط حساب‌هایی که در گروه نیستند
  const availableAccounts = accounts.filter(
    (account) => !existingAccountIds.includes(account.id)
  );

  // جستجو در حساب‌ها
  const filteredAccounts = availableAccounts.filter(
    (account) =>
      account.title.toLowerCase().includes(search.toLowerCase()) ||
      account.accountNumber.includes(search) ||
      account.shebaNumber.includes(search) ||
      account.bankName.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleAccount = (accountId: string) => {
    setSelectedIds((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAccounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAccounts.map((acc) => acc.id));
    }
  };

  const handleAdd = async () => {
    if (selectedIds.length === 0 || !session?.accessToken) return;

    setIsAdding(true);
    try {
      await addGroupAccounts(
        {
          groupId,
          bankGatewayIds: selectedIds,
        },
        session.accessToken
      );
      toast({
        title: t("toast.success"),
        description: `${selectedIds.length} حساب با موفقیت اضافه شد`,
        variant: "success",
      });
      onSuccess();
      setOpen(false);
      setSelectedIds([]);
      setSearch("");
    } catch (error: any) {
      console.error("Error adding accounts:", error);
      toast({
        title: t("toast.error"),
        description: error.response?.data || "خطا در افزودن حساب‌ها",
        variant: "error",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedIds([]);
      setSearch("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          افزودن حساب
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            افزودن حساب به گروه
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {/* جستجو و انتخاب همه */}
          <div className="space-y-3">
            <InputWrapper>
              <Search className="h-4 w-4" />
              <Input
                placeholder="جستجو در عنوان، شماره حساب یا شبا..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10"
              />
            </InputWrapper>
            {filteredAccounts.length > 0 && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  className="gap-2"
                >
                  <Checkbox
                    checked={
                      selectedIds.length === filteredAccounts.length &&
                      filteredAccounts.length > 0
                    }
                  />
                  انتخاب همه ({filteredAccounts.length})
                </Button>
                {selectedIds.length > 0 && (
                  <Badge variant="primary">
                    {selectedIds.length} حساب انتخاب شده
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* لیست حساب‌ها */}
          <div className="space-y-2 overflow-y-auto max-h-[450px] pe-2">
            {isLoadingAccounts ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredAccounts.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  {search
                    ? "حسابی با این مشخصات یافت نشد"
                    : availableAccounts.length === 0
                    ? "همه حساب‌ها در این گروه هستند"
                    : "حسابی یافت نشد"}
                </p>
              </div>
            ) : (
              filteredAccounts.map((account) => (
                <button
                  key={account.id}
                  onClick={() => handleToggleAccount(account.id)}
                  className={`w-full p-3 rounded-lg border transition-all text-right ${
                    selectedIds.includes(account.id)
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox checked={selectedIds.includes(account.id)} />
                    <BankLogo bankCode={account.bankCode} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {account.title}
                        </h4>
                        <Badge
                          variant={account.isEnable ? "success" : "secondary"}
                          appearance="light"
                          className="shrink-0"
                        >
                          {account.isEnable ? "فعال" : "غیرفعال"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{account.bankName}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {account.accountNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="flex-1"
            disabled={isAdding}
          >
            انصراف
          </Button>
          <Button
            onClick={handleAdd}
            disabled={selectedIds.length === 0 || isAdding}
            className="flex-1 gap-2"
          >
            {isAdding ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال افزودن...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                افزودن ({selectedIds.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
