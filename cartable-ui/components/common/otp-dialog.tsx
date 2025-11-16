"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  /** آیا در حال درخواست ارسال کد OTP است */
  isRequestingOtp?: boolean;
}

export function OtpDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onResend,
  isRequestingOtp = false,
}: OtpDialogProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  // اگر در حال درخواست OTP است، loading نمایش بده
  if (isRequestingOtp) {
    if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={onOpenChange}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription>{description}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 pb-6">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t("otp.requesting")}
                </p>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      );
    }

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("otp.requesting")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-4">
            <OtpForm
              onConfirm={onConfirm}
              onResend={onResend}
              onClose={() => onOpenChange(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <OtpForm
          onConfirm={onConfirm}
          onResend={onResend}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

// =====================================
// OTP Form Component
// =====================================
interface OtpFormProps {
  onConfirm: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  onClose: () => void;
}

function OtpForm({ onConfirm, onResend, onClose }: OtpFormProps) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async () => {
    if (otp.length < 5) return;

    setIsLoading(true);
    try {
      await onConfirm(otp);
      onClose();
    } catch (error) {
      console.error("OTP confirmation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!onResend) return;

    setIsResending(true);
    try {
      await onResend();
      setTimeLeft(120); // Reset timer
      setOtp("");
    } catch (error) {
      console.error("OTP resend failed:", error);
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 py-4">
      {/* OTP Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium mb-2">{t("otp.enterCode")}</label>
        <OtpInput value={otp} onChange={setOtp} />
      </div>

      {/* Timer and Resend */}
      <div className="flex items-center justify-between text-sm">
        {timeLeft > 0 ? (
          <span className="text-muted-foreground">
            {t("otp.expiresIn")}:{" "}
            <span className="text-blue-600 ms-2">{formatTime(timeLeft)}</span>
          </span>
        ) : (
          <span className="text-destructive">{t("otp.expired")}</span>
        )}

        {timeLeft === 0 && onResend && (
          <Button
            variant="dashed"
            size="sm"
            onClick={handleResend}
            disabled={isResending}
            className="h-auto p-0"
          >
            {isResending ? (
              <>
                <Loader2 className="me-2 h-3 w-3 animate-spin" />
                {t("otp.resending")}
              </>
            ) : (
              t("otp.resend")
            )}
          </Button>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
          className="flex-1"
        >
          {t("common.buttons.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={otp.length < 5 || isLoading}
          className="flex-1"
        >
          {isLoading && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {t("common.buttons.confirm")}
        </Button>
      </div>
    </div>
  );
}

// =====================================
// OTP Input Component
// =====================================
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

function OtpInput({ value, onChange, length = 5 }: OtpInputProps) {
  const [inputs, setInputs] = useState<string[]>(Array(length).fill(""));

  useEffect(() => {
    const newInputs = value.split("").slice(0, length);
    while (newInputs.length < length) {
      newInputs.push("");
    }
    setInputs(newInputs);
  }, [value, length]);

  const handleChange = (index: number, newValue: string) => {
    // Only allow digits
    if (newValue && !/^\d$/.test(newValue)) return;

    const newInputs = [...inputs];
    newInputs[index] = newValue;
    setInputs(newInputs);
    onChange(newInputs.join(""));

    // Auto-focus next input
    if (newValue && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    const pastedDigits = pastedData.replace(/\D/g, "").slice(0, length);

    const newInputs = [...inputs];
    for (let i = 0; i < pastedDigits.length; i++) {
      newInputs[i] = pastedDigits[i];
    }
    setInputs(newInputs);
    onChange(newInputs.join(""));

    // Focus last filled input
    const lastFilledIndex = Math.min(pastedDigits.length - 1, length - 1);
    const lastInput = document.getElementById(`otp-${lastFilledIndex}`);
    lastInput?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" dir="ltr">
      {inputs.map((digit, index) => (
        <Input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-lg font-semibold"
          autoComplete="off"
        />
      ))}
    </div>
  );
}
