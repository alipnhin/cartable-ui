"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { UserDropdownMenu } from "@/components/layout/user-dropdown-menu";
import { toAbsoluteUrl } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface HeaderProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function Header({ onMenuToggle, showMenuButton = true }: HeaderProps) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/95 backdrop-blur-md supports-backdrop-filter:bg-card/80">
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
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div
            className={cn(
              "h-10 w-10 rounded-xl bg-linear-to-br from-primary to-primary/80 shrink-0",
              "flex items-center justify-center",
              "transition-all duration-200 hover:scale-105"
            )}
            style={{
              boxShadow:
                "0 2px 8px rgba(39,174,96,0.25), 0 1px 4px rgba(39,174,96,0.15)",
            }}
          >
            <span className="text-primary-foreground font-bold text-xl">ک</span>
          </div>

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
