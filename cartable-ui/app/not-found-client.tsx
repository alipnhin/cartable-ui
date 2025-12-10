/**
 * 404 Not Found Client Component
 * کامپوننت کلاینت صفحه یافت نشد
 *
 * @module app/not-found-client
 */

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  RiSearchLine,
  RiHomeLine,
  RiArrowLeftLine,
  RiCompass3Line,
  RiAdminLine,
} from "@remixicon/react";
import useTranslation from "@/hooks/useTranslation";

interface NotFoundClientProps {
  isApprover: boolean;
}

export default function NotFoundClient({ isApprover }: NotFoundClientProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const handleGoBack = () => {
    router.back();
  };

  // لینک‌های پیشنهادی بر اساس نقش کاربر
  const suggestedLinks = [
    {
      title: t("navigation.dashboard"),
      href: "/dashboard",
      icon: RiHomeLine,
    },
    // اگر امضادار است، کارتابل من، در غیر اینصورت کارتابل مدیر
    isApprover
      ? {
          title: t("navigation.myCartable"),
          href: "/my-cartable",
          icon: RiCompass3Line,
        }
      : {
          title: t("navigation.managerCartable"),
          href: "/manager-cartable",
          icon: RiAdminLine,
        },
    {
      title: t("navigation.paymentOrders"),
      href: "/payment-orders",
      icon: RiSearchLine,
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-background via-primary/5 to-background p-4">
      <div className="w-full max-w-2xl">
        {/* Animation و آیکون */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 animate-pulse">
            <RiSearchLine className="h-12 w-12 text-primary" />
          </div>

          <h1 className="mb-2 text-7xl font-black text-foreground">
            {t("errors.404.subtitle")}
          </h1>
          <h2 className="mb-4 text-2xl font-bold text-foreground">
            {t("errors.404.title")}
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            {t("errors.404.description")}
          </p>
        </div>

        {/* کارت راهنما */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-card-foreground">
            {t("errors.404.tipsTitle")}
          </h3>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>{t("errors.404.tip1")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>{t("errors.404.tip2")}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-primary">•</span>
              <span>{t("errors.404.tip3")}</span>
            </li>
          </ul>
        </div>

        {/* لینک‌های پیشنهادی */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-card-foreground">
            {t("errors.404.suggestedPages")}
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
            <span>{t("errors.404.goHome")}</span>
          </Link>

          <button
            onClick={handleGoBack}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:bg-accent"
          >
            <RiArrowLeftLine className="h-5 w-5" />
            <span>{t("errors.404.goBack")}</span>
          </button>
        </div>

        {/* پاورقی */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            {t("errors.404.reportError")}{" "}
            <a
              href="mailto:support@etadbir.com"
              className="font-medium text-primary hover:underline"
            >
              support@etadbir.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
