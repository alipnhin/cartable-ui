"use client";

import { Wallet } from "lucide-react";
import { CheckCircle2, Clock, XCircle, ArrowUpRight } from "lucide-react";

const paymentOrders = [
  {
    id: 1,
    title: "پرداخت حقوق کارکنان - مهر 1403",
    iban: "IR120123456789012345678901",
    transactionCount: 1250,
    totalAmount: 12500000000,
    status: "completed" as const,
    date: "1403/07/15",
  },
  {
    id: 2,
    title: "پرداخت به تامین کنندگان - دسته اول",
    iban: "IR980123456789012345678902",
    transactionCount: 450,
    totalAmount: 8750000000,
    status: "pending" as const,
    date: "1403/07/16",
  },
  {
    id: 3,
    title: "تسویه حساب پیمانکاران - پروژه A",
    iban: "IR450123456789012345678903",
    transactionCount: 85,
    totalAmount: 3200000000,
    status: "processing" as const,
    date: "1403/07/17",
  },
  {
    id: 4,
    title: "پرداخت پاداش عملکرد - فصل دوم",
    iban: "IR120123456789012345678904",
    transactionCount: 320,
    totalAmount: 1850000000,
    status: "rejected" as const,
    date: "1403/07/14",
  },
];

type Status = "completed" | "pending" | "processing" | "rejected";

const statusConfig = {
  completed: {
    label: "تکمیل شده",
    color:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    icon: CheckCircle2,
  },
  pending: {
    label: "در انتظار",
    color:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    icon: Clock,
  },
  processing: {
    label: "در حال پردازش",
    color:
      "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    icon: ArrowUpRight,
  },
  rejected: {
    label: "رد شده",
    color:
      "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    icon: XCircle,
  },
};

function formatNumber(num: number): string {
  return new Intl.NumberFormat("fa-IR").format(num);
}

export function PaymentOrdersCards() {
  return (
    <div className="space-y-3 pb-20">
      {paymentOrders.map((order) => {
        const config = statusConfig[order.status];
        const StatusIcon = config.icon;

        return (
          <div
            key={order.id}
            className="bg-card/90 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-border/50 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground flex-1 ml-2">
                {order.title}
              </h3>
              <span
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${config.color}`}
              >
                <StatusIcon className="w-3.5 h-3.5" />
                {config.label}
              </span>
            </div>

            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Wallet className="w-4 h-4" />
              <span className="font-mono">
                {order.iban.slice(0, 8)}...{order.iban.slice(-4)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-muted/50 rounded-xl">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  تعداد تراکنش
                </p>
                <p className="text-sm font-bold text-foreground">
                  {formatNumber(order.transactionCount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">مبلغ کل</p>
                <p className="text-sm font-bold text-foreground">
                  {formatNumber(order.totalAmount / 1000000)} میلیون
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{order.date}</span>
              <button className="text-primary font-medium">
                مشاهده جزئیات ←
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
