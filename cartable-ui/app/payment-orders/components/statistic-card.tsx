import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface StatisticCardProps {
  icon: LucideIcon;
  accentColor?: "primary" | "success" | "warning" | "info" | "destructive";
  value: string | number;
  label: string;
}

interface StatisticCardsProps {
  cards: StatisticCardProps[];
}

export default function StatisticCard({ cards }: StatisticCardsProps) {
  const accentColors = {
    primary: {
      bg: "oklch(0.62 0.15 155 / 0.1)",
      color: "oklch(0.62 0.15 155)",
      border: "oklch(0.62 0.15 155 / 0.2)",
    },
    success: {
      bg: "oklch(0.62 0.15 155 / 0.1)",
      color: "oklch(0.62 0.15 155)",
      border: "oklch(0.62 0.15 155 / 0.2)",
    },
    warning: {
      bg: "oklch(0.75 0.12 75 / 0.1)",
      color: "oklch(0.75 0.12 75)",
      border: "oklch(0.75 0.12 75 / 0.2)",
    },
    info: {
      bg: "oklch(0.68 0.10 220 / 0.1)",
      color: "oklch(0.68 0.10 220)",
      border: "oklch(0.68 0.10 220 / 0.2)",
    },
    destructive: {
      bg: "oklch(0.58 0.18 20 / 0.1)",
      color: "oklch(0.58 0.18 20)",
      border: "oklch(0.58 0.18 20 / 0.2)",
    },
  };

  return (
    <div className="grow grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
      {cards.map((card, i) => {
        const colors = accentColors[card.accentColor || "primary"];
        return (
          <Card key={i} className={`flex-1 ${colors.bg}`}>
            <CardContent className="flex flex-col items-start gap-4 p-6">
              {/* Icon */}
              <div
                style={{
                  color: colors.color,
                  borderColor: colors.border,
                }}
              >
                <card.icon className="size-6" />
              </div>
              {/* Value & Label */}
              <div className="space-y-0.5">
                <div className="text-2xl font-bold text-foreground leading-none">
                  {card.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {card.label}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
