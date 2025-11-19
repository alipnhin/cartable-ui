/**
 * Account Info Component
 * کامپوننت نمایش اطلاعات حساب - طراحی مدرن
 */

"use client";

import { AccountDetailResponse } from "@/services/accountService";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BankLogo } from "@/components/common/bank-logo";
import {
  Hash,
  CreditCard,
  Wallet,
  Calendar,
  CheckCircle2,
  XCircle,
  Copy,
  Users,
  FileSignature,
} from "lucide-react";
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
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* هدر با لوگو بانک */}
        <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6 border-b">
          <div className="flex items-start gap-4">
            {/* لوگو بانک */}
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border">
              <BankLogo bankCode={account.bankCode} size="xl" />
            </div>

            {/* اطلاعات اصلی */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold truncate">{account.title}</h3>
                <Badge variant={account.isEnable ? "success" : "secondary"} className="shrink-0">
                  {account.isEnable ? "فعال" : "غیرفعال"}
                </Badge>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                {account.bankName}
              </p>

              {/* شماره شبا */}
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">شماره شبا (IBAN)</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => copyToClipboard(account.shebaNumber, "شماره شبا")}
                  >
                    <Copy className="h-3 w-3 me-1" />
                    کپی
                  </Button>
                </div>
                <p className="font-mono text-sm tracking-wider" dir="ltr">
                  {formatIBAN(account.shebaNumber)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* اطلاعات تکمیلی */}
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* شماره حساب */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="p-2 rounded-lg bg-primary/10">
                <Hash className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">شماره حساب</p>
                <p className="font-medium truncate" dir="ltr">
                  {account.accountNumber}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={() => copyToClipboard(account.accountNumber, "شماره حساب")}
              >
                <Copy className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* کد بانک */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <CreditCard className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">کد بانک</p>
                <p className="font-medium">{account.bankCode}</p>
              </div>
            </div>

            {/* حداقل امضا */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <FileSignature className="h-4 w-4 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">حداقل امضا</p>
                <p className="font-medium">{account.minimumSignature} نفر</p>
              </div>
            </div>

            {/* تعداد امضاداران */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Users className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">تعداد امضاداران</p>
                <p className="font-medium">{account.users?.length ?? 0} نفر</p>
              </div>
            </div>

            {/* دارای کارتابل */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className={`p-2 rounded-lg ${account.hasCartable ? "bg-green-500/10" : "bg-gray-500/10"}`}>
                <Wallet className={`h-4 w-4 ${account.hasCartable ? "text-green-500" : "text-gray-500"}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">کارتابل</p>
                <div className="flex items-center gap-1">
                  {account.hasCartable ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span className="font-medium text-green-600 dark:text-green-400">فعال</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-gray-400" />
                      <span className="font-medium text-gray-500">غیرفعال</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* تاریخ ایجاد */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Calendar className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">تاریخ ایجاد</p>
                <p className="font-medium">{formatDate(account.createdDateTime, locale)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
