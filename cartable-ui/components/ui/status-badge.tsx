/**
 * Status Badge Component
 * نمایش وضعیت با رنگ و آیکون مناسب
 */

"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { OrderStatus, TransactionStatus } from "@/types";
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

// Helper function to get badge variant from OrderStatus enum
export function getPaymentStatusBadge(status: OrderStatus): {
  variant: BadgeVariant;
  label_fa: string;
  label_en: string;
  icon: React.ElementType;
} {
  const statusMap: Record<
    OrderStatus,
    {
      variant: BadgeVariant;
      label_fa: string;
      label_en: string;
      icon: React.ElementType;
    }
  > = {
    [OrderStatus.Draft]: {
      variant: "muted",
      label_fa: "پیش‌نویس",
      label_en: "Draft",
      icon: FileText,
    },
    [OrderStatus.WaitingForOwnersApproval]: {
      variant: "warning",
      label_fa: "در انتظار تأیید",
      label_en: "Waiting For Approval",
      icon: Clock,
    },
    [OrderStatus.OwnersApproved]: {
      variant: "success",
      label_fa: "تأیید شده",
      label_en: "Approved",
      icon: UserRoundCheck,
    },
    [OrderStatus.SubmittedToBank]: {
      variant: "info",
      label_fa: "ارسال شده به بانک",
      label_en: "Submitted To Bank",
      icon: Banknote,
    },
    [OrderStatus.Succeeded]: {
      variant: "success",
      label_fa: "انجام شده",
      label_en: "Succeeded",
      icon: CheckCircle2,
    },
    [OrderStatus.PartiallySucceeded]: {
      variant: "warning",
      label_fa: "انجام شده با خطا",
      label_en: "Done with Error",
      icon: AlertTriangle,
    },
    [OrderStatus.OwnerRejected]: {
      variant: "danger",
      label_fa: "عدم تائید",
      label_en: "Owner Rejected",
      icon: UserRoundX,
    },
    [OrderStatus.BankRejected]: {
      variant: "danger",
      label_fa: "رد شده توسط بانک",
      label_en: "Bank Rejected",
      icon: BanknoteX,
    },
    [OrderStatus.Canceled]: {
      variant: "muted",
      label_fa: "لغو شده",
      label_en: "Canceled",
      icon: Ban,
    },
    [OrderStatus.Expired]: {
      variant: "muted",
      label_fa: "منقضی شده",
      label_en: "Expired",
      icon: AlarmClockOff,
    },
  };

  return (
    statusMap[status] || {
      variant: "default",
      label_fa: "نامشخص",
      label_en: "Unknown",
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

export function getPaymentTypeBadge(type: number | undefined): {
  variant: BadgeVariant;
  label_fa: string;
  label_en: string;
} {
  if (type === undefined) {
    return { variant: "muted", label_fa: "نامشخص", label_en: "Unknown" };
  }

  const typeMap: Record<
    number,
    { variant: BadgeVariant; label_fa: string; label_en: string }
  > = {
    0: { variant: "default", label_fa: "داخلی", label_en: "Internal" },
    1: { variant: "success", label_fa: "پایا", label_en: "Paya" },
    2: { variant: "info", label_fa: "ساتنا", label_en: "Satna" },
  };

  return (
    typeMap[type] || {
      variant: "muted",
      label_fa: "نامشخص",
      label_en: "Unknown",
    }
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

// Wrapper Component for OrderStatus
interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "default";
  className?: string;
}

export function OrderStatusBadge({
  status,
  size = "default",
  className,
}: OrderStatusBadgeProps) {
  const statusInfo = getPaymentStatusBadge(status);
  const Icon = statusInfo.icon;

  return (
    <StatusBadge
      variant={statusInfo.variant}
      icon={<Icon className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />}
      className={className}
    >
      {statusInfo.label_fa}
    </StatusBadge>
  );
}
