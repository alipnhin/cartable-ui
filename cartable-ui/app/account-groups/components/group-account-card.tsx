/**
 * Group Account Card Component
 * کامپوننت کارت حساب داخل گروه
 * Path: app/account-groups/components/group-account-card.tsx
 */

"use client";

import { useRouter } from "next/navigation";
import { Eye, Trash2, Hash, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BankLogo } from "@/components/common/bank-logo";
import type { AccountGroupItem } from "@/types/account-group-types";

interface GroupAccountCardProps {
  account: AccountGroupItem;
  bankCode?: string;
  bankName?: string;
  onRemove: (account: AccountGroupItem) => void;
}

export function GroupAccountCard({
  account,
  bankCode,
  bankName,
  onRemove,
}: GroupAccountCardProps) {
  const router = useRouter();

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  return (
    <div
      className="rounded-xl border-2 bg-card p-4 transition-all duration-200 hover:shadow-lg hover:border-primary/20 cursor-pointer"
      onClick={() => router.push(`/accounts/${account.bankGatewayId}`)}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        {bankCode && (
          <div className="flex-shrink-0">
            <BankLogo bankCode={bankCode} size="sm" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm mb-1 truncate">
            {account.accountTitle}
          </h3>
          {bankName && (
            <p className="text-xs text-muted-foreground truncate">{bankName}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2">
        {/* شماره حساب */}
        <div className="flex items-center justify-between py-1.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Hash className="h-3 w-3" />
            شماره حساب
          </span>
          <span className="text-xs font-mono">{account.accountNumber}</span>
        </div>

        <svg className="h-1 w-full">
          <line
            x1="1.2"
            y1="1.2"
            x2="100%"
            y2="1.2"
            stroke="#eee"
            strokeWidth="2.4"
            strokeDasharray="0,6"
            strokeLinecap="round"
          />
        </svg>

        {/* شبا */}
        <div className="flex items-center justify-between py-1.5">
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CreditCard className="h-3 w-3" />
            شماره شبا
          </span>
          <span className="text-[10px] font-mono text-end max-w-[140px] truncate">
            {formatIBAN(account.shebaNumber)}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
        <Button
          size="sm"
          variant="outline"
          className="flex-1 h-8 text-xs"
          onClick={() => router.push(`/accounts/${account.bankGatewayId}`)}
        >
          <Eye className="me-1 h-3 w-3" />
          مشاهده
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-8 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(account);
          }}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
