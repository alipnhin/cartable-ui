"use client";

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

function formatCurrency(amount: number): string {
  return formatNumber(amount) + " ریال";
}

export function PaymentOrdersTable() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-6 py-4 text-right text-xs font-semibold text-foreground">
                عنوان دستور پرداخت
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-foreground">
                شماره شبا
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-foreground">
                تعداد تراکنش
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-foreground">
                مبلغ کل
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-foreground">
                وضعیت
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-foreground">
                تاریخ ثبت
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-foreground">
                عملیات
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paymentOrders.map((order) => {
              const config = statusConfig[order.status];
              const StatusIcon = config.icon;

              return (
                <tr
                  key={order.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      {order.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs text-muted-foreground font-mono">
                      {order.iban}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-semibold text-foreground">
                      {formatNumber(order.transactionCount)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(order.totalAmount)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${config.color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {config.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      {order.date}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-sm font-medium text-primary hover:text-primary/80">
                      مشاهده
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
