"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transaction";
import { BankLogo } from "@/components/common/bank-logo";
import { PaymentTypeIcon } from "@/components/common/payment-type-icon";
import { getBankCodeFromIban } from "@/lib/bank-logos";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";

interface TransactionDetailDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailDialogProps) {
  if (!transaction) return null;
  const { t, locale } = useTranslation();
  const bankCode = getBankCodeFromIban(transaction.destinationIban);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader>
          <DialogTitle>جزئیات تراکنش</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <TransactionStatusBadge status={transaction.status} size="sm" />
          </div>

          {/* Amount */}
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="text-sm text-muted-foreground mb-1">
              مبلغ تراکنش
            </div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(transaction.amount, locale)}
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
                  {t("transactions.ownerName")}
                </div>
                <div className="font-medium">{transaction.ownerName}</div>
              </div>

              {transaction.nationalCode && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {t("transactions.nationalCode")}
                  </div>
                  <div className="font-medium font-mono">
                    {transaction.nationalCode}
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <div className="text-sm text-muted-foreground mb-1">
                  {t("transactions.iban")}
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
                  {t("transactions.orderId")}
                </div>
                <div className="font-medium font-mono text-sm break-all">
                  {transaction.id}
                </div>
              </div>

              {transaction.trackingId && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {t("transactions.trackingId")}
                  </div>
                  <div className="font-medium font-mono text-sm">
                    {transaction.trackingId}
                  </div>
                </div>
              )}

              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  {t("transactions.createdDateTime")}
                </div>
                <div className="font-medium">
                  {formatDate(transaction.createdDateTime)}
                </div>
              </div>

              {transaction.description && (
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground mb-1">
                    {t("transactions.description")}
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
