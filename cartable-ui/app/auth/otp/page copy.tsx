"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useTranslation from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import { Shield, ArrowRight } from "lucide-react";

export default function OTPPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const phone = searchParams.get("phone") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer برای کد OTP
  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // انتقال فوکوس به input بعدی
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);

    const nextEmptyIndex = newOtp.length < 6 ? newOtp.length : 5;
    inputRefs.current[nextEmptyIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast({
        title: t("common.error"),
        description: t("auth.enterCompleteCode"),
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      // شبیه‌سازی API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: t("common.success"),
        description: t("auth.loginSuccess"),
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("auth.invalidCode"),
        variant: "error",
      });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: t("common.success"),
        description: t("auth.codeSent"),
      });
      setTimeLeft(120);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast({
        title: t("common.error"),
        description: t("auth.resendError"),
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">
            {t("auth.verificationCode")}
          </CardTitle>
          <CardDescription>
            {t("auth.codeSentTo")} {phone}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* OTP Inputs */}
          <div className="flex justify-center gap-2" dir="ltr">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 text-center text-lg font-bold"
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Timer */}
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-muted-foreground">
                {t("auth.codeExpiresIn")} {formatTime(timeLeft)}
              </p>
            ) : (
              <p className="text-sm text-destructive">
                {t("auth.codeExpired")}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              className="w-full"
              disabled={isLoading || otp.some((d) => !d)}
            >
              {isLoading ? t("common.loading") : t("auth.verify")}
            </Button>

            <Button
              variant="outline"
              onClick={handleResend}
              className="w-full"
              disabled={isLoading || !canResend}
            >
              {t("auth.resendCode")}
            </Button>

            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="w-full gap-2"
              disabled={isLoading}
            >
              <ArrowRight className="h-4 w-4" />
              {t("auth.backToLogin")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
