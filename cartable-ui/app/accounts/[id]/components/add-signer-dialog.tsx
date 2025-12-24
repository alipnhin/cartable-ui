/**
 * Add Signer Dialog Component
 * کامپوننت دیالوگ افزودن امضادار جدید
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
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, UserPlus, CheckCircle2, Loader2 } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import {
  getUsersList,
  addSigner,
  UserSelectItem,
} from "@/services/accountService";
import { Skeleton } from "@/components/ui/skeleton";

interface AddSignerDialogProps {
  accountId: string;
  existingSignerIds: string[];
  onAdd: () => void;
}

export function AddSignerDialog({
  accountId,
  existingSignerIds,
  onAdd,
}: AddSignerDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [users, setUsers] = useState<UserSelectItem[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // واکشی لیست کاربران
  useEffect(() => {
    const fetchUsers = async () => {
      if (!session?.accessToken || !open) return;

      setIsLoadingUsers(true);
      try {
        const data = await getUsersList();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: t("toast.error"),
          description: "خطا در دریافت لیست کاربران",
          variant: "error",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.accessToken, open]);

  // فیلتر کاربران: فقط کاربرانی که امضادار نیستند
  const availableUsers = users.filter(
    (user) => !existingSignerIds.includes(user.id)
  );

  // جستجو در کاربران
  const filteredUsers = availableUsers.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.userName?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUser = selected
    ? availableUsers.find((u) => u.id === selected)
    : null;

  const handleAdd = async () => {
    if (!selected || !selectedUser || !session?.accessToken) return;

    setIsAdding(true);
    try {
      await addSigner({
        userId: selectedUser.id,
        bankGatewayId: accountId,
        fullName: `${selectedUser.firstName} ${selectedUser.lastName}`,
      });
      toast({
        title: t("toast.success"),
        description: "امضادار با موفقیت اضافه شد",
        variant: "success",
      });
      onAdd();
      setOpen(false);
      setSelected(null);
      setSearch("");
    } catch (error) {
      console.error("Error adding signer:", error);
      toast({
        title: t("toast.error"),
        description: "خطا در افزودن امضادار",
        variant: "error",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelected(null);
      setSearch("");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t("accounts.addSigner") || "افزودن امضادار"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t("accounts.selectUser") || "انتخاب کاربر برای امضادار شدن"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden space-y-4">
          {/* جستجو */}
          <div className="space-y-2">
            <InputWrapper>
              <Search />
              <Input
                id="search"
                placeholder={
                  t("accounts.searchUserPlaceholder") ||
                  "نام، ایمیل یا نام کاربری را جستجو کنید..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10"
              />
            </InputWrapper>
          </div>

          {/* لیست کاربران */}
          <div className="space-y-2 overflow-y-auto max-h-[400px] pe-2">
            {isLoadingUsers ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                </div>
              ))
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-sm text-muted-foreground">
                  {search
                    ? "کاربری با این مشخصات یافت نشد"
                    : "همه کاربران قبلاً امضادار هستند"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelected(user.id)}
                  className={`w-full p-3 rounded-lg border transition-all text-right ${
                    selected === user.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {user.firstName} {user.lastName}
                        </h4>
                        {selected === user.id && (
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email || user.userName}
                      </p>
                      {user.phoneNumber && (
                        <Badge
                          variant="secondary"
                          className="mt-1 text-xs h-5 px-2"
                        >
                          {user.phoneNumber}
                        </Badge>
                      )}
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
            {t("common.buttons.cancel") || "لغو"}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selected || isAdding}
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
                {t("common.buttons.add") || "افزودن"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
