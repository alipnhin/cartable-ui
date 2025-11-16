"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserDropdownMenu } from "@/components/layout/user-dropdown-menu";
import { AccountGroupSwitcher } from "@/components/common/account-group-selector";
import { toAbsoluteUrl } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
  showAccountGroupSwitcher?: boolean;
  selectedAccountGroup?: string;
  onAccountGroupChange?: (groupId: string) => void;
}

export function Header({
  onMenuToggle,
  showMenuButton = true,
  showAccountGroupSwitcher = true,
  selectedAccountGroup,
  onAccountGroupChange,
}: HeaderProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <header className="z-40 w-full border-b bg-card shrink-0">
      <div className="flex h-16 items-center px-4 gap-4">
        {showMenuButton && !isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "text-foreground hover:bg-primary/10 hover:text-primary shrink-0",
              "transition-all duration-200 active:scale-95"
            )}
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        )}

        {/* Logo & Title */}
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

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
              {t("app.title")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t("app.description")}
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-w-0" />

        {/* Account Group Switcher - فقط موبایل */}
        {showAccountGroupSwitcher && isMobile && (
          <div className="shrink-0">
            <AccountGroupSwitcher
              value={selectedAccountGroup}
              onChange={onAccountGroupChange}
              compact
            />
          </div>
        )}

        {/* User Menu */}
        <div className="shrink-0">
          <UserDropdownMenu
            trigger={
              <div className="relative group cursor-pointer">
                <img
                  className={cn(
                    "size-10 rounded-full border-2 border-primary shrink-0",
                    "transition-all duration-200",
                    "group-hover:border-primary/80 group-hover:scale-105",
                    "shadow-sm group-hover:shadow-md"
                  )}
                  src={toAbsoluteUrl("/media/avatars/blank.png")}
                  alt="User Avatar"
                />

                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
              </div>
            }
          />
        </div>
      </div>
    </header>
  );
}
