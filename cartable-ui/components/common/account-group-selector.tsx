"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Building2, ChevronsUpDown } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

interface AccountGroup {
  id: string;
  name_fa: string;
  name_en: string;
  accountsCount: number;
}

const mockAccountGroups: AccountGroup[] = [
  {
    id: "all",
    name_fa: "همه حساب‌ها",
    name_en: "All Accounts",
    accountsCount: 5,
  },
  {
    id: "group_1",
    name_fa: "حساب‌های اصلی",
    name_en: "Main Accounts",
    accountsCount: 2,
  },
  {
    id: "group_2",
    name_fa: "حساب‌های فرعی",
    name_en: "Sub Accounts",
    accountsCount: 3,
  },
];

interface AccountGroupSwitcherProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  compact?: boolean;
}

export function AccountGroupSwitcher({
  value,
  onChange,
  className,
  compact = false,
}: AccountGroupSwitcherProps) {
  const { t, locale } = useTranslation();
  const [activeGroup, setActiveGroup] = useState<AccountGroup>(
    mockAccountGroups.find((g) => g.id === value) || mockAccountGroups[0]
  );

  const handleChange = (group: AccountGroup) => {
    setActiveGroup(group);
    onChange?.(group.id);
  };

  if (compact) {
    // نمایش فشرده برای موبایل - نام گروه انتخاب شده هم نمایش داده شود
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-9 px-3 gap-2 max-w-[160px]"
          >
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="text-xs font-medium truncate">
              {locale === "fa" ? activeGroup.name_fa : activeGroup.name_en}
            </span>
            <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" align="end">
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            {t("accountGroup.selectGroup")}
          </DropdownMenuLabel>
          {mockAccountGroups.map((group) => (
            <DropdownMenuItem
              key={group.id}
              onClick={() => handleChange(group)}
              className={cn(
                "gap-2 p-2",
                activeGroup.id === group.id && "bg-accent"
              )}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-background">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-sm">
                  {locale === "fa" ? group.name_fa : group.name_en}
                </span>
                <span className="text-xs text-muted-foreground">
                  {group.accountsCount} {t("common.account")}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
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
          className={cn(
            "w-[200px] justify-between",
            "data-[state=open]:bg-accent",
            className
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0 ">
            <div className="flex h-7 w-7 items-center justify-center rounded-md border bg-background shrink-0">
              <Building2 className="h-4.5 w-4.5" />
            </div>
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-xs text-start font-medium truncate w-full">
                {locale === "fa" ? activeGroup.name_fa : activeGroup.name_en}
              </span>
              <span className="text-xs text-muted-foreground">
                {activeGroup.accountsCount} {t("common.account")}
              </span>
            </div>
          </div>
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]" align="start">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          {t("accountGroup.selectGroup")}
        </DropdownMenuLabel>
        {mockAccountGroups.map((group) => (
          <DropdownMenuItem
            key={group.id}
            onClick={() => handleChange(group)}
            className="gap-2 p-2"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md border bg-background">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-sm">
                {locale === "fa" ? group.name_fa : group.name_en}
              </span>
              <span className="text-xs text-muted-foreground">
                {group.accountsCount} {t("common.account")}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
