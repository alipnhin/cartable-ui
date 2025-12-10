/**
 * Minimum Signatures Form Component
 * کامپوننت فرم ویرایش حداقل امضا با طراحی مدرن
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Edit2,
  Minus,
  Plus,
  AlertCircle,
  Loader2,
  PenLine,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface MinimumSignaturesFormProps {
  currentValue: number;
  maxValue: number;
  onSave: (value: number) => void;
  isLoading?: boolean;
}

export function MinimumSignaturesForm({
  currentValue,
  maxValue,
  onSave,
  isLoading = false,
}: MinimumSignaturesFormProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentValue);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleIncrement = () => {
    if (value < maxValue) {
      setValue(value + 1);
      setError("");
    }
  };

  const handleDecrement = () => {
    if (value > 1) {
      setValue(value - 1);
      setError("");
    }
  };

  const handleSave = () => {
    if (value < 1) {
      setError("حداقل امضا باید حداقل 1 باشد");
      return;
    }
    if (value > maxValue) {
      setError(`حداکثر ${maxValue} امضا می‌توانید تعیین کنید`);
      return;
    }
    if (maxValue === 0) {
      setError("ابتدا امضادار اضافه کنید");
      return;
    }
    setError("");
    setShowConfirmDialog(true);
  };

  const confirmSave = () => {
    onSave(value);
    setIsEditing(false);
    setShowConfirmDialog(false);
  };

  const handleCancel = () => {
    setValue(currentValue);
    setError("");
    setIsEditing(false);
  };

  const handleStartEdit = () => {
    setValue(currentValue);
    setIsEditing(true);
  };

  if (!isEditing) {
    return (
      <Card className="p-4 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <PenLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label className="text-sm text-muted-foreground mb-1 block">
                {t("accounts.minSignatures") || "حداقل امضای مورد نیاز"}
              </Label>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">
                  {currentValue}
                </span>
                <span className="text-sm text-muted-foreground">
                  از {maxValue} امضادار
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartEdit}
            className="gap-2"
            disabled={isLoading}
          >
            <Edit2 className="h-4 w-4" />
            {t("common.buttons.edit") || "ویرایش"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-4 border-2 border-primary/30 bg-primary/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10">
              <PenLine className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label className="text-sm font-medium mb-2 block">
                ویرایش حداقل امضا
              </Label>

              {/* Counter */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-10 p-0"
                  onClick={handleDecrement}
                  disabled={value <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <div className="flex items-baseline gap-1 min-w-30 justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {value}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {maxValue}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-10 p-0"
                  onClick={handleIncrement}
                  disabled={value >= maxValue}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={handleCancel}
              disabled={isLoading}
            >
              {t("common.buttons.cancel") || "لغو"}
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isLoading || value === currentValue}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال ذخیره...
                </>
              ) : (
                t("common.buttons.save") || "ذخیره"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg mt-3">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {value !== currentValue && !error && (
          <div className="mt-3 text-xs text-muted-foreground">
            تغییر از {currentValue} به {value} امضا
          </div>
        )}
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تغییر حداقل امضا</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید حداقل امضای مورد نیاز را از{" "}
              <Badge variant="secondary" className="mx-1">
                {currentValue}
              </Badge>
              به{" "}
              <Badge variant="primary" className="mx-1">
                {value}
              </Badge>
              تغییر دهید؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>
              تأیید و ذخیره
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
