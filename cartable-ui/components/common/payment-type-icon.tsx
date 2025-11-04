"use client";

import { PaymentMethodEnum } from "@/types/transaction";
import { Building2, Waves, Zap, CreditCard, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentTypeIconProps {
  type: PaymentMethodEnum;
  className?: string;
  showLabel?: boolean;
}

const paymentTypeConfig = {
  unknown: {
    icon: HelpCircle,
    label: "نامشخص",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  internal: {
    icon: Building2,
    label: "داخلی",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  paya: {
    icon: Waves,
    label: "پایا",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  satna: {
    icon: Zap,
    label: "ساتنا",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
  card: {
    icon: CreditCard,
    label: "کارت به کارت",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
} as const;

export function PaymentTypeIcon({
  type,
  className,
  showLabel = false,
}: PaymentTypeIconProps) {
  const config = paymentTypeConfig[type] || paymentTypeConfig.unknown;
  const Icon = config.icon;

  if (showLabel) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn("p-1.5 rounded", config.bgColor)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        <span className="text-sm font-medium">{config.label}</span>
      </div>
    );
  }

  return (
    <div className={cn("p-1.5 rounded", config.bgColor, className)}>
      <Icon className={cn("h-4 w-4", config.color)} />
    </div>
  );
}
