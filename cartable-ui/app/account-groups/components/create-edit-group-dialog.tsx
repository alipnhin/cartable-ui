/**
 * Create/Edit Account Group Dialog
 * دیالوگ ایجاد و ویرایش گروه حساب
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Loader2, Folders } from "lucide-react";
import { IconPicker } from "./icon-picker";
import { ColorPicker } from "./color-picker";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import type { AccountGroupDetail } from "@/types/account-group-types";
import { useAccountGroupMutations } from "@/hooks/useAccountGroupsQuery";
import { getErrorMessage } from "@/lib/error-handler";

interface CreateEditGroupDialogProps {
  group?: AccountGroupDetail | null;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateEditGroupDialog({
  group,
  onSuccess,
  trigger,
}: CreateEditGroupDialogProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // استفاده از mutations
  const mutations = useAccountGroupMutations();

  const isEditMode = !!group;

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Folder",
    color: "#360185",
    isEnable: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // پر کردن فرم در حالت ویرایش
  useEffect(() => {
    if (group && open) {
      setFormData({
        title: group.title || "",
        description: group.description || "",
        icon: group.icon || "Folder",
        color: group.color || "#360185",
        isEnable: group.isEnable ?? true,
      });
    }
  }, [group, open]);

  // اعتبارسنجی
  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "عنوان گروه الزامی است";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if (isEditMode && group) {
      // ویرایش
      mutations.edit.mutate(
        {
          id: group.id,
          ...formData,
        },
        {
          onSuccess: () => {
            toast({
              title: t("toast.success"),
              description: "گروه با موفقیت ویرایش شد",
              variant: "success",
            });
            setOpen(false);
            onSuccess?.();
            handleReset();
          },
          onError: (error) => {
            const errorMessage = getErrorMessage(error);
            toast({
              title: t("toast.error"),
              description: errorMessage,
              variant: "error",
            });
          },
        }
      );
    } else {
      // ایجاد
      mutations.create.mutate(formData, {
        onSuccess: (newGroupId) => {
          toast({
            title: t("toast.success"),
            description: "گروه با موفقیت ایجاد شد",
            variant: "success",
          });
          setOpen(false);
          onSuccess?.();
          handleReset();
          // انتقال به صفحه جزئیات برای افزودن حساب
          router.push(`/account-groups/${newGroupId}`);
        },
        onError: (error) => {
          const errorMessage = getErrorMessage(error);
          toast({
            title: t("toast.error"),
            description: errorMessage,
            variant: "error",
          });
        },
      });
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      icon: "Folder",
      color: "#360185",
      isEnable: true,
    });
    setErrors({});
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      handleReset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            {isEditMode ? (
              <>
                <Edit2 className="h-4 w-4" />
                ویرایش گروه
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                گروه جدید
              </>
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folders className="h-5 w-5" />
            {isEditMode ? "ویرایش گروه حساب" : "ایجاد گروه حساب جدید"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* عنوان */}
          <div className="space-y-2">
            <Label htmlFor="title">
              عنوان گروه <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="مثال: صندوق درآمد ثابت"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className={errors.title ? "border-destructive" : ""}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          {/* شرح */}
          <div className="space-y-2">
            <Label htmlFor="description">شرح</Label>
            <Textarea
              id="description"
              placeholder="توضیحات اختیاری درباره این گروه..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* آیکون و رنگ */}
          <div className="grid grid-cols-2 gap-4">
            <IconPicker
              label="آیکون"
              value={formData.icon}
              onChange={(icon) => setFormData({ ...formData, icon })}
            />
            <ColorPicker
              label="رنگ"
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />
          </div>

          {/* وضعیت */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="space-y-0.5">
              <Label htmlFor="isEnable" className="text-sm font-medium">
                وضعیت فعال
              </Label>
              <p className="text-xs text-muted-foreground">
                گروه برای فیلتر قابل مشاهده باشد
              </p>
            </div>
            <Switch
              id="isEnable"
              checked={formData.isEnable}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isEnable: checked })
              }
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={mutations.create.isPending || mutations.edit.isPending}
              className="flex-1"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={mutations.create.isPending || mutations.edit.isPending}
              className="flex-1 gap-2"
            >
              {(mutations.create.isPending || mutations.edit.isPending) ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : isEditMode ? (
                "ذخیره تغییرات"
              ) : (
                "ایجاد گروه"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
