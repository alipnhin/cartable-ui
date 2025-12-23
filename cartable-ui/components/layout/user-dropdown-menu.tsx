"use client";
import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { I18N_LANGUAGES, Language } from "@/i18n/config";
import {
  FileText,
  Globe,
  LogOut,
  Moon,
  Sun,
  Palette,
  User,
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
import { useTranslation } from "react-i18next";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSession } from "next-auth/react";
import { useColorTheme } from "@/providers/color-theme-provider";

export function UserDropdownMenu({ trigger }: { trigger: ReactNode }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { changeLanguage, language } = useLanguage();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const { colorTheme, colorThemeId, setColorTheme, availableThemes } =
    useColorTheme();
  const [userInfo, setUserInfo] = useState<{
    fullName: string;
    email: string;
    image: string;
  } | null>(null);

  // دریافت اطلاعات کامل کاربر
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!session?.accessToken) return;

      try {
        const response = await fetch("/api/user/profile", {
          method: "GET",
          cache: "no-store",
        });

        if (response.ok) {
          const data = await response.json();
          setUserInfo({
            fullName:
              data.given_name && data.family_name
                ? `${data.given_name} ${data.family_name}`
                : data.name || session?.user?.name || "کاربر",
            email: data.email || session?.user?.email || "",
            image:
              data.picture ||
              session?.user?.image ||
              "/media/avatars/blank.png",
          });
        } else {
          // Fallback به session
          setUserInfo({
            fullName: session?.user?.name || "کاربر",
            email: session?.user?.email || "",
            image: session?.user?.image || "/media/avatars/blank.png",
          });
        }
      } catch (error) {
        // Fallback به session
        setUserInfo({
          fullName: session?.user?.name || "کاربر",
          email: session?.user?.email || "",
          image: session?.user?.image || "/media/avatars/blank.png",
        });
      }
    };

    if (session) {
      fetchUserInfo();
    }
  }, [session]);

  const handleLanguage = (lang: Language) => {
    changeLanguage(lang.code);
    if (isMobile) setOpen(false);
  };

  const handleLogout = () => {
    router.push("/auth/logout");
  };

  const userName = userInfo?.fullName || session?.user?.name || "کاربر";
  const userEmail = userInfo?.email || session?.user?.email || "";
  const userImage =
    userInfo?.image || session?.user?.image || "/media/avatars/blank.png";

  // Mobile Drawer Version
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="max-h-[90vh]">
          <div className="p-4 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3 p-2.5 rounded-xl bg-linear-to-br from-primary/10 to-primary/5">
              <img
                className="w-12 h-12 rounded-full border-2 border-primary/20 shadow-md"
                src={userImage}
                alt="User avatar"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="text-base font-bold truncate">{userName}</div>
                {userEmail && (
                  <div className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </div>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-1.5 mb-6">
              <Link
                href="/profile"
                className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-muted/80 active:bg-muted transition-all"
                onClick={() => setOpen(false)}
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <span className="text-sm font-medium">
                  {t("userMenu.myProfile")}
                </span>
              </Link>
            </div>

            {/* Language Selection */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-foreground mb-2 px-1">
                {t("userMenu.changeLanguage")}
              </div>
              <div className="space-y-1.5">
                {I18N_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleLanguage(item)}
                    className={`w-full flex items-center gap-2 p-3 rounded-lg transition-all ${
                      language.code === item.code
                        ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                        : "hover:bg-muted/80 active:bg-muted"
                    }`}
                  >
                    <img
                      src={item.flag}
                      className="w-5 h-5 rounded-full shadow-sm"
                      alt={item.name}
                    />
                    <span className="text-xs flex-1 text-start font-medium">
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-foreground mb-2 px-1">
                {t("userMenu.changeTheme")}
              </div>
              <div className="grid grid-cols-1 gap-2">
                {availableThemes.map((themeItem) => (
                  <button
                    key={themeItem.id}
                    onClick={() => setColorTheme(themeItem.id)}
                    className={`flex items-center gap-2 p-3 rounded-lg transition-all ${
                      colorThemeId === themeItem.id
                        ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                        : "hover:bg-muted/80 active:bg-muted"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-border shadow-sm shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${
                          themeItem.previewColor
                        } 50%, ${
                          themeItem.previewColorSecondary ||
                          themeItem.previewColor
                        } 50%)`,
                      }}
                    />
                    <span className="text-xs font-medium truncate">
                      {t(themeItem.nameKey)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dark/Light Mode Toggle */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-foreground mb-2 px-1">
                {t("userMenu.appearance")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme("light")}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all ${
                    theme === "light"
                      ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <Sun className="h-5 w-5" />
                  <span className="text-xs font-medium">
                    {t("userMenu.lightMode")}
                  </span>
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg transition-all ${
                    theme === "dark"
                      ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/20"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <Moon className="h-5 w-5" />
                  <span className="text-xs font-medium">
                    {t("userMenu.darkMode")}
                  </span>
                </button>
              </div>
            </div>

            {/* Logout Button */}
            <Button
              size="lg"
              variant="primary"
              className="w-full gap-2 rounded-lg  font-medium mb-6"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
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
      <DropdownMenuContent className="w-72" side="bottom" align="end">
        {/* Header */}
        <div className="flex items-center gap-3 p-4 bg-linear-to-br from-primary/10 to-primary/5 rounded-t-lg">
          <img
            className="w-12 h-12 rounded-full border-2 border-primary/20 shadow-md"
            src={userImage}
            alt="User avatar"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <div className="text-sm font-bold truncate">{userName}</div>
            {userEmail && (
              <div className="text-xs text-muted-foreground truncate">
                {userEmail}
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {t("userMenu.myProfile")}
          </Link>
        </DropdownMenuItem>

        {/* Language Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span className="flex items-center justify-between gap-2 grow">
              {t("userMenu.changeLanguage")}
              <Badge variant="outline" className="gap-1">
                <img
                  src={language.flag}
                  className="w-3.5 h-3.5 rounded-full"
                  alt={language.name}
                />
                {language.name}
              </Badge>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <DropdownMenuRadioGroup
              value={language.code}
              onValueChange={(value: string) => {
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

        {/* Theme Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            <span className="flex items-center justify-between gap-2 grow">
              {t("userMenu.changeTheme")}
              <Badge variant="outline">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorTheme.previewColor }}
                />
              </Badge>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-52">
            <DropdownMenuRadioGroup
              value={colorThemeId}
              onValueChange={(value: string) => setColorTheme(value)}
            >
              {availableThemes.map((themeItem) => (
                <DropdownMenuRadioItem
                  key={themeItem.id}
                  value={themeItem.id}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-border"
                    style={{
                      background: `linear-gradient(135deg, ${
                        themeItem.previewColor
                      } 50%, ${
                        themeItem.previewColorSecondary ||
                        themeItem.previewColor
                      } 50%)`,
                    }}
                  />
                  <span>{t(themeItem.nameKey)}</span>
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Dark/Light Mode Submenu */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            {theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span>{t("userMenu.appearance")}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-40">
            <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
              <DropdownMenuRadioItem
                value="light"
                className="flex items-center gap-2"
              >
                <Sun className="w-4 h-4" />
                {t("userMenu.lightMode")}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="dark"
                className="flex items-center gap-2"
              >
                <Moon className="w-4 h-4" />
                {t("userMenu.darkMode")}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Logout Button */}
        <div className="p-2">
          <Button
            size="sm"
            variant="primary"
            className="w-full gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {t("userMenu.logout")}
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
