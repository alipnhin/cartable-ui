/**
 * 500 Internal Server Error Page
 * صفحه خطای سرور (500)
 *
 * این صفحه زمانی نمایش داده می‌شود که:
 * - خطای داخلی سرور رخ دهد
 * - مشکلی در پردازش درخواست وجود داشته باشد
 *
 * @module app/500
 */

"use client";

import { useRouter } from "next/navigation";
import {
  RiAlertLine,
  RiHomeLine,
  RiRefreshLine,
  RiCustomerService2Line,
} from "@remixicon/react";

export default function ServerErrorPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-destructive/5 to-background p-4">
      <div className="w-full max-w-2xl">
        {/* Icon و عنوان */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 animate-pulse">
            <RiAlertLine className="h-12 w-12 text-destructive" />
          </div>

          <h1 className="mb-2 text-6xl font-black text-foreground">500</h1>
          <h2 className="mb-4 text-2xl font-bold text-foreground">خطای سرور</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            متأسفانه مشکلی در سرور رخ داده است. لطفاً چند لحظه دیگر دوباره تلاش
            کنید
          </p>
        </div>

        {/* کارت اطلاعات */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            چه اتفاقی افتاده؟
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>یک خطای غیرمنتظره در سمت سرور رخ داده است</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>تیم فنی ما به صورت خودکار از این خطا مطلع شده‌اند</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>
                معمولاً این مشکلات موقتی هستند و به زودی برطرف می‌شوند
              </span>
            </li>
          </ul>
        </div>

        {/* پیشنهادات */}
        <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-card-foreground">
            <RiCustomerService2Line className="h-5 w-5 text-primary" />
            چه کاری می‌توانید انجام دهید؟
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>چند دقیقه صبر کنید و دوباره امتحان کنید</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>صفحه را رفرش کنید</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>از منوی اصلی به صفحه دیگری بروید</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-primary">→</span>
              <span>اگر مشکل ادامه داشت، با پشتیبانی تماس بگیرید</span>
            </li>
          </ul>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleRefresh}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <RiRefreshLine className="h-5 w-5" />
            <span>تلاش مجدد</span>
          </button>

          <button
            onClick={handleGoHome}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent"
          >
            <RiHomeLine className="h-5 w-5" />
            <span>بازگشت به داشبورد</span>
          </button>
        </div>

        {/* اطلاعات تماس */}
        <div className="mt-8 rounded-lg border border-border bg-card p-4">
          <p className="text-center text-sm text-muted-foreground">
            اگر مشکل همچنان ادامه دارد، لطفاً با{" "}
            <a
              href="mailto:support@etadbir.com"
              className="font-medium text-primary hover:underline"
            >
              پشتیبانی فنی
            </a>{" "}
            تماس بگیرید
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            کد خطا: SERVER_ERROR_500 | زمان:{" "}
            {new Date().toLocaleString("fa-IR")}
          </p>
        </div>
      </div>
    </div>
  );
}
