"use client";
import { UserDropdownMenu } from "@/components/layout/user-dropdown-menu";
import { toAbsoluteUrl } from "@/lib/helpers";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black">
      {/* Container برای وسط‌چین کردن محتوا */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header با آواتار */}
        <div className="flex justify-end py-6">
          <UserDropdownMenu
            trigger={
              <img
                className="size-9 rounded-full border-2 border-green-500 shrink-0 cursor-pointer"
                src={toAbsoluteUrl("/media/avatars/blank.png")}
                alt="User Avatar"
              />
            }
          />
        </div>

        {/* محتوای اصلی */}
        <div className="flex min-h-[calc(100vh-120px)] items-center justify-center">
          <div className="w-full max-w-3xl space-y-8 text-center px-4">
            <div className="flex justify-center px-4 mb-30">
              <Image
                src="/media/payments.svg"
                alt="payment"
                width={500}
                height={500}
                className="w-full max-w-sm h-auto"
              />
            </div>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-black dark:text-zinc-50 sm:text-5xl md:text-6xl">
              {t("app.title")}
            </h1>

            <p className="mx-auto max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400 sm:text-xl">
              {t("app.description")}
            </p>

            <div className="flex justify-center pt-4">
              <Button
                className="w-full sm:w-auto min-w-[300px] text-lg "
                size="lg"
                asChild
              >
                <Link className="py-4" href="/dashboard">
                  {t("app.login")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
