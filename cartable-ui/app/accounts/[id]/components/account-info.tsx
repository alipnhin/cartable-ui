/**
 * Account Info Component
 * کامپوننت نمایش اطلاعات حساب - طراحی مینیمال
 */

"use client";

import { AccountDetailResponse } from "@/services/accountService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BankLogo } from "@/components/common/bank-logo";
import { Copy, CheckCircle2, XCircle } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";
import { formatDate } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AccountInfoProps {
  account: AccountDetailResponse;
}

export function AccountInfo({ account }: AccountInfoProps) {
  const { t, locale } = useTranslation();

  const formatIBAN = (iban: string) => {
    return iban.replace(/(.{4})/g, "$1 ").trim();
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} کپی شد`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* هدر با لوگو بانک */}
        <div className="flex items-start gap-4 mb-6 pb-6 border-b">
          <BankLogo bankCode={account.bankCode} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold truncate">{account.title}</h3>
              <Badge
                variant={account.isEnable ? "success" : "secondary"}
                appearance="light"
                className="shrink-0"
              >
                {account.isEnable ? "فعال" : "غیرفعال"}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">{account.bankName}</p>
          </div>
        </div>

        {/* اطلاعات اصلی */}
        <div className="space-y-4">
          {/* شماره شبا */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">شماره شبا</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm" dir="ltr">
                {formatIBAN(account.shebaNumber)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => copyToClipboard(account.shebaNumber, "شماره شبا")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* شماره حساب */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">شماره حساب</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm" dir="ltr">
                {account.accountNumber}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => copyToClipboard(account.accountNumber, "شماره حساب")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* کد بانک */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">کد بانک</span>
            <span className="text-sm font-medium">{account.bankCode}</span>
          </div>

          {/* کارتابل */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">کارتابل</span>
            <div className="flex items-center gap-1.5">
              {account.hasCartable ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    فعال
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-muted-foreground">
                    غیرفعال
                  </span>
                </>
              )}
            </div>
          </div>

          {/* تاریخ ایجاد */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">تاریخ ایجاد</span>
            <span className="text-sm font-medium">
              {formatDate(account.createdDateTime, locale)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
