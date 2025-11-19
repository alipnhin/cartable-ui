/**
 * Accounts Cards Component
 * کامپوننت کارت‌های حساب‌های بانکی برای موبایل
 */

"use client";

import { useRouter } from "next/navigation";
import { Eye, Edit, Users, Building2, Hash, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AccountListItem } from "@/services/accountService";
import useTranslation from "@/hooks/useTranslation";

interface AccountsCardsProps {
  accounts: AccountListItem[];
}

export function AccountsCards({ accounts }: AccountsCardsProps) {
  const router = useRouter();
  const { t } = useTranslation();

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  if (accounts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t("accounts.noAccountsFound")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          className="rounded-xl border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
          }}
          onClick={() => router.push(`/accounts/${account.id}`)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1">
                {account.title}
              </h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5" />
                {account.bankName}
              </p>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <Switch
                checked={account.isEnable}
                onCheckedChange={() => {
                  console.log("Toggle account status:", account.id);
                }}
              />
            </div>
          </div>

          {/* Body */}
          <div className="space-y-3">
            {/* شماره حساب */}
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" />
                {t("accounts.accountNumber")}
              </span>
              <span className="text-sm font-mono">{account.accountNumber}</span>
            </div>

            {/* شبا */}
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" />
                {t("accounts.iban")}
              </span>
              <span className="text-xs font-mono text-end">
                {formatIBAN(account.shebaNumber)}
              </span>
            </div>

            {/* کارتابل */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">
                {t("accounts.hasCartable")}
              </span>
              <Badge variant={account.hasCartable ? "success" : "secondary"}>
                {account.hasCartable ? t("common.yes") : t("common.no")}
              </Badge>
            </div>
          </div>

          {/* Footer Actions */}
          <div
            className="flex gap-2 mt-4 pt-4 border-t"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => router.push(`/accounts/${account.id}`)}
            >
              <Eye className="me-2 h-4 w-4" />
              {t("common.buttons.view")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => router.push(`/accounts/${account.id}`)}
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
