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
import {
  PaymentTypeBadge,
  TransactionStatusBadge,
} from "@/components/ui/status-badge";
import { formatCurrency, formatCurrencyNoneUnit } from "@/lib/helpers";
import useTranslation from "@/hooks/useTranslation";
import {
  Copy,
  Check,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  FileEdit,
  Ban,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { PaymentItemStatusEnum } from "@/types/api";

interface TransactionDetailDialogProps {
  transaction: WithdrawalTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper to format date with time
const formatDateTime = (dateString: string, locale: string): string => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const dateFormatter = new Intl.DateTimeFormat(
    locale === "fa" ? "fa-IR" : "en-US",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return dateFormatter.format(date);
};

// Helper to get status icon for timeline
function getTransactionStatusIcon(status: PaymentItemStatusEnum) {
  switch (status) {
    case PaymentItemStatusEnum.Registered:
      return <FileEdit className="h-5 w-5 text-gray-600" />;
    case PaymentItemStatusEnum.WaitForExecution:
      return <Clock className="h-5 w-5 text-blue-600" />;
    case PaymentItemStatusEnum.WaitForBank:
      return <Send className="h-5 w-5 text-purple-600" />;
    case PaymentItemStatusEnum.BankSucceeded:
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case PaymentItemStatusEnum.BankRejected:
    case PaymentItemStatusEnum.Failed:
      return <XCircle className="h-5 w-5 text-red-600" />;
    case PaymentItemStatusEnum.TransactionRollback:
      return <AlertCircle className="h-5 w-5 text-warning" />;
    case PaymentItemStatusEnum.Canceled:
    case PaymentItemStatusEnum.Expired:
      return <Ban className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Clock className="h-5 w-5 text-gray-600" />;
  }
}

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
        <span
          className={`text-sm font-medium text-foreground text-left ${
            mono ? "font-mono" : ""
          }`}
        >
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
            <DialogTitle className="text-lg font-semibold">
              جزئیات تراکنش
            </DialogTitle>
            <TransactionStatusBadge
              status={transaction.status as any}
              size="sm"
            />
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
              <div className="text-sm text-muted-foreground mb-1">
                مبلغ تراکنش
              </div>
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-foreground mb-32">
                {formatCurrencyNoneUnit(
                  parseFloat(transaction.amount) || 0,
                  locale
                )}
                <span className="text-sm text-muted-foreground">
                  {t("transactions.rial")}
                </span>
              </div>
              <PaymentTypeBadge
                type={transaction.paymentType as any}
                size="sm"
              />
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

                  {bankName && <InfoRow label="بانک مقصد" value={bankName} />}
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
                    value={transaction.orderId}
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
                <div className="text-sm font-medium text-destructive mb-1">
                  علت رد
                </div>
                <div className="text-sm text-destructive">
                  {transaction.providerMessage}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            {transaction.changeHistory &&
            transaction.changeHistory.length > 0 ? (
              <div className="relative">
                {/* Timeline List */}
                <div className="space-y-4">
                  {[...transaction.changeHistory]
                    .sort(
                      (a, b) =>
                        new Date(b.createdDateTime).getTime() -
                        new Date(a.createdDateTime).getTime()
                    )
                    .map((entry, index, arr) => (
                      <div
                        className="flex items-start relative"
                        key={entry.id || index}
                      >
                        {/* Vertical connecting line */}
                        {index < arr.length - 1 && (
                          <div className="w-9 start-0 top-9 absolute bottom-0 rtl:-translate-x-1/2 translate-x-1/2 border-s border-s-input"></div>
                        )}

                        {/* Status Icon */}
                        <div className="flex items-center justify-center bg-accent/60 shrink-0 rounded-full border border-input size-9 text-secondary-foreground z-10">
                          {getTransactionStatusIcon(entry.status)}
                        </div>

                        {/* Timeline Content */}
                        <div className="ps-2.5 mb-7 text-base grow">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <TransactionStatusBadge
                                status={entry.status as any}
                                size="default"
                              />
                            </div>
                            <div className="text-sm mb-2 font-medium">
                              {entry.description || "بدون توضیحات"}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>
                                {new Date(
                                  entry.createdDateTime
                                ).toLocaleDateString(
                                  locale === "fa" ? "fa-IR" : "en-US",
                                  {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                  }
                                )}
                              </span>
                              <span>
                                {new Date(
                                  entry.createdDateTime
                                ).toLocaleTimeString(
                                  locale === "fa" ? "fa-IR" : "en-US",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  تاریخچه تغییراتی وجود ندارد
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
