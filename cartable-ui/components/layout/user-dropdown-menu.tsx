"use client";
import { ReactNode, useState } from "react";
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { t } = useTranslation();
  const { changeLanguage, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleLanguage = (lang: Language) => {
    changeLanguage(lang.code);
    if (isMobile) setOpen(false);
  };

  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  // Mobile Drawer Version
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <div className="p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <img
                className="w-14 h-14 rounded-full border-2 border-border"
                src={"/media/avatars/blank.png"}
                alt="User avatar"
              />
              <div className="flex flex-col flex-1">
                <div className="text-base font-semibold">A.Panahian</div>
                <div className="text-sm text-muted-foreground">
                  ali.pnhin@gmail.com
                </div>
              </div>
              <Badge variant="primary" appearance="light">
                Pro
              </Badge>
            </div>

            {/* Menu Items */}
            <div className="space-y-1 mb-4">
              <Link
                href="#"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="h-5 w-5" />
                <span className="text-base">{t("userMenu.myProfile")}</span>
              </Link>

              <Link
                href="#"
                className="flex items-center gap-3 p-4 rounded-lg hover:bg-muted active:bg-muted/80 transition-colors"
                onClick={() => setOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span className="text-base">{t("userMenu.myAccount")}</span>
              </Link>
            </div>

            {/* Language Selection */}
            <div className="mb-4">
              <div className="text-sm font-medium text-muted-foreground mb-2 px-4">
                {t("userMenu.changeLanguage")}
              </div>
              <div className="space-y-1">
                {I18N_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLanguage(item)}
                    className={`w-full flex items-center gap-3 p-4 rounded-lg transition-colors ${
                      language.code === item.code
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted active:bg-muted/80"
                    }`}
                  >
                    <img
                      src={item.flag}
                      className="w-6 h-6 rounded-full"
                      alt={item.name}
                    />
                    <span className="text-base flex-1 text-start">
                      {item.name}
                    </span>
                    {language.code === item.code && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 mb-4">
              <div className="flex items-center gap-3">
                <Moon className="h-5 w-5" />
                <span className="text-base">{t("userMenu.darkMode")}</span>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={handleThemeToggle}
              />
            </div>

            {/* Logout Button */}
            <Button size="lg" className="w-full" onClick={() => setOpen(false)}>
              {t("userMenu.logout")}
            </Button>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop Dropdown Version
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
