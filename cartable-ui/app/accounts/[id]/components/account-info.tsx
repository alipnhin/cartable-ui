/**
 * Account Info Component
 * کامپوننت نمایش اطلاعات حساب
 */

"use client";

import { AccountDetailResponse } from "@/services/accountService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Hash,
  CreditCard,
  Wallet,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatDate } from "@/lib/helpers";

interface AccountInfoProps {
  account: AccountDetailResponse;
}

export function AccountInfo({ account }: AccountInfoProps) {
  const { t, locale } = useTranslation();

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  const infoItems = [
    {
      label: t("accounts.accountTitle"),
      value: account.title,
      icon: Building2,
    },
    {
      label: t("accounts.bankName"),
      value: account.bankName,
      icon: Building2,
    },
    {
      label: "کد بانک",
      value: account.bankCode,
      icon: Hash,
    },
    {
      label: t("accounts.accountNumber"),
      value: account.accountNumber,
      icon: Hash,
    },
    {
      label: t("accounts.iban"),
      value: formatIBAN(account.shebaNumber),
      icon: CreditCard,
      mono: true,
    },
    {
      label: t("accounts.minSignatures"),
      value: account.minimumSignature.toString(),
      icon: CheckCircle2,
    },
    {
      label: "تعداد امضاداران",
      value: (account.users?.length ?? 0).toString(),
      icon: CheckCircle2,
    },
    {
      label: "تاریخ ایجاد",
      value: formatDate(account.createdDateTime, locale),
      icon: Calendar,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          اطلاعات حساب
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        {infoItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-2 border-b last:border-0"
          >
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
            </span>
            <span
              className={`text-sm font-medium ${
                item.mono ? "font-mono text-xs" : ""
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}

        {/* وضعیت */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            {account.isEnable ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <XCircle className="h-4 w-4" />
            )}
            وضعیت
          </span>
          <Badge variant={account.isEnable ? "success" : "secondary"}>
            {account.isEnable ? "فعال" : "غیرفعال"}
          </Badge>
        </div>

        {/* کارتابل */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            دارای کارتابل
          </span>
          <Badge variant={account.hasCartable ? "success" : "secondary"}>
            {account.hasCartable ? "بله" : "خیر"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
