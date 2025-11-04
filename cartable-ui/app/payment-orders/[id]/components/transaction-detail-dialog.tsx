"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BankLogo } from "@/components/common/bank-logo";
import { PaymentTypeIcon } from "@/components/common/payment-type-icon";
import { getBankCodeFromIban } from "@/lib/bank-logos";

interface TransactionDetailDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusConfig = {
  BankSucceeded: {
    label: "تراکنش انجام شده",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  BankRejected: {
    label: "رد شده توسط بانک",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  Failed: {
    label: "ناموفق",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  Canceled: {
    label: "لغو شده",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  Expired: {
    label: "منقضی شده",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  WaitForExecution: {
    label: "در انتظار اجرا",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  WaitForBank: {
    label: "در صف پردازش بانک",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  Registered: {
    label: "ثبت شده",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  },
  TransactionRollback: {
    label: "برگشت مبلغ",
    color:
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
};

export function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailDialogProps) {
  if (!transaction) return null;

  const status = statusConfig[transaction.status] || statusConfig.Registered;
  const bankCode = getBankCodeFromIban(transaction.beneficiaryIban);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>جزئیات تراکنش</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Badge className={status.color}>{status.label}</Badge>
            <PaymentTypeIcon type={transaction.paymentType} showLabel />
          </div>

          {/* Amount */}
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">
              مبلغ تراکنش
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(transaction.amount)} ریال
            </div>
          </div>

          {/* Beneficiary Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              اطلاعات ذینفع
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  نام و نام خانوادگی
                </div>
                <div className="font-medium">{transaction.ownerName}</div>
              </div>

              {transaction.nationalCode && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    کد ملی
                  </div>
                  <div className="font-medium font-mono">
                    {transaction.nationalCode}
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground mb-1">
                  شماره شبا
                </div>
                <div className="font-medium font-mono text-sm break-all">
                  {transaction.destinationIban}
                </div>
              </div>

              {bankCode && (
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">بانک</div>
                  <BankLogo bankCode={bankCode} showName size="md" />
                </div>
              )}
            </div>
          </div>

          {/* Transaction Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">
              اطلاعات تراکنش
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  شماره تراکنش
                </div>
                <div className="font-medium font-mono text-sm break-all">
                  {transaction.id}
                </div>
              </div>

              {transaction.trackingId && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    کد رهگیری بانک
                  </div>
                  <div className="font-medium font-mono text-sm">
                    {transaction.trackingId}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  تاریخ ثبت
                </div>
                <div className="font-medium">
                  {formatDate(transaction.createdDateTime)}
                </div>
              </div>

              {transaction.description && (
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">
                    توضیحات
                  </div>
                  <div className="font-medium">{transaction.description}</div>
                </div>
              )}

              {transaction.providerMessage && (
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">
                    علت رد
                  </div>
                  <div className="font-medium text-red-600 dark:text-red-400">
                    {transaction.providerMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
