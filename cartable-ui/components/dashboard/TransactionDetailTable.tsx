import { Card } from "@/components/ui/card";
import { Timer, CheckCircle, XCircle, ArrowLeftRight } from "lucide-react";
import type { TransactionStatusSummary } from "@/types/dashboard";
import { formatNumber } from "@/lib/utils";

interface TransactionDetailTableProps {
  data: TransactionStatusSummary[];
  delay?: number;
}

const statusConfig = {
  1: {
    icon: Timer,
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
    badgeClass: "bg-warning/10 text-warning",
    progressColor: "bg-warning",
  },
  3: {
    icon: CheckCircle,
    iconBg: "bg-success/10",
    iconColor: "text-success",
    badgeClass: "bg-success/10 text-success",
    progressColor: "bg-success",
  },
  4: {
    icon: XCircle,
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
    badgeClass: "bg-destructive/10 text-destructive",
    progressColor: "bg-destructive",
  },
  5: {
    icon: ArrowLeftRight,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    badgeClass: "bg-primary/10 text-primary",
    progressColor: "bg-primary",
  },
};

export default function TransactionDetailTable({
  data,
  delay = 0,
}: TransactionDetailTableProps) {
  return (
    <Card
      className="animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-6 pt-5 pb-4">
        <h3 className="font-bold text-lg mb-1">جزئیات تراکنش‌ها</h3>
        <p className="text-muted-foreground text-sm">اطلاعات تفصیلی</p>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-muted-foreground bg-muted/50">
                <th className="text-right px-4 py-3 rounded-r-lg min-w-[200px]">
                  وضعیت
                </th>
                <th className="text-right px-4 py-3 min-w-[100px]">تعداد</th>
                <th className="text-right px-4 py-3 min-w-[100px]">درصد</th>
                <th className="text-right px-4 py-3 min-w-[200px]">مبلغ</th>
                <th className="text-right px-4 py-3 rounded-l-lg min-w-[200px]">
                  پیشرفت
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {data.map((item, index) => {
                const config =
                  statusConfig[item.status as keyof typeof statusConfig];
                if (!config) return null;

                const Icon = config.icon;

                return (
                  <tr key={index}>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-11 h-11 rounded-lg ${config.iconBg} flex items-center justify-center`}
                        >
                          <Icon className={`w-6 h-6 ${config.iconColor}`} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-foreground font-semibold text-sm">
                            {item.statusTitle}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            وضعیت کد: {item.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-foreground font-bold text-lg">
                        {formatNumber(item.transactionCount)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-3 py-1 rounded text-sm font-semibold ${config.badgeClass}`}
                      >
                        {item.percent}%
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-foreground font-semibold text-sm">
                        {formatNumber(item.totalAmount)} ریال
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col w-full">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-muted-foreground text-xs font-semibold">
                            {item.percent}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${config.progressColor}`}
                            style={{ width: `${Math.min(item.percent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
