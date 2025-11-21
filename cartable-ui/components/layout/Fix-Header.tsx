"use client";

import { ArrowLeft, ArrowRight, Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { toAbsoluteUrl } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import Link from "next/link";
import { Url } from "next/dist/shared/lib/router/router";
import { useLanguage } from "@/providers/i18n-provider";

interface HeaderProps {
  returnUrl?: Url;
  children?: React.ReactNode;
}

export function FixHeader({ returnUrl, children }: HeaderProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isRTL = language.direction === "rtl";
  return (
    <header className="z-40 w-full fixed border-b bg-card shrink-0">
      <div className="flex h-16 items-center px-4 gap-4">
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => router.push("/")}
        >
          <Image
            src={toAbsoluteUrl("/media/logo.png")}
            alt="App Logo"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        <div className="flex-1 min-w-0 flex items-center gap-2">
          {children}
        </div>
        <Button variant="outline" onClick={() => router.push(`${returnUrl}`)}>
          {isRTL ? <ArrowRight /> : <ArrowLeft />}
          {t("common.back")}
        </Button>
      </div>
    </header>
  );
}
