/**
 * 404 Not Found Page
 * صفحه یافت نشد (404)
 *
 * این صفحه زمانی نمایش داده می‌شود که:
 * - مسیر درخواستی وجود ندارد
 * - صفحه مورد نظر پیدا نشد
 *
 * @module app/404
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  RiSearchLine,
  RiHomeLine,
  RiArrowLeftLine,
  RiCompass3Line,
} from "@remixicon/react";

export default function NotFoundPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  // لینک‌های پیشنهادی
  const suggestedLinks = [
    { title: "داشبورد", href: "/dashboard", icon: RiHomeLine },
    { title: "کارتابل من", href: "/my-cartable", icon: RiCompass3Line },
    { title: "دستورهای پرداخت", href: "/payment-orders", icon: RiSearchLine },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background p-4">
      <div className="w-full max-w-2xl">
        {/* Animation و آیکون */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 animate-pulse">
            <RiSearchLine className="h-12 w-12 text-primary" />
          </div>

          <h1 className="mb-2 text-7xl font-black text-foreground">404</h1>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            صفحه یافت نشد
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            صفحه‌ای که به دنبال آن هستید وجود ندارد یا منتقل شده است
          </p>
        </div>

        {/* کارت راهنما */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            چند راهنمایی:
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>آدرس را بررسی کنید و مطمئن شوید که درست تایپ شده است</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>ممکن است این صفحه حذف یا منتقل شده باشد</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>از منوی اصلی یا لینک‌های زیر استفاده کنید</span>
            </li>
          </ul>
        </div>

        {/* لینک‌های پیشنهادی */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">
            صفحات پیشنهادی:
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {suggestedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg border border-border bg-background p-3 text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-accent"
              >
                <link.icon className="h-4 w-4 text-primary" />
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <RiHomeLine className="h-5 w-5" />
            <span>بازگشت به داشبورد</span>
          </Link>

          <button
            onClick={handleGoBack}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent"
          >
            <RiArrowLeftLine className="h-5 w-5" />
            <span>بازگشت به صفحه قبل</span>
          </button>
        </div>

        {/* پاورقی */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            اگر فکر می‌کنید این یک خطاست،{" "}
            <a
              href="mailto:support@example.com"
              className="font-medium text-primary hover:underline"
            >
              به ما اطلاع دهید
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
