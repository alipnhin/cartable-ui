import ExcelJS from "exceljs";
import type { TransactionProgressResponse } from "@/types/dashboard";
import { formatNumber } from "./utils";

/**
 * Export dashboard data to Excel with professional styling using ExcelJS
 * این تابع گزارش داشبورد را با قالب‌بندی حرفه‌ای به Excel export می‌کند
 */
export const exportDashboardToExcel = async (
  data: TransactionProgressResponse,
  filters: { fromDate?: string; toDate?: string }
) => {
  // Create new workbook
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Cartable UI";
  workbook.created = new Date();
  workbook.modified = new Date();
  workbook.properties.date1904 = false;

  // Format dates
  const fromDateStr = filters.fromDate
    ? new Date(filters.fromDate).toLocaleDateString("fa-IR")
    : "-";
  const toDateStr = filters.toDate
    ? new Date(filters.toDate).toLocaleDateString("fa-IR")
    : "-";

  // ===== Sheet 1: Summary Stats =====
  const summarySheet = workbook.addWorksheet("خلاصه", {
    properties: { rightToLeft: true },
    views: [{ rightToLeft: true }],
  });

  // Set column widths
  summarySheet.columns = [
    { width: 25 },
    { width: 18 },
    { width: 20 },
    { width: 12 },
  ];

  // Title row
  const titleRow = summarySheet.addRow([
    "گزارش داشبورد تراکنش‌ها",
    "",
    "",
    "",
  ]);
  summarySheet.mergeCells("A1:D1");
  titleRow.font = { size: 16, bold: true };
  titleRow.alignment = { horizontal: "center", vertical: "middle" };
  titleRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF27AE60" },
  };
  titleRow.font = { ...titleRow.font, color: { argb: "FFFFFFFF" } };
  titleRow.height = 30;

  // Empty row
  summarySheet.addRow([]);

  // Date range row
  const dateRow = summarySheet.addRow([
    `از تاریخ: ${fromDateStr}`,
    "",
    `تا تاریخ: ${toDateStr}`,
    "",
  ]);
  dateRow.font = { bold: true };

  // Empty rows
  summarySheet.addRow([]);
  summarySheet.addRow([]);

  // Header row
  const headerRow = summarySheet.addRow([
    "شاخص",
    "تعداد",
    "مبلغ (ریال)",
    "درصد",
  ]);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE8F5E9" },
  };
  headerRow.alignment = { horizontal: "center", vertical: "middle" };
  headerRow.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // Data rows
  const summaryData = [
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
  ];

  summaryData.forEach((rowData) => {
    const row = summarySheet.addRow(rowData);
    row.alignment = { horizontal: "center", vertical: "middle" };
    row.border = {
      top: { style: "thin", color: { argb: "FFE0E0E0" } },
      bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
      left: { style: "thin", color: { argb: "FFE0E0E0" } },
      right: { style: "thin", color: { argb: "FFE0E0E0" } },
    };
  });

  // Empty row
  summarySheet.addRow([]);

  // Closed orders row
  const closedRow = summarySheet.addRow([
    "دستورات بسته شده",
    formatNumber(data.closedWithdrawalOrders),
    "",
    "",
  ]);
  closedRow.font = { bold: true };

  // ===== Sheet 2: Status Summary =====
  const statusSheet = workbook.addWorksheet("وضعیت تراکنش‌ها", {
    properties: { rightToLeft: true },
    views: [{ rightToLeft: true }],
  });

  statusSheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 20 },
    { width: 12 },
  ];

  // Title row
  const statusTitleRow = statusSheet.addRow([
    "جزئیات وضعیت تراکنش‌ها",
    "",
    "",
    "",
  ]);
  statusSheet.mergeCells("A1:D1");
  statusTitleRow.font = { size: 16, bold: true };
  statusTitleRow.alignment = { horizontal: "center", vertical: "middle" };
  statusTitleRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF3498DB" },
  };
  statusTitleRow.font = { ...statusTitleRow.font, color: { argb: "FFFFFFFF" } };
  statusTitleRow.height = 30;

  // Empty row
  statusSheet.addRow([]);

  // Header row
  const statusHeaderRow = statusSheet.addRow([
    "وضعیت",
    "تعداد",
    "مبلغ (ریال)",
    "درصد",
  ]);
  statusHeaderRow.font = { bold: true };
  statusHeaderRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE3F2FD" },
  };
  statusHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
  statusHeaderRow.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // Data rows
  data.transactionStatusSummary.forEach((item) => {
    const row = statusSheet.addRow([
      item.statusTitle,
      formatNumber(item.transactionCount),
      formatNumber(item.totalAmount),
      `${item.percent}%`,
    ]);
    row.alignment = { horizontal: "center", vertical: "middle" };
    row.border = {
      top: { style: "thin", color: { argb: "FFE0E0E0" } },
      bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
      left: { style: "thin", color: { argb: "FFE0E0E0" } },
      right: { style: "thin", color: { argb: "FFE0E0E0" } },
    };
  });

  // Empty row
  statusSheet.addRow([]);

  // Total row
  const statusTotalRow = statusSheet.addRow([
    "مجموع",
    formatNumber(data.totalTransactions),
    formatNumber(data.totalAmount),
    "100%",
  ]);
  statusTotalRow.font = { bold: true };
  statusTotalRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF1F8E9" },
  };
  statusTotalRow.alignment = { horizontal: "center", vertical: "middle" };

  // ===== Sheet 3: Payment Type Summary =====
  const paymentSheet = workbook.addWorksheet("انواع پرداخت", {
    properties: { rightToLeft: true },
    views: [{ rightToLeft: true }],
  });

  paymentSheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 20 },
    { width: 15 },
  ];

  // Title row
  const paymentTitleRow = paymentSheet.addRow([
    "جزئیات انواع پرداخت",
    "",
    "",
    "",
  ]);
  paymentSheet.mergeCells("A1:D1");
  paymentTitleRow.font = { size: 16, bold: true };
  paymentTitleRow.alignment = { horizontal: "center", vertical: "middle" };
  paymentTitleRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF9B59B6" },
  };
  paymentTitleRow.font = {
    ...paymentTitleRow.font,
    color: { argb: "FFFFFFFF" },
  };
  paymentTitleRow.height = 30;

  // Empty row
  paymentSheet.addRow([]);

  // Header row
  const paymentHeaderRow = paymentSheet.addRow([
    "نوع پرداخت",
    "تعداد",
    "مبلغ (ریال)",
    "درصد از کل",
  ]);
  paymentHeaderRow.font = { bold: true };
  paymentHeaderRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF3E5F5" },
  };
  paymentHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
  paymentHeaderRow.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // Calculate total for percentage
  const totalCount = data.paymentTypeSummary.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // Data rows
  data.paymentTypeSummary.forEach((item) => {
    const percent =
      totalCount > 0 ? Math.round((item.count / totalCount) * 100) : 0;
    const row = paymentSheet.addRow([
      item.paymentTypeTitle,
      formatNumber(item.count),
      formatNumber(item.totalAmount),
      `${percent}%`,
    ]);
    row.alignment = { horizontal: "center", vertical: "middle" };
    row.border = {
      top: { style: "thin", color: { argb: "FFE0E0E0" } },
      bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
      left: { style: "thin", color: { argb: "FFE0E0E0" } },
      right: { style: "thin", color: { argb: "FFE0E0E0" } },
    };
  });

  // Empty row
  paymentSheet.addRow([]);

  // Total row
  const totalPaymentAmount = data.paymentTypeSummary.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  );
  const paymentTotalRow = paymentSheet.addRow([
    "مجموع",
    formatNumber(totalCount),
    formatNumber(totalPaymentAmount),
    "100%",
  ]);
  paymentTotalRow.font = { bold: true };
  paymentTotalRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF1F8E9" },
  };
  paymentTotalRow.alignment = { horizontal: "center", vertical: "middle" };

  // ===== Sheet 4: Key Metrics =====
  const metricsSheet = workbook.addWorksheet("شاخص‌های کلیدی", {
    properties: { rightToLeft: true },
    views: [{ rightToLeft: true }],
  });

  metricsSheet.columns = [{ width: 25 }, { width: 20 }, { width: 30 }];

  // Title row
  const metricsTitleRow = metricsSheet.addRow([
    "شاخص‌های کلیدی",
    "",
    "",
  ]);
  metricsSheet.mergeCells("A1:C1");
  metricsTitleRow.font = { size: 16, bold: true };
  metricsTitleRow.alignment = { horizontal: "center", vertical: "middle" };
  metricsTitleRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFE67E22" },
  };
  metricsTitleRow.font = {
    ...metricsTitleRow.font,
    color: { argb: "FFFFFFFF" },
  };
  metricsTitleRow.height = 30;

  // Empty row
  metricsSheet.addRow([]);

  // Header row
  const metricsHeaderRow = metricsSheet.addRow([
    "شاخص",
    "مقدار",
    "توضیحات",
  ]);
  metricsHeaderRow.font = { bold: true };
  metricsHeaderRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFEAA7" },
  };
  metricsHeaderRow.alignment = { horizontal: "center", vertical: "middle" };
  metricsHeaderRow.border = {
    top: { style: "thin" },
    bottom: { style: "thin" },
    left: { style: "thin" },
    right: { style: "thin" },
  };

  // Metrics data
  const metricsData = [
    [
      "نرخ موفقیت",
      `${data.successPercent.toFixed(1)}%`,
      "درصد تراکنش‌های موفق",
    ],
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
  ];

  metricsData.forEach((rowData) => {
    const row = metricsSheet.addRow(rowData);
    row.alignment = { horizontal: "center", vertical: "middle" };
    row.border = {
      top: { style: "thin", color: { argb: "FFE0E0E0" } },
      bottom: { style: "thin", color: { argb: "FFE0E0E0" } },
      left: { style: "thin", color: { argb: "FFE0E0E0" } },
      right: { style: "thin", color: { argb: "FFE0E0E0" } },
    };
  });

  // Empty row
  metricsSheet.addRow([]);

  // System status section title
  const statusSectionRow = metricsSheet.addRow(["وضعیت سیستم", "", ""]);
  metricsSheet.mergeCells(`A${statusSectionRow.number}:C${statusSectionRow.number}`);
  statusSectionRow.font = { size: 14, bold: true };
  statusSectionRow.alignment = { horizontal: "center", vertical: "middle" };
  statusSectionRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFFFEAA7" },
  };

  // Performance status
  const performanceRow = metricsSheet.addRow([
    "عملکرد",
    data.successPercent >= 70
      ? "عالی"
      : data.successPercent >= 50
      ? "متوسط"
      : "نیاز به بررسی",
    `بر اساس ${formatNumber(data.totalTransactions)} تراکنش`,
  ]);
  performanceRow.alignment = { horizontal: "center", vertical: "middle" };

  // Generate Excel file and download
  const buffer = await workbook.xlsx.writeBuffer();
  const fileName = `Dashboard_Report_${new Date().toISOString().split("T")[0]}.xlsx`;

  // Create blob and download
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  return fileName;
};
