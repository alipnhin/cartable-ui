"use client";

import { cn } from "@/lib/utils";
import { getBankLogo, getBankName } from "@/lib/bank-logos";

interface BankLogoProps {
  bankCode: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  showName?: boolean;
}

const sizeClasses = {
  xs: "h-4 w-4",
  sm: "h-6 w-6",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

export function BankLogo({
  bankCode,
  size = "md",
  className,
  showName = false,
}: BankLogoProps) {
  const logo = getBankLogo(bankCode);
  const name = getBankName(bankCode);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative rounded overflow-hidden flex-shrink-0",
          sizeClasses[size]
        )}
      >
        <img
          src={logo}
          alt={name}
          className="object-contain w-full h-full"
          onError={(e) => {
            e.currentTarget.src = "/media/bank-logos/999.png";
          }}
        />
      </div>
      {showName && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {name}
        </span>
      )}
    </div>
  );
}
