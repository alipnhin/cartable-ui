/**
 * Error Boundary Component
 * کامپوننت مرز خطا
 *
 * این کامپوننت زمانی نمایش داده می‌شود که:
 * - خطای runtime در کامپوننت‌های React رخ دهد
 * - خطایی در سمت client یا server اتفاق بیفتد
 *
 * @module app/error
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  RiAlertLine,
  RiHomeLine,
  RiRefreshLine,
  RiCustomerService2Line,
} from "@remixicon/react";
import useTranslation from "@/hooks/useTranslation";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Log خطا برای debugging
    console.error("Error caught by error boundary:", error);
  }, [error]);

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-destructive/5 to-background p-4">
      <div className="w-full max-w-2xl">
        {/* Icon و عنوان */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 animate-pulse">
            <RiAlertLine className="h-12 w-12 text-destructive" />
          </div>

          <h1 className="mb-2 text-6xl font-black text-foreground">
            {t("errors.500.subtitle")}
          </h1>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {t("errors.500.title")}
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {t("errors.500.description")}
          </p>
        </div>

        {/* کارت اطلاعات */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            {t("errors.500.whatHappenedTitle")}
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>{t("errors.500.reason1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>{t("errors.500.reason2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>{t("errors.500.reason3")}</span>
            </li>
          </ul>
        </div>

        {/* پیشنهادات */}
        <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <RiCustomerService2Line className="h-5 w-5 text-primary" />
            {t("errors.500.whatCanYouDoTitle")}
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>{t("errors.500.action1")}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>{t("errors.500.action2")}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>{t("errors.500.action3")}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>{t("errors.500.action4")}</span>
            </li>
          </ul>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={reset}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <RiRefreshLine className="h-5 w-5" />
            <span>{t("errors.500.tryAgain")}</span>
          </button>

          <button
            onClick={handleGoHome}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent"
          >
            <RiHomeLine className="h-5 w-5" />
            <span>{t("errors.500.goHome")}</span>
          </button>
        </div>

        {/* اطلاعات تماس */}
        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <p className="text-center text-sm text-muted-foreground">
            {t("errors.500.contactSupport")}
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t("errors.500.errorCode")} {error.digest || "UNKNOWN"} |{" "}
            {t("errors.500.timestamp")} {new Date().toLocaleString("fa-IR")}
          </p>
        </div>
      </div>
    </div>
  );
}
