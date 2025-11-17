"use client";

import { Card } from "@/components/ui/card";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TransactionStatusSummary } from "@/types/dashboard";
import useTranslation from "@/hooks/useTranslation";

interface PerformanceChartProps {
  data: TransactionStatusSummary[];
  delay?: number;
}

export default function PerformanceChart({
  data,
  delay = 0,
}: PerformanceChartProps) {
  const { t } = useTranslation();

  const chartData = data.map((item) => ({
    name: item.statusTitle,
    count: item.transactionCount,
    percent: item.percent,
  }));

  return (
    <Card
      className="animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-6 pt-5 pb-4">
        <h3 className="font-bold text-lg mb-1">{t("dashboard.charts.performance.title")}</h3>
        <p className="text-muted-foreground text-sm">{t("dashboard.charts.performance.subtitle")}</p>
      </div>

      <div className="p-6">
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7239ea" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#7239ea" stopOpacity={0.85} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              tick={{ fill: "hsl(var(--foreground))" }}
              style={{ fontFamily: "inherit", fontSize: "12px" }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "hsl(var(--foreground))" }}
              style={{ fontFamily: "inherit", fontSize: "12px" }}
              tickFormatter={(value) => value.toLocaleString("fa-IR")}
              label={{
                value: t("dashboard.charts.performance.transactionCount"),
                angle: -90,
                position: "insideLeft",
                style: { fill: "hsl(var(--foreground))", fontWeight: 900 },
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "hsl(var(--foreground))" }}
              style={{ fontFamily: "inherit", fontSize: "12px" }}
              tickFormatter={(value) => `${value}%`}
              label={{
                value: t("dashboard.charts.performance.percent"),
                angle: 90,
                position: "insideRight",
                style: { fill: "hsl(var(--foreground))", fontWeight: 900 },
              }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === t("dashboard.charts.performance.transactionCount")) {
                  return value.toLocaleString("fa-IR");
                }
                return `${value}%`;
              }}
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
            <Bar
              yAxisId="left"
              dataKey="count"
              name={t("dashboard.charts.performance.transactionCount")}
              fill="url(#barGradient)"
              radius={[5, 5, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="percent"
              name={t("dashboard.charts.performance.percent")}
              stroke="#009ef7"
              strokeWidth={4}
              dot={{ r: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
