"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { TransactionStatusSummary } from "@/types/dashboard";

interface TransactionStatusChartProps {
  data: TransactionStatusSummary[];
  delay?: number;
}

const COLORS = {
  1: "#009ef7", // در صف پردازش - Primary
  3: "#50cd89", // موفق - Success
  4: "#f1416c", // رد شده - Danger
  5: "#7c3aed", // برگشت - Purple
};

export default function TransactionStatusChart({
  data,
  delay = 0,
}: TransactionStatusChartProps) {
  const chartData = data.map((item) => ({
    name: item.statusTitle,
    value: item.transactionCount,
    percent: item.percent,
  }));

  return (
    <Card
      className="animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-6 pt-5 pb-4">
        <h3 className="font-bold text-lg mb-1">وضعیت تراکنش‌ها</h3>
        <p className="text-muted-foreground text-sm">براساس تعداد</p>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={0}
              dataKey="value"
            >
              {chartData.map((entry, index) => {
                const status = data[index].status;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[status as keyof typeof COLORS] || "#009ef7"}
                  />
                );
              })}
            </Pie>
            <Tooltip
              formatter={(value: number) => value.toLocaleString("fa-IR")}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                direction: "rtl",
              }}
            />
            <Legend
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              formatter={(value) => (
                <span style={{ color: "hsl(var(--foreground))" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
