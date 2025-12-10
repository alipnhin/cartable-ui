/**
 * Global Error Boundary Component
 * کامپوننت مرز خطای سراسری
 *
 * این کامپوننت زمانی نمایش داده می‌شود که:
 * - خطای critical در root layout رخ دهد
 * - خطایی که توسط error.tsx گرفته نشده باشد
 *
 * @module app/global-error
 */

"use client";

import { useEffect } from "react";
import {
  RiAlertLine,
  RiRefreshLine,
  RiCustomerService2Line,
} from "@remixicon/react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log خطا برای debugging
    console.error("Global error caught:", error);
  }, [error]);

  const handleRefresh = () => {
    window.location.href = "/";
  };

  return (
    <html lang="fa" dir="rtl">
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-red-50 to-gray-50 p-4">
          <div className="w-full max-w-2xl">
            {/* Icon و عنوان */}
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 animate-pulse">
                <RiAlertLine className="h-12 w-12 text-red-600" />
              </div>

              <h1 className="mb-2 text-6xl font-black text-gray-900">500</h1>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                خطای حیاتی سرور
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                متأسفانه یک خطای حیاتی در برنامه رخ داده است. لطفاً صفحه را
                بارگذاری مجدد کنید
              </p>
            </div>

            {/* کارت اطلاعات */}
            <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                چه اتفاقی افتاده؟
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-600">•</span>
                  <span>یک خطای غیرمنتظره و حیاتی در برنامه رخ داده است</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-600">•</span>
                  <span>تیم فنی ما به صورت خودکار از این خطا مطلع شده‌اند</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-red-600">•</span>
                  <span>این خطا در لایه اصلی برنامه اتفاق افتاده است</span>
                </li>
              </ul>
            </div>

            {/* پیشنهادات */}
            <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6 shadow-sm">
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <RiCustomerService2Line className="h-5 w-5 text-blue-600" />
                چه کاری می‌توانید انجام دهید؟
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">→</span>
                  <span>صفحه را رفرش کنید</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">→</span>
                  <span>cache مرورگر را پاک کنید</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">→</span>
                  <span>چند دقیقه صبر کنید و دوباره امتحان کنید</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">→</span>
                  <span>با پشتیبانی فنی تماس بگیرید</span>
                </li>
              </ul>
            </div>

            {/* دکمه‌های عملیاتی */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={reset}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md"
              >
                <RiRefreshLine className="h-5 w-5" />
                <span>تلاش مجدد</span>
              </button>

              <button
                onClick={handleRefresh}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
              >
                <RiRefreshLine className="h-5 w-5" />
                <span>بارگذاری مجدد صفحه</span>
              </button>
            </div>

            {/* اطلاعات تماس */}
            <div className="mt-8 rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-center text-sm text-gray-600">
                اگر مشکل همچنان ادامه دارد، لطفاً با{" "}
                <a
                  href="mailto:support@etadbir.com"
                  className="font-medium text-blue-600 hover:underline"
                >
                  پشتیبانی فنی
                </a>{" "}
                تماس بگیرید
              </p>
              <p className="mt-2 text-center text-xs text-gray-500">
                کد خطا: {error.digest || "CRITICAL_ERROR"} | زمان:{" "}
                {new Date().toLocaleString("fa-IR")}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
