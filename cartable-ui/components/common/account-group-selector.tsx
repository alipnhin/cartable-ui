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
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import { AccountGroup } from "@/types/account-group-types";
import { getAccountGroups } from "@/services/accountGroupService";
import logger from "@/lib/logger";
import {
  useAccountGroupStore,
  useAccountGroupStoreHydration,
} from "@/store/account-group-store";

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
  const { t } = useTranslation();
  const { data: session } = useSession();

  // Store state
  const selectedGroup = useAccountGroupStore((s) => s.selectedGroup);
  const setSelectedGroup = useAccountGroupStore((s) => s.setSelectedGroup);
  const accountGroups = useAccountGroupStore((s) => s.accountGroups);
  const setAccountGroups = useAccountGroupStore((s) => s.setAccountGroups);
  const setUserId = useAccountGroupStore((s) => s.setUserId);
  const refreshKey = useAccountGroupStore((s) => s.refreshKey);
  const isHydrated = useAccountGroupStoreHydration();

  // Local state
  const [isFetching, setIsFetching] = useState(false);

  // Set userId when session changes
  useEffect(() => {
    const userId = session?.user?.id || session?.user?.email || null;
    if (userId) {
      setUserId(userId);
    }
  }, [session, setUserId]);

  // Fetch account groups - فقط اگر لیست خالی باشه یا refreshKey تغییر کنه
  useEffect(() => {
    if (!session?.accessToken || !isHydrated || isFetching) {
      return;
    }

    // فقط اگر لیست گروه‌ها خالی باشه یا refresh شده باشه، fetch کن
    const shouldFetch = accountGroups.length === 0 || refreshKey > 0;

    if (!shouldFetch) {
      return;
    }

    const fetchAccountGroups = async () => {
      try {
        setIsFetching(true);
        const groups = await getAccountGroups();
        setAccountGroups(groups);

        // فقط اگر selectedGroup نداریم، گروه پیش‌فرض رو انتخاب کن
        if (!selectedGroup) {
          let groupToSelect: AccountGroup | undefined;

          if (value) {
            groupToSelect = groups.find((g) => g.id === value);
          }

          if (!groupToSelect) {
            groupToSelect = groups.find((g) => g.id === "all") || groups[0];
          }

          if (groupToSelect) {
            setSelectedGroup(groupToSelect);
            onChange?.(groupToSelect.id);
          }
        }
      } catch (error) {
        logger.error(
          "Error fetching account groups:",
          error instanceof Error ? error : undefined
        );
      } finally {
        setIsFetching(false);
      }
    };

    fetchAccountGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    session?.accessToken,
    refreshKey,
    isHydrated,
  ]);

  const handleChange = (group: AccountGroup) => {
    setSelectedGroup(group);
    onChange?.(group.id);
    // router.refresh() حذف شد - نیازی به refresh کردن صفحه نیست
    // چون store به‌روزرسانی میشه و کامپوننت‌های وابسته خودشون re-render میشن
  };

  if (!isHydrated || !selectedGroup) {
    return (
      <Button
        variant="outline"
        disabled
        className={cn(compact ? "h-9 px-3 gap-2 max-w-50" : "w-62.5", className)}
      >
        <Building2 className="h-4 w-4 shrink-0 animate-pulse" />
        <span className={cn(compact ? "text-xs" : "text-xs")}>
          {t("common.loading")}
        </span>
      </Button>
    );
  }

  const GroupIcon = selectedGroup.icon
    ? ICON_MAP[selectedGroup.icon] || Building2
    : Building2;

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 px-3 gap-2 max-w-62.5">
            <GroupIcon className="h-4 w-4 shrink-0" />
            <span className="text-xs font-medium truncate">
              {selectedGroup.title}
            </span>
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-62.5" align="end">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {t("accountGroup.selectGroup")}
          </DropdownMenuLabel>
          {isFetching && accountGroups.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
              {t("common.loading")}
            </div>
          ) : (
            accountGroups.map((group) => {
              const Icon = group.icon
                ? ICON_MAP[group.icon] || Building2
                : Building2;
              return (
                <DropdownMenuItem
                  key={group.id}
                  onClick={() => handleChange(group)}
                  className={cn(
                    "gap-2 p-2",
                    selectedGroup.id === group.id && "bg-accent"
                  )}
                >
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded-md border bg-background"
                    style={
                      group.color ? { borderColor: group.color } : undefined
                    }
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      style={group.color ? { color: group.color } : undefined}
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm">{group.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {group.accountCount} {t("common.account")}
                    </span>
                  </div>
                </DropdownMenuItem>
              );
            })
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

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
                selectedGroup.color
                  ? { borderColor: selectedGroup.color }
                  : undefined
              }
            >
              <GroupIcon
                className="h-4.5 w-4.5"
                style={
                  selectedGroup.color ? { color: selectedGroup.color } : undefined
                }
              />
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-xs text-start font-medium truncate w-full">
                {selectedGroup.title}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedGroup.accountCount} {t("common.account")}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t("accountGroup.selectGroup")}
        </DropdownMenuLabel>

        {isFetching && accountGroups.length === 0 ? (
          <div className="flex items-center justify-center py-4 text-xs text-muted-foreground">
            {t("common.loading")}
          </div>
        ) : (
          accountGroups.map((group) => {
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
                    {group.accountCount} {t("common.account")}
                  </span>
                </div>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
