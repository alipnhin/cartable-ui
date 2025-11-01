/**
 * Account Info Component
 * کامپوننت نمایش اطلاعات حساب
 */

"use client";

import { Account } from "@/types";
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
import { formatCurrency, formatDate } from "@/lib/helpers";

interface AccountInfoProps {
  account: Account;
}

export function AccountInfo({ account }: AccountInfoProps) {
  const { t, locale } = useTranslation();

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  const infoItems = [
    {
      label: t("accounts.accountTitle"),
      value: account.accountTitle,
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
      label: "نام شعبه",
      value: account.branchName,
      icon: Building2,
    },
    {
      label: "کد شعبه",
      value: account.branchCode,
      icon: Hash,
    },
    {
      label: t("accounts.accountNumber"),
      value: account.accountNumber,
      icon: Hash,
    },
    {
      label: t("accounts.iban"),
      value: formatIBAN(account.sheba),
      icon: CreditCard,
      mono: true,
    },
    {
      label: "نوع حساب",
      value: account.accountType,
      icon: Wallet,
    },
    {
      label: "ارز",
      value: account.currency,
      icon: Wallet,
    },
    {
      label: t("accounts.balance"),
      value: formatCurrency(account.balance ?? 0, locale),
      icon: Wallet,
      highlight: true,
    },
    {
      label: t("accounts.minSignatures"),
      value: account.minimumSignatureCount.toString(),
      icon: CheckCircle2,
    },
    {
      label: "تعداد امضاداران",
      value: account.signerIds.length.toString(),
      icon: CheckCircle2,
    },
    {
      label: "تاریخ ایجاد",
      value: formatDate(account.createdAt, locale),
      icon: Calendar,
    },
    {
      label: "آخرین به‌روزرسانی",
      value: formatDate(account.updatedAt ?? "", locale),
      icon: Calendar,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* اطلاعات اصلی */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            اطلاعات حساب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {infoItems.slice(0, 7).map((item, index) => (
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
                  item.mono ? "font-mono" : ""
                } ${item.highlight ? "text-primary" : ""}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* اطلاعات مالی و تنظیمات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            اطلاعات مالی و تنظیمات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {infoItems.slice(7).map((item, index) => (
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
                  item.mono ? "font-mono" : ""
                } ${item.highlight ? "text-primary font-bold" : ""}`}
              >
                {item.value}
              </span>
            </div>
          ))}

          {/* وضعیت */}
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground flex items-center gap-2">
              {account.isActive ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              وضعیت
            </span>
            <Badge variant={account.isActive ? "success" : "secondary"}>
              {account.isActive ? "فعال" : "غیرفعال"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
