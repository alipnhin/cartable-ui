"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function Home() {
  const { t } = useTranslation();

  const handleSignIn = () => {
    signIn("identity-server", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen w-full bg-white dark:bg-black">
      {/* Container برای وسط‌چین کردن محتوا */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* محتوای اصلی */}
        <div className="flex min-h-screen items-center justify-center">
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
                className="w-full sm:w-auto min-w-[300px] text-lg"
                size="lg"
                onClick={handleSignIn}
              >
                <span className="py-4">{t("app.login")}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
