/**
 * Minimum Signatures Form Component
 * کامپوننت فرم ویرایش حداقل امضا
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Edit2, Save, X, AlertCircle } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface MinimumSignaturesFormProps {
  currentValue: number;
  maxValue: number;
  onSave: (value: number) => void;
}

export function MinimumSignaturesForm({
  currentValue,
  maxValue,
  onSave,
}: MinimumSignaturesFormProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentValue);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (value < 1) {
      setError("حداقل امضا باید حداقل 1 باشد");
      return;
    }
    if (value > maxValue) {
      setError(`حداکثر ${maxValue} امضا می‌توانید تعیین کنید`);
      return;
    }
    setError("");
    onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(currentValue);
    setError("");
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Label className="text-sm font-medium text-muted-foreground mb-2 block">
              {t("accounts.minSignatures") || "حداقل امضای مورد نیاز"}
            </Label>
            <div className="flex items-baseline gap-3">
              <p className="text-4xl font-bold text-primary">{currentValue}</p>
              <span className="text-sm text-muted-foreground">
                از {maxValue} امضادار
              </span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="gap-2"
          >
            <Edit2 className="h-4 w-4" />
            {t("common.buttons.edit") || "ویرایش"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-muted/50 border-2 border-primary/30">
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">
            ویرایش حداقل امضای مورد نیاز
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-auto p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                id="minSignatures"
                type="number"
                min={1}
                max={maxValue}
                value={value}
                onChange={(e) => {
                  setValue(Number(e.target.value));
                  setError("");
                }}
                className="text-lg font-semibold"
              />
            </div>
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              از {maxValue}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            تعداد حداقل امضاهای مورد نیاز برای تأیید دستورات پرداخت را مشخص کنید
          </p>

          {error && (
            <div className="flex items-start gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSave} className="flex-1 gap-2">
            <Save className="h-4 w-4" />
            {t("common.buttons.save") || "ذخیره"}
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 gap-2"
          >
            <X className="h-4 w-4" />
            {t("common.buttons.cancel") || "لغو"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
