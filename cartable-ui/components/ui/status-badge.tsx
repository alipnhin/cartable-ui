/**
 * Status Badge Component
 * نمایش وضعیت با رنگ و آیکون مناسب
 */

"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  PaymentStatusEnum,
  PaymentItemStatusEnum,
  TransactionReasonEnum,
  PaymentMethodEnum,
} from "@/types/api";
import { useTranslation } from "react-i18next";
import {
  FileText,
  Hourglass,
  CheckCircle2,
  Banknote,
  AlertTriangle,
  XCircle,
  Ban,
  Clock,
  HelpCircle,
  BanknoteX,
  AlarmClockOff,
  UserRoundCheck,
  UserRoundX,
  ClipboardCheck,
} from "lucide-react";

export type BadgeVariant =
  | "default"
  | "success"
  | "successLight"
  | "warning"
  | "danger"
  | "info"
  | "accent"
  | "muted";

interface StatusBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20",
  success:
    "bg-green-600/15 text-green-700 dark:text-green-400 border-green-600/25 hover:bg-green-600/25",
  successLight:
    "bg-green-500/10 text-green-600 dark:text-green-300 border-green-500/20 hover:bg-green-500/20",
  warning:
    "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  danger:
    "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20 hover:bg-red-500/20",
  info: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  accent:
    "bg-accent-500/10 text-accent-700 dark:text-accent-400 border-accent-500/20 hover:bg-accent-500/20",
  muted: "bg-muted text-muted-foreground border-muted-foreground/20",
};

export function StatusBadge({
  variant = "default",
  children,
  icon,
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs  border px-2 py-2 gap-1 inline-flex items-center whitespace-nowrap",
        variantStyles[variant],
        className
      )}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      <span>{children}</span>
    </Badge>
  );
}

// Helper function to get badge variant from PaymentStatusEnum
export function getPaymentStatusBadge(status: PaymentStatusEnum): {
  variant: BadgeVariant;
  translationKey: string;
  icon: React.ElementType;
} {
  // استفاده از switch برای type-safety بهتر
  switch (status) {
    case PaymentStatusEnum.WaitingForOwnersApproval:
      return {
        variant: "warning",
        translationKey: "paymentCartable.statusLabels.waitingForApproval",
        icon: Clock,
      };
    case PaymentStatusEnum.OwnersApproved:
      return {
        variant: "successLight",
        translationKey: "paymentCartable.statusLabels.approved",
        icon: UserRoundCheck,
      };
    case PaymentStatusEnum.SubmittedToBank:
      return {
        variant: "info",
        translationKey: "paymentCartable.statusLabels.submittedToBank",
        icon: Banknote,
      };
    case PaymentStatusEnum.BankSucceeded:
      return {
        variant: "success",
        translationKey: "paymentCartable.statusLabels.succeeded",
        icon: CheckCircle2,
      };
    case PaymentStatusEnum.OwnerRejected:
      return {
        variant: "danger",
        translationKey: "paymentCartable.statusLabels.rejected",
        icon: UserRoundX,
      };
    case PaymentStatusEnum.BankRejected:
      return {
        variant: "danger",
        translationKey: "paymentCartable.statusLabels.bankRejected",
        icon: BanknoteX,
      };
    case PaymentStatusEnum.Draft:
      return {
        variant: "muted",
        translationKey: "paymentCartable.statusLabels.draft",
        icon: FileText,
      };
    case PaymentStatusEnum.DoneWithError:
      return {
        variant: "successLight",
        translationKey: "paymentCartable.statusLabels.doneWithError",
        icon: AlertTriangle,
      };
    case PaymentStatusEnum.Canceled:
      return {
        variant: "muted",
        translationKey: "paymentCartable.statusLabels.canceled",
        icon: Ban,
      };
    case PaymentStatusEnum.Expired:
      return {
        variant: "muted",
        translationKey: "paymentCartable.statusLabels.expired",
        icon: AlarmClockOff,
      };
    case PaymentStatusEnum.WaitForManagerApproval:
      return {
        variant: "info",
        translationKey: "paymentCartable.statusLabels.waitForManagerApproval",
        icon: ClipboardCheck,
      };
    default:
      return {
        variant: "default",
        translationKey: "common.status",
        icon: HelpCircle,
      };
  }
}

// Helper function to get badge variant from TransactionStatus enum
export function getTransactionStatusBadge(status: PaymentItemStatusEnum): {
  variant: BadgeVariant;
  translationKey: string;
  icon: React.ElementType;
} {
  switch (status) {
    case PaymentItemStatusEnum.Registered:
      return {
        variant: "muted",
        translationKey: "transactionStatus.registered",
        icon: FileText,
      };
    case PaymentItemStatusEnum.WaitForExecution:
      return {
        variant: "info",
        translationKey: "transactionStatus.waitForExecution",
        icon: Banknote,
      };
    case PaymentItemStatusEnum.WaitForBank:
      return {
        variant: "info",
        translationKey: "transactionStatus.waitForBank",
        icon: CheckCircle2,
      };
    case PaymentItemStatusEnum.BankSucceeded:
      return {
        variant: "success",
        translationKey: "transactionStatus.bankSucceeded",
        icon: CheckCircle2,
      };
    case PaymentItemStatusEnum.BankRejected:
      return {
        variant: "danger",
        translationKey: "transactionStatus.bankRejected",
        icon: Ban,
      };
    case PaymentItemStatusEnum.TransactionRollback:
      return {
        variant: "muted",
        translationKey: "transactionStatus.transactionRollback",
        icon: Hourglass,
      };
    case PaymentItemStatusEnum.Failed:
      return {
        variant: "danger",
        translationKey: "transactionStatus.failed",
        icon: XCircle,
      };
    case PaymentItemStatusEnum.Canceled:
      return {
        variant: "warning",
        translationKey: "transactionStatus.canceled",
        icon: Clock,
      };
    case PaymentItemStatusEnum.Expired:
      return {
        variant: "muted",
        translationKey: "transactionStatus.expired",
        icon: XCircle,
      };
    default:
      return {
        variant: "default",
        translationKey: "common.status",
        icon: HelpCircle,
      };
  }
}

export function getPaymentTypeBadge(
  type: PaymentMethodEnum | undefined | null
): {
  variant: BadgeVariant;
  translationKey: string;
} {
  if (type === undefined || type === null) {
    return {
      variant: "muted",
      translationKey: "transactions.paymentTypes.unknown",
    };
  }

  switch (type) {
    case PaymentMethodEnum.Paya:
      return {
        variant: "warning",
        translationKey: "transactions.paymentTypes.paya",
      };
    case PaymentMethodEnum.Satna:
      return {
        variant: "info",
        translationKey: "transactions.paymentTypes.satna",
      };
    case PaymentMethodEnum.Internal:
      return {
        variant: "success",
        translationKey: "transactions.paymentTypes.rtgs",
      };
    default:
      return {
        variant: "muted",
        translationKey: "transactions.paymentTypes.unknown",
      };
  }
}

// Wrapper Component for PaymentType
interface PaymentTypeBadgeProps {
  type: PaymentMethodEnum | undefined | null;
  size?: "sm" | "default";
  className?: string;
}

export function PaymentTypeBadge({
  type,
  size = "default",
  className,
}: PaymentTypeBadgeProps) {
  const { t } = useTranslation();
  const typeInfo = getPaymentTypeBadge(type);

  return (
    <StatusBadge variant={typeInfo.variant} className={className}>
      {t(typeInfo.translationKey)}
    </StatusBadge>
  );
}

// Wrapper Component for TransactionStatus
interface TransactionStatusBadgeProps {
  status: PaymentItemStatusEnum;
  size?: "sm" | "default";
  className?: string;
}

export function TransactionStatusBadge({
  status,
  size = "default",
  className,
}: TransactionStatusBadgeProps) {
  const { t } = useTranslation();
  const statusInfo = getTransactionStatusBadge(status);
  const Icon = statusInfo.icon;

  return (
    <StatusBadge
      variant={statusInfo.variant}
      icon={<Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />}
      className={className}
    >
      {t(statusInfo.translationKey)}
    </StatusBadge>
  );
}

// Wrapper Component for PaymentStatus
interface PaymentStatusBadgeProps {
  status: PaymentStatusEnum;
  size?: "sm" | "default";
  className?: string;
}

export function PaymentStatusBadge({
  status,
  size = "default",
  className,
}: PaymentStatusBadgeProps) {
  const { t } = useTranslation();
  const statusInfo = getPaymentStatusBadge(status);
  const Icon = statusInfo.icon;

  // Debug: log if status is not found
  if (statusInfo.translationKey === "common.status") {
    console.warn("Unknown payment status:", status, "Type:", typeof status);
  }

  return (
    <StatusBadge
      variant={statusInfo.variant}
      icon={<Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />}
      className={className}
    >
      {t(statusInfo.translationKey)}
    </StatusBadge>
  );
}

// Backward compatibility alias
export const OrderStatusBadge = PaymentStatusBadge;
