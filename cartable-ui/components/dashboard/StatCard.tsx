import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";
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
  const { t, locale } = useTranslation();
  return (
    <Card
      className="hover:shadow-lg transition-all duration-300 animate-fade-in border-2 hover:border-primary/20"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="p-5">
        {/* Header with icon and badge */}
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-11 h-11 rounded-xl ${iconBgColor} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          {badge && (
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                badgeStyles[badge.variant]
              }`}
            >
              {badge.value}
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mb-3">
          <span className="text-muted-foreground text-sm font-medium">
            {title}
          </span>
        </div>

        {/* Value */}
        <div className="mb-2">
          <span className="text-foreground font-bold text-3xl">
            {formattedValue}
          </span>
        </div>

        {/* Amount */}
        <div className="pt-3 border-t">
          <span className="text-sm font-semibold text-foreground">
            {formattedAmount}
          </span>
          <span className="text-xs text-muted-foreground ms-1">
            {t("statistics.rial")}
          </span>
        </div>
      </div>
    </Card>
  );
}
