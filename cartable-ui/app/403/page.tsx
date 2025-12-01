/**
 * 403 Forbidden Page
 * صفحه عدم دسترسی (403)
 *
 * این صفحه زمانی نمایش داده می‌شود که:
 * - کاربر احراز هویت شده ولی نقش مجاز برای دسترسی به صفحه را ندارد
 * - کاربر نقش‌های cartable-approver یا cartable-manager را ندارد
 *
 * @module app/403
 */

"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  RiShieldKeyholeLine,
  RiHomeLine,
  RiArrowLeftLine,
  RiLogoutBoxLine,
} from "@remixicon/react";

export default function ForbiddenPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGoHome = () => {
    router.push("/dashboard");
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleLogout = () => {
    router.push("/api/auth/signout");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-accent/5 to-background p-4">
      <div className="w-full max-w-2xl">
        {/* Icon و عنوان */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
            <RiShieldKeyholeLine className="h-12 w-12 text-destructive" />
          </div>

          <h1 className="mb-2 text-6xl font-black text-foreground">403</h1>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            دسترسی غیرمجاز
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            متأسفانه شما دسترسی لازم برای مشاهده این صفحه را ندارید
          </p>
        </div>

        {/* کارت اطلاعات */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            چرا این صفحه را می‌بینید؟
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>
                برای دسترسی به این صفحه، باید یکی از نقش‌های{" "}
                <strong className="text-foreground">امضادار</strong> یا{" "}
                <strong className="text-foreground">مدیر کارتابل</strong> را
                داشته باشید
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>
                احتمالاً با حساب کاربری دیگری وارد شده‌اید که دسترسی لازم را
                ندارد
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-destructive">•</span>
              <span>
                اگر فکر می‌کنید این یک اشتباه است، با مدیر سیستم تماس بگیرید
              </span>
            </li>
          </ul>

          {/* اطلاعات کاربر (اگر وارد شده باشد) */}
          {session?.user && (
            <div className="mt-6 rounded-lg border border-border bg-accent/30 p-4">
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                کاربر فعلی:
              </p>
              <p className="text-sm font-semibold text-foreground">
                {session.user.name || session.user.email}
              </p>
            </div>
          )}
        </div>

        {/* دکمه‌های عملیاتی */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleGoHome}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
          >
            <RiHomeLine className="h-5 w-5" />
            <span>بازگشت به داشبورد</span>
          </button>

          <button
            onClick={handleGoBack}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent"
          >
            <RiArrowLeftLine className="h-5 w-5" />
            <span>بازگشت به صفحه قبل</span>
          </button>

          {session && (
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-6 py-3 text-sm font-medium text-destructive shadow-sm transition-all hover:bg-destructive/20"
            >
              <RiLogoutBoxLine className="h-5 w-5" />
              <span>خروج</span>
            </button>
          )}
        </div>

        {/* راهنمای تماس */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            در صورت نیاز به کمک، با{" "}
            <a
              href="mailto:support@etadbir.com"
              className="font-medium text-primary hover:underline"
            >
              پشتیبانی
            </a>{" "}
            تماس بگیرید
          </p>
        </div>
      </div>
    </div>
  );
}
