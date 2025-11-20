"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

interface SuccessGaugeChartProps {
  successPercent: number;
  delay?: number;
}

export default function SuccessGaugeChart({
  successPercent,
  delay = 0,
}: SuccessGaugeChartProps) {
  const { t } = useTranslation();

  // Calculate stroke dasharray for the circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (successPercent / 100) * circumference;

  return (
    <Card
      className="animate-fade-in border-2"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="border-b px-5 py-4">
        <h3 className="font-bold text-base">
          {t("dashboard.charts.successGauge.title")}
        </h3>
      </div>

      <div className="p-5 flex flex-col items-center justify-center">
        <div className="relative w-44 h-44">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
            {/* Background circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-muted"
            />
            {/* Progress circle */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              stroke="url(#successGradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#50cd89" />
                <stop offset="100%" stopColor="#009ef7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground">
              {successPercent.toFixed(0)}%
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {t("dashboard.charts.successGauge.successVolume")}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-4 h-4 text-success" />
          </div>
          <span className="text-sm text-muted-foreground">
            {t("dashboard.stats.succeededTransactions")}
          </span>
        </div>
      </div>
    </Card>
  );
}
