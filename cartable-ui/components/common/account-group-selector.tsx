/**
 * Account Group Switcher Component
 * کامپوننت انتخاب‌گر گروه حساب
 *
 * این کامپوننت به کاربر امکان می‌دهد بین گروه‌های مختلف حساب جابجا شود.
 * داده‌ها از API واکشی می‌شوند (فعلاً از داده‌های موک استفاده می‌شود).
 *
 * @module components/common/account-group-selector
 */

"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Folder,
  Folders,
  Tags,
  Gem,
  Layers,
  Briefcase,
  Wallet,
  Handshake,
  Coins,
  Bookmark,
  Banknote,
  Award,
  Star,
  Bolt,
  Archive,
  Inbox,
  Landmark,
  Album,
  File,
  LucideIcon,
  Building2,
  ChevronsUpDown,
  Icon,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { AccountGroup } from "@/types/account-group-types";
import { getAccountGroups } from "@/services/accountGroupService";
import logger from "@/lib/logger";
import { useAccountGroupStore } from "@/store/account-group-store";
// نقشه آیکون‌ها - برای تبدیل نام آیکون به کامپوننت
const ICON_MAP: Record<string, LucideIcon> = {
  Crown,
  Folder,
  Folders,
  Tags,
  Gem,
  Layers,
  Briefcase,
  Wallet,
  Handshake,
  Coins,
  Bookmark,
  Banknote,
  Award,
  Star,
  Bolt,
  Archive,
  Inbox,
  Landmark,
  Album,
  File,
  Building2,
};

interface AccountGroupSwitcherProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  compact?: boolean;
}

/**
 * کامپوننت انتخاب‌گر گروه حساب
 *
 * @param value - شناسه گروه انتخاب شده
 * @param onChange - تابعی که هنگام تغییر گروه فراخوانی می‌شود
 * @param className - کلاس‌های CSS اضافی
 * @param compact - حالت فشرده برای موبایل
 */
export function AccountGroupSwitcher({
  value,
  onChange,
  className,
  compact = false,
}: AccountGroupSwitcherProps) {
  const { t, locale } = useTranslation();
  const { data: session } = useSession();
  const [accountGroups, setAccountGroups] = useState<AccountGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<AccountGroup | null>(null);
  const router = useRouter();

  const setGroupId = useAccountGroupStore((s) => s.setGroupId);
  const refreshKey = useAccountGroupStore((s) => s.refreshKey);
  // خواندن گروه ذخیره شده از localStorage
  useEffect(() => {
    const savedGroupId = localStorage.getItem("selected-account-group");
    if (savedGroupId && !value) {
      // اگر گروه ذخیره شده وجود دارد و value مشخص نشده، از آن استفاده کن
      return;
    }
  }, []);

  // واکشی گروه‌های حساب از API
  useEffect(() => {
    const fetchAccountGroups = async () => {
      if (!session?.accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const groups = await getAccountGroups(session.accessToken);
        setAccountGroups(groups);

        // اولویت 1: value که از props آمده
        // اولویت 2: گروه ذخیره شده در localStorage
        // اولویت 3: گروه "all"
        // اولویت 4: اولین گروه موجود
        const savedGroupId = localStorage.getItem("selected-account-group");
        let selectedGroup: AccountGroup | undefined;

        if (value) {
          selectedGroup = groups.find((g) => g.id === value);
        } else if (savedGroupId) {
          selectedGroup = groups.find((g) => g.id === savedGroupId);
        }

        if (!selectedGroup) {
          selectedGroup = groups.find((g) => g.id === "all") || groups[0];
        }

        if (selectedGroup) {
          setActiveGroup(selectedGroup);
          setGroupId(selectedGroup.id);
          // ذخیره در localStorage
          localStorage.setItem("selected-account-group", selectedGroup.id);
          // اطلاع‌رسانی به والد اگر onChange وجود دارد
          if (onChange && !value) {
            onChange(selectedGroup.id);
          }
        }
      } catch (error) {
        logger.error(
          "Error fetching account groups:",
          error instanceof Error ? error : undefined
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAccountGroups();
  }, [session, value, refreshKey]);

  const handleChange = (group: AccountGroup) => {
    setActiveGroup(group);
    // ذخیره در localStorage
    localStorage.setItem("selected-account-group", group.id);
    setGroupId(group.id);
    onChange?.(group.id);
    router.refresh();
  };

  // اگر در حال بارگذاری است یا هیچ گروهی وجود ندارد
  if (loading || !activeGroup) {
    return (
      <Button
        variant="outline"
        disabled
        className={cn(
          compact ? "h-9 px-3 gap-2 max-w-[200px]" : "w-[250px]",
          className
        )}
      >
        <Building2 className="h-4 w-4 shrink-0 animate-pulse" />
        <span className={cn(compact ? "text-xs" : "text-xs")}>
          {t("common.loading") || "در حال بارگذاری..."}
        </span>
      </Button>
    );
  }

  // دریافت آیکون گروه
  const GroupIcon = activeGroup.icon
    ? ICON_MAP[activeGroup.icon] || Building2
    : Building2;

  if (compact) {
    // نمایش فشرده برای موبایل
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 px-3 gap-2 max-w-[250px]">
            <GroupIcon className="h-4 w-4 shrink-0" />
            <span className="text-xs font-medium truncate">
              {activeGroup.title}
            </span>
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]" align="end">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {t("accountGroup.selectGroup") || "انتخاب گروه حساب"}
          </DropdownMenuLabel>
          {accountGroups.map((group) => {
            const Icon = group.icon
              ? ICON_MAP[group.icon] || Building2
              : Building2;
            return (
              <DropdownMenuItem
                key={group.id}
                onClick={() => handleChange(group)}
                className={cn(
                  "gap-2 p-2",
                  activeGroup.id === group.id && "bg-accent"
                )}
              >
                <div
                  className="flex h-6 w-6 items-center justify-center rounded-md border bg-background"
                  style={group.color ? { borderColor: group.color } : undefined}
                >
                  <Icon
                    className="h-3.5 w-3.5"
                    style={group.color ? { color: group.color } : undefined}
                  />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm">{group.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {group.accountCount} {t("common.account") || "حساب"}
                  </span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // نمایش کامل برای دسکتاپ
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          size="lg"
          className={cn(
            "justify-between",
            "data-[state=open]:bg-accent",
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-md border bg-background shrink-0"
              style={
                activeGroup.color
                  ? { borderColor: activeGroup.color }
                  : undefined
              }
            >
              <GroupIcon
                className="h-4.5 w-4.5"
                style={
                  activeGroup.color ? { color: activeGroup.color } : undefined
                }
              />
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-xs text-start font-medium truncate w-full">
                {activeGroup.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {activeGroup.accountCount} {t("common.account") || "حساب"}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t("accountGroup.selectGroup") || "انتخاب گروه حساب"}
        </DropdownMenuLabel>

        {accountGroups.map((group) => {
          const Icon = group.icon
            ? ICON_MAP[group.icon] || Building2
            : Building2;
          return (
            <DropdownMenuItem
              key={group.id}
              onClick={() => handleChange(group)}
              className="gap-2 p-2"
            >
              <div
                className="flex h-6 w-6 items-center justify-center rounded-md border bg-background"
                style={group.color ? { borderColor: group.color } : undefined}
              >
                <Icon
                  className="h-3.5 w-3.5"
                  style={group.color ? { color: group.color } : undefined}
                />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm">{group.title}</span>
                <span className="text-xs text-muted-foreground">
                  {group.accountCount} {t("common.account") || "حساب"}
                </span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
