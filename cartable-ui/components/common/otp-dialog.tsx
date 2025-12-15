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

/**
 * Props for OTP Dialog Component
 * @property open - وضعیت باز/بسته بودن دیالوگ
 * @property onOpenChange - callback برای تغییر وضعیت دیالوگ
 * @property title - عنوان دیالوگ
 * @property description - توضیحات دیالوگ
 * @property onConfirm - callback برای تأیید کد OTP
 * @property onResend - callback اختیاری برای ارسال مجدد کد
 * @property isRequestingOtp - نمایش loading در حین درخواست ارسال کد
 */
interface OtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  isRequestingOtp?: boolean;
}

/**
 * OTP Dialog Component
 * کامپوننت دیالوگ ورود کد OTP با قابلیت‌های:
 * - نمایش loading هنگام درخواست ارسال کد
 * - ورود کد 6 رقمی با Auto-focus
 * - تایمر 2 دقیقه‌ای برای انقضا
 * - قابلیت ارسال مجدد کد بعد از انقضا
 * - پشتیبانی از موبایل (Drawer) و دسکتاپ (Dialog)
 */
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

  // در حالت درخواست OTP، صفحه loading نمایش داده می‌شود
  if (isRequestingOtp) {
    if (isMobile) {
      return (
        <Drawer open={open} onOpenChange={onOpenChange} dismissible={false}>
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
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {t("otp.resending")}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} dismissible={false}>
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
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
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
/**
 * Props for OTP Form
 * @property onConfirm - callback برای تأیید کد OTP
 * @property onResend - callback اختیاری برای ارسال مجدد کد
 * @property onClose - callback برای بستن فرم
 */
interface OtpFormProps {
  onConfirm: (otp: string) => Promise<void>;
  onResend?: () => Promise<void>;
  onClose: () => void;
}

/**
 * OTP Form Component
 * فرم ورود کد OTP با قابلیت‌های:
 * - تایمر 2 دقیقه‌ای (120 ثانیه)
 * - دکمه ارسال مجدد بعد از انقضای تایمر
 * - اعتبارسنجی طول کد (حداقل 5 رقم)
 * - نمایش loading در حین ارسال
 */
function OtpForm({ onConfirm, onResend, onClose }: OtpFormProps) {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 دقیقه
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  /**
   * تایمر شمارش معکوس
   * هر ثانیه مقدار timeLeft را یک واحد کم می‌کند
   * بعد از رسیدن به صفر، تایمر متوقف می‌شود
   */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /**
   * ارسال کد OTP برای تأیید
   * حداقل طول کد باید 5 رقم باشد (6 رقم ایده‌آل است)
   */
  const handleSubmit = async () => {
    if (otp.length < 6) return;

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

  /**
   * ارسال مجدد کد OTP
   * تایمر را به 120 ثانیه ریست می‌کند و فیلد OTP را پاک می‌کند
   */
  const handleResend = async () => {
    if (!onResend) return;

    setIsResending(true);
    try {
      await onResend();
      setTimeLeft(120); // ریست تایمر به 2 دقیقه
      setOtp("");
    } catch (error) {
      console.error("OTP resend failed:", error);
    } finally {
      setIsResending(false);
    }
  };

  /**
   * فرمت کردن زمان به صورت mm:ss
   * @param seconds - تعداد ثانیه‌ها
   * @returns رشته فرمت شده به صورت "m:ss"
   */
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4 py-4">
      {/* OTP Input */}
      <div className="space-y-2">
        <label className=" font-medium mb-2">{t("otp.enterCode")}</label>
        <OtpInput value={otp} onChange={setOtp} />
      </div>

      {/* Timer and Resend */}
      <div className="flex items-center justify-between ">
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
          disabled={otp.length < 6 || isLoading}
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
/**
 * Props for OTP Input
 * @property value - مقدار کامل کد OTP (رشته‌ای از ارقام)
 * @property onChange - callback برای تغییر مقدار
 * @property length - تعداد خانه‌های ورودی (پیش‌فرض 6)
 */
interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

/**
 * OTP Input Component
 * کامپوننت ورود کد OTP با ویژگی‌های:
 * - 6 خانه جداگانه برای ارقام
 * - Auto-focus به خانه بعدی بعد از ورود رقم
 * - پشتیبانی از Backspace برای برگشت به خانه قبلی
 * - پشتیبانی از Paste (چسباندن کد کامل)
 * - فقط ارقام مجاز هستند (اعتبارسنجی با regex)
 * - کیبورد عددی در موبایل (inputMode="numeric")
 */
function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const [inputs, setInputs] = useState<string[]>(Array(length).fill(""));

  /**
   * همگام‌سازی state داخلی با value خارجی
   */
  useEffect(() => {
    const newInputs = value.split("").slice(0, length);
    while (newInputs.length < length) {
      newInputs.push("");
    }
    setInputs(newInputs);
  }, [value, length]);

  /**
   * مدیریت تغییر مقدار یک خانه
   * - فقط ارقام مجاز هستند
   * - بعد از ورود رقم، فوکوس به خانه بعدی منتقل می‌شود
   */
  const handleChange = (index: number, newValue: string) => {
    // فقط ارقام مجاز هستند
    if (newValue && !/^\d$/.test(newValue)) return;

    const newInputs = [...inputs];
    newInputs[index] = newValue;
    setInputs(newInputs);
    onChange(newInputs.join(""));

    // Auto-focus به خانه بعدی
    if (newValue && index < length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  /**
   * مدیریت کلید Backspace
   * اگر خانه فعلی خالی باشد، فوکوس به خانه قبلی منتقل می‌شود
   */
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !inputs[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  /**
   * مدیریت Paste (چسباندن کد)
   * فقط ارقام از متن چسبانده شده استخراج می‌شوند
   * بعد از paste، فوکوس به آخرین خانه پر شده منتقل می‌شود
   */
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

    // فوکوس به آخرین خانه پر شده
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
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="w-14 h-14 text-center text-lg font-semibold"
          autoComplete="off"
          autoFocus={index === 0}
        />
      ))}
    </div>
  );
}
