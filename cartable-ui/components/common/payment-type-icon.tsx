"use client";

import { PaymentMethodEnum } from "@/types/transaction";
import { Building2, Waves, Zap, CreditCard, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

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
    variant: "secondary",
  },
  internal: {
    icon: Building2,
    label: "داخلی",
    color: "text-green-600",
    variant: "success",
  },
  paya: {
    icon: Waves,
    label: "پایا",
    color: "text-blue-600",
    variant: "info",
  },
  satna: {
    icon: Zap,
    label: "ساتنا",
    color: "text-purple-600",
    variant: "primary",
  },
  card: {
    icon: CreditCard,
    label: "کارت به کارت",
    color: "text-orange-600",
    variant: "destructive",
  },
} as const;

export function PaymentTypeIcon({
  type,
  className,
  showLabel = true,
}: PaymentTypeIconProps) {
  const config = paymentTypeConfig[type] || paymentTypeConfig.unknown;
  const Icon = config.icon;

  if (showLabel) {
    return (
      <Badge variant={config.variant} appearance="outline" size="sm">
        {/* <Icon />  */}
        {config.label}
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} appearance="light">
      <Icon />
    </Badge>
  );
}
