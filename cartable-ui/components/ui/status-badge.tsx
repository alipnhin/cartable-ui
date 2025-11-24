/**
 * Status Badge Component
 * نمایش وضعیت با رنگ و آیکون مناسب
 */

"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TransactionStatus } from "@/types";
import { PaymentStatusEnum } from "@/types/api";
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
  const statusMap: Record<
    PaymentStatusEnum,
    {
      variant: BadgeVariant;
      translationKey: string;
      icon: React.ElementType;
    }
  > = {
    [PaymentStatusEnum.Draft]: {
      variant: "muted",
      translationKey: "paymentCartable.statusLabels.draft",
      icon: FileText,
    },
    [PaymentStatusEnum.WaitingForOwnersApproval]: {
      variant: "warning",
      translationKey: "paymentCartable.statusLabels.waitingForApproval",
      icon: Clock,
    },
    [PaymentStatusEnum.OwnersApproved]: {
      variant: "success",
      translationKey: "paymentCartable.statusLabels.approved",
      icon: UserRoundCheck,
    },
    [PaymentStatusEnum.SubmittedToBank]: {
      variant: "info",
      translationKey: "paymentCartable.statusLabels.submittedToBank",
      icon: Banknote,
    },
    [PaymentStatusEnum.BankSucceeded]: {
      variant: "success",
      translationKey: "paymentCartable.statusLabels.succeeded",
      icon: CheckCircle2,
    },
    [PaymentStatusEnum.DoneWithError]: {
      variant: "warning",
      translationKey: "paymentCartable.statusLabels.doneWithError",
      icon: AlertTriangle,
    },
    [PaymentStatusEnum.OwnerRejected]: {
      variant: "danger",
      translationKey: "paymentCartable.statusLabels.rejected",
      icon: UserRoundX,
    },
    [PaymentStatusEnum.BankRejected]: {
      variant: "danger",
      translationKey: "paymentCartable.statusLabels.bankRejected",
      icon: BanknoteX,
    },
    [PaymentStatusEnum.Canceled]: {
      variant: "muted",
      translationKey: "paymentCartable.statusLabels.canceled",
      icon: Ban,
    },
    [PaymentStatusEnum.Expired]: {
      variant: "muted",
      translationKey: "paymentCartable.statusLabels.expired",
      icon: AlarmClockOff,
    },
    [PaymentStatusEnum.WaitForManagerApproval]: {
      variant: "info",
      translationKey: "paymentCartable.statusLabels.waitForManagerApproval",
      icon: ClipboardCheck,
    },
  };

  return (
    statusMap[status] || {
      variant: "default",
      translationKey: "common.status",
      icon: HelpCircle,
    }
  );
}

// Helper function to get badge variant from TransactionStatus enum
export function getTransactionStatusBadge(status: TransactionStatus): {
  variant: BadgeVariant;
  icon: React.ElementType;
} {
  const statusMap: Record<
    TransactionStatus,
    {
      variant: BadgeVariant;
      icon: React.ElementType;
    }
  > = {
    [TransactionStatus.Registered]: {
      variant: "muted",
      icon: FileText,
    },
    [TransactionStatus.Canceled]: {
      variant: "warning",
      icon: Clock,
    },
    [TransactionStatus.BankSucceeded]: {
      variant: "success",
      icon: CheckCircle2,
    },
    [TransactionStatus.WaitForExecution]: {
      variant: "info",
      icon: Banknote,
    },
    [TransactionStatus.WaitForBank]: {
      variant: "default",
      icon: CheckCircle2,
    },
    [TransactionStatus.Failed]: {
      variant: "danger",
      icon: XCircle,
    },
    [TransactionStatus.BankRejected]: {
      variant: "danger",
      icon: Ban,
    },
    [TransactionStatus.Expired]: {
      variant: "muted",
      icon: XCircle,
    },
    [TransactionStatus.TransactionRollback]: {
      variant: "muted",
      icon: "symbol",
    },
  };

  return (
    statusMap[status] || {
      variant: "default",
      icon: HelpCircle,
    }
  );
}

export function getPaymentTypeBadge(type: number | undefined | null): {
  variant: BadgeVariant;
  label_fa: string;
  label_en: string;
} {
  if (type === undefined || type === null) {
    return { variant: "muted", label_fa: "نامشخص", label_en: "Unknown" };
  }

  const typeMap: Record<
    number,
    { variant: BadgeVariant; label_fa: string; label_en: "Internal" | "Paya" | "Satna" | "Card" }
  > = {
    0: { variant: "default", label_fa: "داخلی", label_en: "Internal" },
    1: { variant: "success", label_fa: "پایا", label_en: "Paya" },
    2: { variant: "info", label_fa: "ساتنا", label_en: "Satna" },
    3: { variant: "warning", label_fa: "کارت به کارت", label_en: "Card" },
  };

  return (
    typeMap[type] || {
      variant: "muted",
      label_fa: "نامشخص",
      label_en: "Unknown",
    }
  );
}

// Wrapper Component for PaymentType
interface PaymentTypeBadgeProps {
  type: number | undefined | null;
  size?: "sm" | "default";
  className?: string;
}

export function PaymentTypeBadge({
  type,
  size = "default",
  className,
}: PaymentTypeBadgeProps) {
  const typeInfo = getPaymentTypeBadge(type);

  return (
    <StatusBadge
      variant={typeInfo.variant}
      className={className}
    >
      {typeInfo.label_fa}
    </StatusBadge>
  );
}

// Wrapper Component for TransactionStatus
interface TransactionStatusBadgeProps {
  status: TransactionStatus;
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
      {t(`transactionStatus.${status}`)}
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
