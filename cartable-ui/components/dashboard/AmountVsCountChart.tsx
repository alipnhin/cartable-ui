"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TransactionStatusSummary } from "@/types/dashboard";

interface AmountVsCountChartProps {
  data: TransactionStatusSummary[];
  delay?: number;
}

export default function AmountVsCountChart({
  data,
  delay = 0,
}: AmountVsCountChartProps) {
  // Normalize data for better visualization
  const maxCount = Math.max(...data.map((item) => item.transactionCount));
  const maxAmount = Math.max(...data.map((item) => item.totalAmount));

  const chartData = data.map((item) => ({
    name: item.statusTitle,
    تعداد: item.transactionCount,
    "مبلغ (نرمال شده)": Math.round((item.totalAmount / maxAmount) * maxCount),
    مبلغ_واقعی: item.totalAmount,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className="bg-background border border-border rounded-lg p-3 shadow-lg"
          style={{ direction: "rtl" }}
        >
          <p className="font-bold text-foreground mb-2">{payload[0].payload.name}</p>
          <p className="text-sm text-primary">
            تعداد: {payload[0].value.toLocaleString("fa-IR")}
          </p>
          <p className="text-sm text-success">
            مبلغ:{" "}
            {payload[0].payload.مبلغ_واقعی.toLocaleString("fa-IR")} ریال
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      className="animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-6 pt-5 pb-4">
        <h3 className="font-bold text-lg mb-1">مقایسه تعداد و مبلغ</h3>
        <p className="text-muted-foreground text-sm">
          تحلیل همزمان تعداد و مبلغ تراکنش‌ها
        </p>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--foreground))" }}
              style={{ fontFamily: "inherit", fontSize: "12px" }}
            />
            <YAxis
              tick={{ fill: "hsl(var(--foreground))" }}
              style={{ fontFamily: "inherit", fontSize: "12px" }}
              tickFormatter={(value) => value.toLocaleString("fa-IR")}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
              )}
            />
            <Bar dataKey="تعداد" fill="#009ef7" radius={[5, 5, 0, 0]} />
            <Bar
              dataKey="مبلغ (نرمال شده)"
              fill="#50cd89"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>نکته:</strong> مبلغ برای نمایش بهتر نرمال‌سازی شده است. برای
            مشاهده مبلغ واقعی، روی نمودار کلیک کنید.
          </p>
        </div>
      </div>
    </Card>
  );
}
