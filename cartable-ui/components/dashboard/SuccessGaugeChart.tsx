"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface SuccessGaugeChartProps {
  successPercent: number;
  delay?: number;
}

export default function SuccessGaugeChart({
  successPercent,
  delay = 0,
}: SuccessGaugeChartProps) {
  const data = [
    { name: "Success", value: successPercent },
    { name: "Remaining", value: 100 - successPercent },
  ];

  const COLORS = ["url(#successGradient)", "#e1e3ea"];

  return (
    <Card
      className="animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-6 pt-5 pb-4">
        <h3 className="font-bold text-lg mb-1">تراکنش‌های موفق</h3>
        <p className="text-muted-foreground text-sm">حجم پردازش</p>
      </div>

      <div className="p-6 flex items-center justify-center">
        <div className="relative" style={{ width: 250, height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#50cd89" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#009ef7" stopOpacity={1} />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                startAngle={90}
                endAngle={-270}
                innerRadius={80}
                outerRadius={100}
                paddingAngle={0}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-white drop-shadow-md">
                {successPercent.toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <div className="text-sm text-muted-foreground">حجم پردازش موفق</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
