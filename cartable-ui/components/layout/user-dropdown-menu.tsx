"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { I18N_LANGUAGES, Language } from "@/i18n/config";
import {
  BetweenHorizontalStart,
  Coffee,
  CreditCard,
  FileText,
  Globe,
  Moon,
  Settings,
  Shield,
  User,
  UserCircle,
  Users,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/providers/i18n-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleLanguage = (lang: Language) => {
    changeLanguage(lang.code);
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <DropdownMenu dir={language.direction}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <img
              className="w-9 h-9 rounded-full border border-border"
              src={"/media/avatars/blank.png"}
              alt="User avatar"
            />
            <div className="flex flex-col">
              <Link
                href="/account/home/get-started"
                className="text-sm text-mono hover:text-primary font-semibold"
              >
                A.Panahian
              </Link>
              <Link
                href="ali.pnhin@gmail.com"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                ali.pnhin@gmail.com
              </Link>
            </div>
          </div>
          <Badge variant="primary" appearance="light" size="sm">
            Pro
          </Badge>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <User />
            {t("userMenu.myProfile")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="#" className="flex items-center gap-2">
            <FileText />
            {t("userMenu.myAccount")}
          </Link>
        </DropdownMenuItem>

        {/* Language Submenu with Radio Group */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2 **:data-[slot=dropdown-menu-sub-trigger-indicator]:hidden hover:**:data-[slot=badge]:border-input data-[state=open]:**:data-[slot=badge]:border-input">
            <Globe />
            <span className="flex items-center justify-between gap-2 grow relative">
              {t("userMenu.changeLanguage")}
              <Badge
                variant="outline"
                className="absolute end-0 top-1/2 -translate-y-1/2"
              >
                {language.name}
                <img
                  src={language.flag}
                  className="w-3.5 h-3.5 rounded-full"
                  alt={language.name}
                />
              </Badge>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuRadioGroup
              value={language.code}
              onValueChange={(value) => {
                const selectedLang = I18N_LANGUAGES.find(
                  (lang) => lang.code === value
                );
                if (selectedLang) handleLanguage(selectedLang);
              }}
            >
              {I18N_LANGUAGES.map((item) => (
                <DropdownMenuRadioItem
                  key={item.code}
                  value={item.code}
                  className="flex items-center gap-2"
                >
                  <img
                    src={item.flag}
                    className="w-4 h-4 rounded-full"
                    alt={item.name}
                  />
                  <span>{item.name}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Footer */}
        <DropdownMenuItem
          className="flex items-center gap-2"
          onSelect={(event) => event.preventDefault()}
        >
          <Moon />
          <div className="flex items-center gap-2 justify-between grow">
            {t("userMenu.darkMode")}
            <Switch
              size="sm"
              checked={theme === "dark"}
              onCheckedChange={handleThemeToggle}
            />
          </div>
        </DropdownMenuItem>
        <div className="p-2 mt-1">
          <Button size="sm" className="w-full">
            {t("userMenu.logout")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
