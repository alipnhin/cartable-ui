import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  amount: number;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  badge?: {
    value: string;
    variant: "success" | "warning" | "danger" | "primary";
  };
  delay?: number;
}

const badgeStyles = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
  primary: "bg-primary/10 text-primary",
};

export default function StatCard({
  title,
  value,
  amount,
  icon: Icon,
  iconBgColor,
  iconColor,
  badge,
  delay = 0,
}: StatCardProps) {
  const formattedAmount = formatNumber(amount);
  const formattedValue = formatNumber(value);

  return (
    <Card
      className="hover:shadow-md transition-shadow animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="p-6">
        <div className={`w-12 h-12 rounded-lg ${iconBgColor} flex items-center justify-center mb-5`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="text-foreground font-semibold text-sm mb-2">
              {title}
            </span>
            <span className="text-muted-foreground font-semibold text-base my-3">
              {formattedAmount} ریال
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-foreground font-bold text-3xl leading-none">
            {formattedValue}
          </span>
          {badge && (
            <span
              className={`px-3 py-1 rounded text-sm font-semibold ${
                badgeStyles[badge.variant]
              }`}
            >
              {badge.value}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}
