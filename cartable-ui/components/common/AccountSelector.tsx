"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getAccountsSelectData } from "@/services/accountService";
import type { AccountSelectData } from "@/services/accountService";
import { Loader2, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  showAllOption?: boolean;
  className?: string;
  disabled?: boolean;
}

/**
 * Reusable account selector component that fetches accounts from API
 * Can be used in filters, forms, or anywhere an account selection is needed
 */
export default function AccountSelector({
  value,
  onValueChange,
  placeholder = "انتخاب حساب",
  showAllOption = true,
  className,
  disabled = false,
}: AccountSelectorProps) {
  const { data: session } = useSession();
  const [accounts, setAccounts] = useState<AccountSelectData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!session?.accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getAccountsSelectData(
          { pageSize: 50, pageNum: 1 }
        );
        setAccounts(response.results);
      } catch (err) {
        console.error("Error fetching accounts:", err);
        setError("خطا در دریافت لیست حساب‌ها");
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [session?.accessToken]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-10 border rounded-md bg-background">
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-10 border rounded-md bg-destructive/10 text-destructive text-sm">
        {error}
      </div>
    );
  }

  const selectedAccount = accounts.find((acc) => acc.id === value);
  const displayValue =
    value === "all" || !value
      ? showAllOption
        ? "همه حساب‌ها"
        : placeholder
      : selectedAccount?.text || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="جستجوی حساب..." />
          <CommandList>
            <CommandEmpty>حسابی یافت نشد</CommandEmpty>
            <CommandGroup>
              {showAllOption && (
                <CommandItem
                  value="all"
                  onSelect={() => {
                    onValueChange?.("all");
                    setOpen(false);
                  }}
                >
                  <span className="truncate"> همه حساب‌ها</span>
                  {value === "all" && <CommandCheck />}
                </CommandItem>
              )}
              {accounts.map((account) => (
                <CommandItem
                  key={account.id}
                  value={account.text}
                  onSelect={() => {
                    onValueChange?.(account.id);
                    setOpen(false);
                  }}
                >
                  <span className="truncate">{account.text}</span>
                  {value === account.id && <CommandCheck />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
