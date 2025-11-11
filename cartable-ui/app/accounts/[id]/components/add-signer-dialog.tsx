/**
 * Add Signer Dialog Component
 * کامپوننت دیالوگ افزودن امضادار جدید
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, UserPlus, CheckCircle2 } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { mockUsers } from "@/mocks/mockUsers";

interface AddSignerDialogProps {
  accountId: string;
  existingSignerIds: string[];
  onAdd: (userId: string) => void;
}

export function AddSignerDialog({
  accountId,
  existingSignerIds,
  onAdd,
}: AddSignerDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  // فیلتر کاربران: فقط کاربرانی که امضادار نیستند
  const availableUsers = mockUsers.filter(
    (user) => !existingSignerIds.includes(user.id)
  );

  // جستجو در کاربران
  const filteredUsers = availableUsers.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.role.toLowerCase().includes(search.toLowerCase())
  );

  const selectedUser = selected
    ? availableUsers.find((u) => u.id === selected)
    : null;

  const handleAdd = () => {
    if (selected) {
      onAdd(selected);
      setOpen(false);
      setSelected(null);
      setSearch("");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelected(null);
      setSearch("");
    }
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`;
    }
    return fullName.substring(0, 2);
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
            <Label htmlFor="search">
              {t("common.search") || "جستجو"}
            </Label>
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder={
                  t("accounts.searchUserPlaceholder") ||
                  "نام، ایمیل یا نقش کاربر را جستجو کنید..."
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10"
              />
            </div>
          </div>

          {/* لیست کاربران */}
          <div className="space-y-2 overflow-y-auto max-h-[400px] pe-2">
            {filteredUsers.length === 0 ? (
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
                      <AvatarImage src={user.avatar} alt={user.fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(user.fullName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {user.fullName}
                        </h4>
                        {selected === user.id && (
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                      <Badge
                        variant="secondary"
                        className="mt-1 text-xs h-5 px-2"
                      >
                        {user.role}
                      </Badge>
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
          >
            {t("common.buttons.cancel") || "لغو"}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selected}
            className="flex-1 gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("common.buttons.add") || "افزودن"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
