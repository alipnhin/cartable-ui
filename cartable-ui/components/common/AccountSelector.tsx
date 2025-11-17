"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAccountsSelectData } from "@/services/accountService";
import type { AccountSelectData } from "@/services/accountService";
import { Loader2 } from "lucide-react";

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

  useEffect(() => {
    const fetchAccounts = async () => {
      if (!session?.accessToken) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getAccountsSelectData(
          { pageSize: 50, pageNum: 1 },
          session.accessToken
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
  }, [session]);

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

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAllOption && <SelectItem value="all">همه حساب‌ها</SelectItem>}
        {accounts.map((account) => (
          <SelectItem key={account.id} value={account.id}>
            {account.text}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
