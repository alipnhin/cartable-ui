"use client";

import { Card } from "@/components/ui/card";
import { CreditCard, Banknote, Wallet } from "lucide-react";
import type { PaymentTypeSummary } from "@/types/dashboard";
import { formatNumber } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";
import { lowerFirst } from "@/lib/helpers";

interface PaymentTypeChartProps {
  data: PaymentTypeSummary[];
  delay?: number;
}

const paymentTypeIcons = [
  { icon: CreditCard, iconBg: "bg-primary/10", iconColor: "text-primary" },
  { icon: Banknote, iconBg: "bg-success/10", iconColor: "text-success" },
  { icon: Wallet, iconBg: "bg-warning/10", iconColor: "text-warning" },
];

export default function PaymentTypeChart({
  data,
  delay = 0,
}: PaymentTypeChartProps) {
  const { t } = useTranslation();

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card
      className="animate-fade-in border-2"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-5 py-4">
        <h3 className="font-bold text-base">
          {t("dashboard.charts.paymentTypes.title")}
        </h3>
      </div>

      <div className="p-5 space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              {t("dashboard.noData")}
            </p>
          </div>
        ) : (
          data.map((item, index) => {
            const iconConfig =
              paymentTypeIcons[index % paymentTypeIcons.length];
            const Icon = iconConfig.icon;
            const percent =
              total > 0 ? Math.round((item.count / total) * 100) : 0;

            return (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${iconConfig.iconBg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-5 h-5 ${iconConfig.iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {t(
                        `transactions.paymentTypes.${lowerFirst(
                          item.paymentType
                        )}`
                      )}
                    </span>
                    <span className="text-sm font-bold text-foreground">
                      {formatNumber(item.count)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {formatNumber(item.totalAmount)} {t("statistics.rial")}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      {percent}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
