"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { PageTitle } from "@/components/common/page-title";
import Image from "next/image";
import { toAbsoluteUrl } from "@/lib/helpers";

export default function Home() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("identity-server", { callbackUrl: "/dashboard" });
    } catch (error) {
      setIsLoading(false);
    }
  };
  return (
    <>
      <PageTitle title="" />
      <main
        className="relative flex min-h-screen w-full flex-col bg-center bg-no-repeat bg-contain lg:bg-size-[55%]"
        style={{
          backgroundImage: "var(--home-bg-image)",
          backgroundColor: "var(--home-bg-color)",
        }}
      >
        <div className="mx-auto flex flex-1 max-w-7xl flex-col items-center justify-between px-4 sm:px-6 lg:px-8 py-16 sm:pt-10 sm:pb-12">
          {/* Title & Description */}
          <div className="text-center pt-8 sm:pt-6">
            <Image
              src={toAbsoluteUrl("/media/logo.png")}
              alt="App Logo"
              width={60}
              height={60}
              className="mx-auto object-contain"
            />
            <h1 className="text-4xl font-bold tracking-tight dark:text-white sm:text-5xl md:text-6xl ">
              {t("app.title")}
            </h1>
            <p className="mt-6 font-bold dark:text-emerald-300 text-emerald-500 text-2xl">
              {t("app.description")}
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* CTA */}
          <div className="w-full max-w-xs">
            <Button
              size="lg"
              className="text-lg w-full shadow-[0_0_30px_rgba(16,185,129,0.6),0_0_60px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.8),0_0_80px_rgba(16,185,129,0.4)] transition-shadoww-full transition-shadow"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="me-2 h-5 w-5 animate-spin" />
                  در حال انتقال...
                </>
              ) : (
                <span className="py-4">{t("app.login")}</span>
              )}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
