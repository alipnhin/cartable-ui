"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WithdrawalTransaction } from "@/types/api";
import { BankLogo } from "@/components/common/bank-logo";
import { getBankCodeFromIban, getBankName } from "@/lib/bank-logos";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import { Copy, Check, Clock } from "lucide-react";
import { useState } from "react";

interface TransactionDetailDialogProps {
  transaction: WithdrawalTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to format date with time
const formatDateTime = (dateString: string, locale: string): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return dateFormatter.format(date);
};

// Copy to clipboard component
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:bg-muted rounded transition-colors"
      title="کپی"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-success" />
      ) : (
        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
      )}
    </button>
  );
}

// Info row component - minimal design
function InfoRow({
  label,
  value,
  mono = false,
  copyable = false,
}: {
  label: string;
  value: string | React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
}) {
  return (
    <div className="flex justify-between items-start py-2.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`text-sm font-medium text-foreground text-left ${mono ? "font-mono" : ""}`}>
          {value}
        </span>
        {copyable && typeof value === "string" && <CopyButton text={value} />}
      </div>
    </div>
  );
}

export function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailDialogProps) {
  if (!transaction) return null;
  const { t, locale } = useTranslation();
  const bankCode = getBankCodeFromIban(transaction.destinationIban);
  const bankName = bankCode ? getBankName(bankCode) : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-full">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between gap-4 pe-8">
            <DialogTitle className="text-lg font-semibold">جزئیات تراکنش</DialogTitle>
            <TransactionStatusBadge status={transaction.status as any} size="sm" />
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="py-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="details">جزئیات</TabsTrigger>
            <TabsTrigger value="history">تاریخچه تغییرات</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            {/* Bank Logo and Amount */}
            <div className="text-center py-4">
              {bankCode && (
                <div className="flex justify-center mb-4">
                  <BankLogo bankCode={bankCode} size="xl" />
                </div>
              )}
              <div className="text-sm text-muted-foreground mb-1">مبلغ تراکنش</div>
              <div className="text-3xl font-bold text-foreground">
                {formatCurrency(parseFloat(transaction.amount) || 0, locale)}
              </div>
            </div>

            {/* Two column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Beneficiary Info */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b">
                  اطلاعات ذینفع
                </h3>
                <div className="space-y-0">
                  <InfoRow
                    label={t("transactions.ownerName")}
                    value={transaction.destinationAccountOwner}
                  />

                  {transaction.nationalCode && (
                    <InfoRow
                      label={t("transactions.nationalCode")}
                      value={transaction.nationalCode}
                      mono
                      copyable
                    />
                  )}

                  <InfoRow
                    label={t("transactions.iban")}
                    value={transaction.destinationIban}
                    mono
                    copyable
                  />

                  {bankName && (
                    <InfoRow
                      label="بانک مقصد"
                      value={bankName}
                    />
                  )}
                </div>
              </div>

              {/* Transaction Info */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 pb-2 border-b">
                  اطلاعات تراکنش
                </h3>
                <div className="space-y-0">
                  <InfoRow
                    label={t("transactions.orderId")}
                    value={transaction.id}
                    mono
                    copyable
                  />

                  {transaction.trackingId && (
                    <InfoRow
                      label={t("transactions.trackingId")}
                      value={transaction.trackingId}
                      mono
                      copyable
                    />
                  )}

                  <InfoRow
                    label={t("transactions.createdDateTime")}
                    value={formatDateTime(transaction.createdDateTime, locale)}
                  />

                  {transaction.description && (
                    <InfoRow
                      label={t("transactions.description")}
                      value={transaction.description}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Error Message */}
            {transaction.providerMessage && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="text-sm font-medium text-destructive mb-1">علت رد</div>
                <div className="text-sm text-destructive">
                  {transaction.providerMessage}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {transaction.changeHistory && transaction.changeHistory.length > 0 ? (
              <div className="space-y-3">
                {transaction.changeHistory.map((entry, index) => (
                  <div
                    key={entry.id || index}
                    className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-sm font-medium text-foreground">
                            {entry.description}
                          </span>
                          <TransactionStatusBadge status={entry.status as any} size="sm" />
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatDateTime(entry.createdDateTime, locale)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">تاریخچه تغییراتی وجود ندارد</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
