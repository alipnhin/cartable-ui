"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { PaymentTypeSummary } from "@/types/dashboard";
import useTranslation from "@/hooks/useTranslation";

interface PaymentTypeChartProps {
  data: PaymentTypeSummary[];
  delay?: number;
}

const COLORS = ["#009ef7", "#50cd89", "#ffc700"];

export default function PaymentTypeChart({
  data,
  delay = 0,
}: PaymentTypeChartProps) {
  const { t } = useTranslation();

  const chartData = data.map((item) => ({
    name: item.paymentTypeTitle,
    value: item.count,
  }));

  return (
    <Card
      className="animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-6 pt-5 pb-4">
        <h3 className="font-bold text-lg mb-1">{t("dashboard.charts.paymentTypes.title")}</h3>
        <p className="text-muted-foreground text-sm">{t("dashboard.charts.paymentTypes.subtitle")}</p>
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
            <Tooltip
              formatter={(value: number) => value.toLocaleString("fa-IR")}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                direction: "rtl",
              }}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
