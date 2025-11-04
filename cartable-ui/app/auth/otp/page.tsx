"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";

import { useTranslation } from "react-i18next";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function OTPPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const phone = searchParams.get("phone") || "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [canResend, setCanResend] = useState(false);
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

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // جلوگیری از ریلود صفحه

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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardContent>
            <form onSubmit={handleVerify}>
              <FieldLegend className="font-bold">
                {t("auth.verificationCodeTitle")}
              </FieldLegend>
              <FieldDescription>
                {t("auth.codeSentTo")}
                {phone}
              </FieldDescription>

              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="otp" className="mt-8">
                    {t("auth.verificationCode")}
                  </FieldLabel>
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
                        className="w-10 h-12 text-center text-lg font-bold"
                        disabled={isLoading}
                      />
                    ))}
                  </div>
                  <FieldDescription>
                    {timeLeft > 0 ? (
                      <>
                        {t("auth.codeExpiresIn")} {formatTime(timeLeft)}
                      </>
                    ) : (
                      <span className="text-destructive">
                        {t("auth.codeExpired")}
                      </span>
                    )}
                  </FieldDescription>
                </Field>

                <FieldGroup>
                  <Button
                    type="submit"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? t("common.loading") : t("auth.verify")}
                  </Button>
                  <FieldDescription className="text-center">
                    {t("auth.didntReceiveCode")}{" "}
                    <Button
                      variant="foreground"
                      type="button"
                      onClick={handleResend}
                      disabled={isLoading || !canResend}
                      className="p-0 h-auto"
                    >
                      {t("auth.resendCode")}
                    </Button>
                  </FieldDescription>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
