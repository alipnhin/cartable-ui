"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Transaction, TransactionStatus } from "@/types/transaction";
import { BankLogo } from "@/components/common/bank-logo";

import {
  Calendar,
  Clock,
  Hash,
  Building2,
  CreditCard,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";

interface TransactionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

const getStatusBadge = (status: TransactionStatus) => {
  switch (status) {
    case TransactionStatus.BankSucceeded:
      return (
        <Badge className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950/20">
          تراکنش انجام شده
        </Badge>
      );
    case TransactionStatus.BankRejected:
      return (
        <Badge className="bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-950/20">
          رد شده توسط بانک
        </Badge>
      );
    case TransactionStatus.WaitForBank:
      return (
        <Badge className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-950/20">
          در صف پردازش بانک
        </Badge>
      );
    case TransactionStatus.WaitForExecution:
      return (
        <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/20">
          درانتظار تائید بانک
        </Badge>
      );
    default:
      return <Badge variant="secondary">نامشخص</Badge>;
  }
};

export function TransactionDetailDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionDetailDialogProps) {
  if (!transaction) return null;
  const { t, locale } = useTranslation();
  const DetailRow = ({
    icon: Icon,
    label,
    value,
    className,
  }: {
    icon: any;
    label: string;
    value: string | number;
    className?: string;
  }) => (
    <div className="flex items-start justify-between py-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm">{label}</span>
      </div>
      <div className={cn("text-sm font-medium text-right", className)}>
        {value}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BankLogo bankCode={transaction.bankCode} size="md" />
              <span>جزئیات تراکنش</span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* وضعیت و نوع */}
          <div className="flex items-center gap-2 flex-wrap">
            {getStatusBadge(transaction.status)}
            <Badge
              variant="outline"
              className={cn(
                "gap-1"
                // getTransactionTypeColor(transaction.paymentType)
              )}
            >
              {/* {getTransactionTypeIcon(transaction.paymentType)}
              {getTransactionTypeName(transaction.paymentType)} */}
            </Badge>
          </div>

          <Separator />

          {/* مبلغ تراکنش */}
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">
              مبلغ تراکنش
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(transaction.amount, locale)}
              <span className="text-base">ریال</span>
            </div>
          </div>

          <Separator />

          {/* اطلاعات ذینفع */}
          <div>
            <h4 className="font-semibold mb-3">اطلاعات ذینفع</h4>
            <div className="space-y-1 bg-muted/30 rounded-lg p-4">
              <DetailRow
                icon={User}
                label="نام و نام خانوادگی"
                value={transaction.ownerName}
              />
              <DetailRow
                icon={Hash}
                label="کد ملی / شناسه ملی"
                value={transaction.nationalCode}
              />
              <DetailRow
                icon={CreditCard}
                label="شماره شبا"
                value={transaction.destinationIban}
              />
              <DetailRow
                icon={Building2}
                label="شماره حساب"
                value={transaction.destinationIban}
              />
            </div>
          </div>

          <Separator />

          {/* اطلاعات تراکنش */}
          <div>
            <h4 className="font-semibold mb-3">اطلاعات تراکنش</h4>
            <div className="space-y-1">
              <DetailRow
                icon={Hash}
                label="کد رهگیری بانک"
                value={transaction.trackingId || "-"}
                className="font-mono"
              />
              <DetailRow
                icon={Calendar}
                label="تاریخ ثبت"
                value={transaction.createdDateTime}
              />
              <DetailRow
                icon={Clock}
                label="زمان ثبت"
                value={new Date(transaction.createdDateTime).toLocaleTimeString(
                  "fa-IR"
                )}
              />
            </div>
          </div>

          {/* توضیحات */}
          {transaction.description && (
            <>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">توضیحات</h4>
                <p className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                  {transaction.description}
                </p>
              </div>
            </>
          )}

          {/* پیام خطا (در صورت وجود) */}
          {transaction.status === TransactionStatus.BankRejected &&
            transaction.providerMessage && (
              <>
                <Separator />
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg p-4">
                  <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">
                    علت رد تراکنش
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {transaction.providerMessage}
                  </p>
                </div>
              </>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
