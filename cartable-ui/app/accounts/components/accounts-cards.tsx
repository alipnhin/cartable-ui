/**
 * Accounts Cards Component
 * کامپوننت کارت‌های حساب‌های بانکی
 */

"use client";

import { useRouter } from "next/navigation";
import { Eye, Hash, CreditCard, CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BankLogo } from "@/components/common/bank-logo";
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
          className="rounded-xl border-2 bg-card p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/20 cursor-pointer"
          onClick={() => router.push(`/accounts/${account.id}`)}
        >
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="shrink-0">
              <BankLogo bankCode={account.bankCode} size="md" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base mb-1 truncate max-w-50 sm:max-w-75 md:max-w-none">
                {account.title}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {account.bankName}
              </p>
            </div>
            <Badge
              variant={account.isEnable ? "success" : "secondary"}
              appearance="light"
              className="shrink-0"
            >
              {account.isEnable ? t("common.active") : t("common.inactive")}
            </Badge>
          </div>

          {/* Body */}
          <div className="space-y-2.5">
            {/* شماره حساب */}
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <Hash className="h-3.5 w-3.5" />
                {t("accounts.accountNumber")}
              </span>
              <span className="text-sm font-mono">{account.accountNumber}</span>
            </div>

            {/* شبا */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-3.5 w-3.5" />
                {t("accounts.iban")}
              </span>
              <span className="text-xs font-mono text-end truncate">
                {formatIBAN(account.shebaNumber)}
              </span>
            </div>
            {/* کارتابل */}
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {t("accounts.hasCartable")}
              </span>
              <Badge
                variant={account.hasCartable ? "success" : "secondary"}
                appearance="light"
              >
                {account.hasCartable ? t("common.yes") : t("common.no")}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm text-muted-foreground flex items-center gap-2">
                <UserCheck className="h-3.5 w-3.5" />
                {t("accounts.hasCartableManager")}
              </span>
              <Badge
                variant={account.hasCartableManager ? "success" : "secondary"}
                appearance="light"
              >
                {account.hasCartableManager ? t("common.yes") : t("common.no")}
              </Badge>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <Button
              size="md"
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/accounts/${account.id}`)}
            >
              <Eye className="me-2 h-4 w-4" />
              {t("common.buttons.view")}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
