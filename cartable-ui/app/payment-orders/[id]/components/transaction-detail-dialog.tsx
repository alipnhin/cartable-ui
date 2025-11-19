"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Transaction } from "@/types/transaction";
import { BankLogo } from "@/components/common/bank-logo";
import { getBankCodeFromIban } from "@/lib/bank-logos";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import {
  User,
  CreditCard,
  Building2,
  Calendar,
  Clock,
  FileText,
  Hash,
  AlertCircle,
  Banknote,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TransactionDetailDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to format date with time
const formatDateTime = (dateString: string, locale: string): { date: string; time: string } => {
  if (!dateString) return { date: "-", time: "" };

  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeFormatter = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return {
    date: dateFormatter.format(date),
    time: timeFormatter.format(date),
  };
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

// Info row component
function InfoRow({
  icon: Icon,
  label,
  value,
  mono = false,
  copyable = false,
  className,
}: {
  icon?: any;
  label: string;
  value: string | React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start gap-3 py-3", className)}>
      {Icon && (
        <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1">{label}</div>
        <div className={cn("text-sm font-medium break-all", mono && "font-mono")}>
          {value}
        </div>
      </div>
      {copyable && typeof value === "string" && <CopyButton text={value} />}
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
  const dateTime = formatDateTime(transaction.createdDateTime, locale);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-full p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
          <DialogHeader>
            <div className="flex items-center justify-between gap-4">
              <DialogTitle className="text-lg">جزئیات تراکنش</DialogTitle>
              <TransactionStatusBadge status={transaction.status} size="sm" />
            </div>
          </DialogHeader>

          {/* Amount Card */}
          <div className="mt-4 bg-card rounded-xl p-4 border shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Banknote className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground">مبلغ تراکنش</div>
                <div className="text-xl font-bold text-foreground">
                  {formatCurrency(transaction.amount, locale)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 pt-2 space-y-6">
          {/* Beneficiary Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              اطلاعات ذینفع
            </h3>
            <div className="bg-muted/30 rounded-xl p-4 space-y-1 divide-y divide-border/50">
              <InfoRow
                icon={User}
                label={t("transactions.ownerName")}
                value={transaction.ownerName}
              />

              {transaction.nationalCode && (
                <InfoRow
                  icon={CreditCard}
                  label={t("transactions.nationalCode")}
                  value={transaction.nationalCode}
                  mono
                  copyable
                />
              )}

              <InfoRow
                icon={Hash}
                label={t("transactions.iban")}
                value={transaction.destinationIban}
                mono
                copyable
              />

              {bankCode && (
                <div className="flex items-start gap-3 py-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">بانک مقصد</div>
                    <BankLogo bankCode={bankCode} showName size="sm" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Info Section */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              اطلاعات تراکنش
            </h3>
            <div className="bg-muted/30 rounded-xl p-4 space-y-1 divide-y divide-border/50">
              <InfoRow
                icon={Hash}
                label={t("transactions.orderId")}
                value={transaction.id}
                mono
                copyable
              />

              {transaction.trackingId && (
                <InfoRow
                  icon={Hash}
                  label={t("transactions.trackingId")}
                  value={transaction.trackingId}
                  mono
                  copyable
                />
              )}

              <div className="flex items-start gap-3 py-3">
                <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("transactions.createdDateTime")}
                  </div>
                  <div className="text-sm font-medium flex items-center gap-3">
                    <span>{dateTime.date}</span>
                    {dateTime.time && (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        {dateTime.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {transaction.description && (
                <InfoRow
                  icon={FileText}
                  label={t("transactions.description")}
                  value={transaction.description}
                />
              )}
            </div>
          </div>

          {/* Error Message Section */}
          {transaction.providerMessage && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-destructive/20 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-destructive/70 mb-1">علت رد</div>
                  <div className="text-sm font-medium text-destructive">
                    {transaction.providerMessage}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
