import * as XLSX from "xlsx";
import type {
  TransactionProgressResponse,
} from "@/types/dashboard";
import { formatNumber } from "./utils";

/**
 * Export dashboard data to Excel with professional styling
 */
export const exportDashboardToExcel = (
  data: TransactionProgressResponse,
  filters: { fromDate?: string; toDate?: string }
) => {
  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Format dates
  const fromDateStr = filters.fromDate
    ? new Date(filters.fromDate).toLocaleDateString("fa-IR")
    : "-";
  const toDateStr = filters.toDate
    ? new Date(filters.toDate).toLocaleDateString("fa-IR")
    : "-";

  // Sheet 1: Summary Stats with professional layout
  const summaryData = [
    ["گزارش داشبورد تراکنش‌ها", "", "", ""],
    ["", "", "", ""],
    [`از تاریخ: ${fromDateStr}`, "", `تا تاریخ: ${toDateStr}`, ""],
    ["", "", "", ""],
    ["", "", "", ""],
    ["شاخص", "تعداد", "مبلغ (ریال)", "درصد"],
    [
      "کل تراکنش‌ها",
      formatNumber(data.totalTransactions),
      formatNumber(data.totalAmount),
      "100%",
    ],
    [
      "تراکنش‌های موفق",
      formatNumber(data.succeededTransactions),
      formatNumber(data.succeededAmount),
      `${data.successPercent}%`,
    ],
    [
      "در صف پردازش",
      formatNumber(data.pendingTransactions),
      formatNumber(data.pendingAmount),
      `${data.pendingPercent}%`,
    ],
    [
      "تراکنش‌های ناموفق",
      formatNumber(data.failedTransactions),
      formatNumber(data.failedAmount),
      `${data.failedPercent}%`,
    ],
    ["", "", "", ""],
    [
      "دستورات بسته شده",
      formatNumber(data.closedWithdrawalOrders),
      "",
      "",
    ],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

  // Set column widths for summary sheet
  summarySheet["!cols"] = [
    { wch: 25 }, // Column A
    { wch: 18 }, // Column B
    { wch: 20 }, // Column C
    { wch: 12 }, // Column D
  ];

  // Merge cells for title
  summarySheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title row
  ];

  XLSX.utils.book_append_sheet(workbook, summarySheet, "خلاصه");

  // Sheet 2: Status Summary with detailed breakdown
  const statusData = [
    ["جزئیات وضعیت تراکنش‌ها", "", "", ""],
    ["", "", "", ""],
    ["وضعیت", "تعداد", "مبلغ (ریال)", "درصد"],
  ];

  data.transactionStatusSummary.forEach((item) => {
    statusData.push([
      item.statusTitle,
      formatNumber(item.transactionCount),
      formatNumber(item.totalAmount),
      `${item.percent}%`,
    ]);
  });

  // Add total row
  statusData.push(["", "", "", ""]);
  statusData.push([
    "مجموع",
    formatNumber(data.totalTransactions),
    formatNumber(data.totalAmount),
    "100%",
  ]);

  const statusSheet = XLSX.utils.aoa_to_sheet(statusData);

  // Set column widths for status sheet
  statusSheet["!cols"] = [
    { wch: 25 }, // Column A
    { wch: 15 }, // Column B
    { wch: 20 }, // Column C
    { wch: 12 }, // Column D
  ];

  // Merge cells for title
  statusSheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title row
  ];

  XLSX.utils.book_append_sheet(workbook, statusSheet, "وضعیت تراکنش‌ها");

  // Sheet 3: Payment Type Summary
  const paymentData = [
    ["جزئیات انواع پرداخت", "", "", ""],
    ["", "", "", ""],
    ["نوع پرداخت", "تعداد", "مبلغ (ریال)", "درصد از کل"],
  ];

  // Calculate total for percentage
  const totalCount = data.paymentTypeSummary.reduce(
    (sum, item) => sum + item.count,
    0
  );

  data.paymentTypeSummary.forEach((item) => {
    const percent =
      totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
    paymentData.push([
      item.paymentTypeTitle,
      formatNumber(item.count),
      formatNumber(item.totalAmount),
      `${percent}%`,
    ]);
  });

  // Add total row
  const totalPaymentAmount = data.paymentTypeSummary.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  paymentData.push(["", "", "", ""]);
  paymentData.push([
    "مجموع",
    formatNumber(totalCount),
    formatNumber(totalPaymentAmount),
    "100%",
  ]);

  const paymentSheet = XLSX.utils.aoa_to_sheet(paymentData);

  // Set column widths for payment sheet
  paymentSheet["!cols"] = [
    { wch: 25 }, // Column A
    { wch: 15 }, // Column B
    { wch: 20 }, // Column C
    { wch: 15 }, // Column D
  ];

  // Merge cells for title
  paymentSheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Title row
  ];

  XLSX.utils.book_append_sheet(workbook, paymentSheet, "انواع پرداخت");

  // Sheet 4: Key Metrics
  const metricsData = [
    ["شاخص‌های کلیدی", "", ""],
    ["", "", ""],
    ["شاخص", "مقدار", "توضیحات"],
    ["نرخ موفقیت", `${data.successPercent.toFixed(1)}%`, "درصد تراکنش‌های موفق"],
    [
      "میانگین مبلغ تراکنش",
      formatNumber(
        data.totalTransactions > 0
          ? Math.round(data.totalAmount / data.totalTransactions)
          : 0
      ) + " ریال",
      "میانگین کل تراکنش‌ها",
    ],
    [
      "میانگین مبلغ موفق",
      formatNumber(
        data.succeededTransactions > 0
          ? Math.round(data.succeededAmount / data.succeededTransactions)
          : 0
      ) + " ریال",
      "میانگین تراکنش‌های موفق",
    ],
    [
      "دستورات بسته شده",
      formatNumber(data.closedWithdrawalOrders),
      "تعداد دستورات پرداخت",
    ],
    ["", "", ""],
    ["وضعیت سیستم", "", ""],
    [
      "عملکرد",
      data.successPercent >= 70
        ? "عالی"
        : data.successPercent >= 50
        ? "متوسط"
        : "نیاز به بررسی",
      `بر اساس ${formatNumber(data.totalTransactions)} تراکنش`,
    ],
  ];

  const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData);

  // Set column widths for metrics sheet
  metricsSheet["!cols"] = [
    { wch: 25 }, // Column A
    { wch: 20 }, // Column B
    { wch: 30 }, // Column C
  ];

  // Merge cells for titles
  metricsSheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }, // Title row
    { s: { r: 8, c: 0 }, e: { r: 8, c: 2 } }, // System status title
  ];

  XLSX.utils.book_append_sheet(workbook, metricsSheet, "شاخص‌های کلیدی");

  // Generate file
  const fileName = `Dashboard_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);

  return fileName;
};
