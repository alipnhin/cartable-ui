import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type {
  TransactionProgressResponse,
  TransactionStatusSummary,
  PaymentTypeSummary,
} from "@/types/dashboard";
import { formatNumber } from "./utils";

/**
 * Export dashboard data to Excel
 */
export const exportDashboardToExcel = (
  data: TransactionProgressResponse,
  filters: { fromDate?: string; toDate?: string }
) => {
  // Create workbook
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Summary Stats
  const summaryData = [
    ["گزارش داشبورد تراکنش‌ها"],
    [""],
    ["از تاریخ:", filters.fromDate ? new Date(filters.fromDate).toLocaleDateString("fa-IR") : "-"],
    ["تا تاریخ:", filters.toDate ? new Date(filters.toDate).toLocaleDateString("fa-IR") : "-"],
    [""],
    ["آمار کلی"],
    ["کل تراکنش‌ها", data.totalTransactions],
    ["کل مبلغ (ریال)", data.totalAmount],
    [""],
    ["تراکنش‌های موفق", data.succeededTransactions],
    ["مبلغ موفق (ریال)", data.succeededAmount],
    ["درصد موفقیت", `${data.successPercent}%`],
    [""],
    ["در صف پردازش", data.pendingTransactions],
    ["مبلغ در صف (ریال)", data.pendingAmount],
    ["درصد در صف", `${data.pendingPercent}%`],
    [""],
    ["تراکنش‌های ناموفق", data.failedTransactions],
    ["مبلغ ناموفق (ریال)", data.failedAmount],
    ["درصد ناموفق", `${data.failedPercent}%`],
    [""],
    ["دستورات بسته شده", data.closedWithdrawalOrders],
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, "خلاصه");

  // Sheet 2: Status Summary
  const statusData = [
    ["جزئیات وضعیت تراکنش‌ها"],
    [""],
    ["وضعیت", "تعداد", "مبلغ (ریال)", "درصد"],
  ];

  data.transactionStatusSummary.forEach((item) => {
    statusData.push([
      item.statusTitle,
      item.transactionCount.toString(),
      item.totalAmount.toString(),
      `${item.percent}%`,
    ]);
  });

  const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
  XLSX.utils.book_append_sheet(workbook, statusSheet, "وضعیت تراکنش‌ها");

  // Sheet 3: Payment Type Summary
  const paymentData = [
    ["جزئیات انواع پرداخت"],
    [""],
    ["نوع پرداخت", "تعداد", "مبلغ (ریال)"],
  ];

  data.paymentTypeSummary.forEach((item) => {
    paymentData.push([
      item.paymentTypeTitle,
      item.count.toString(),
      item.totalAmount.toString(),
    ]);
  });

  const paymentSheet = XLSX.utils.aoa_to_sheet(paymentData);
  XLSX.utils.book_append_sheet(workbook, paymentSheet, "انواع پرداخت");

  // Generate file
  const fileName = `Dashboard_Report_${new Date().toISOString().split("T")[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);

  return fileName;
};

/**
 * Export dashboard data to PDF
 */
export const exportDashboardToPDF = (
  data: TransactionProgressResponse,
  filters: { fromDate?: string; toDate?: string }
) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set RTL support (requires a Persian font)
  // Note: For proper Persian support, you need to add a Persian font
  doc.setR2L(true);

  let yPosition = 20;

  // Title
  doc.setFontSize(18);
  doc.text("گزارش داشبورد تراکنش‌ها", 105, yPosition, { align: "center" });
  yPosition += 15;

  // Date Range
  doc.setFontSize(10);
  const fromDateStr = filters.fromDate ? new Date(filters.fromDate).toLocaleDateString("fa-IR") : "-";
  const toDateStr = filters.toDate ? new Date(filters.toDate).toLocaleDateString("fa-IR") : "-";
  doc.text(
    `از تاریخ: ${fromDateStr} تا ${toDateStr}`,
    105,
    yPosition,
    { align: "center" }
  );
  yPosition += 15;

  // Summary Stats Table
  autoTable(doc, {
    startY: yPosition,
    head: [["شاخص", "مقدار"]],
    body: [
      ["کل تراکنش‌ها", formatNumber(data.totalTransactions)],
      ["کل مبلغ (ریال)", formatNumber(data.totalAmount)],
      ["تراکنش‌های موفق", formatNumber(data.succeededTransactions)],
      ["مبلغ موفق (ریال)", formatNumber(data.succeededAmount)],
      ["درصد موفقیت", `${data.successPercent}%`],
      ["در صف پردازش", formatNumber(data.pendingTransactions)],
      ["مبلغ در صف (ریال)", formatNumber(data.pendingAmount)],
      ["تراکنش‌های ناموفق", formatNumber(data.failedTransactions)],
      ["مبلغ ناموفق (ریال)", formatNumber(data.failedAmount)],
    ],
    theme: "striped",
    headStyles: { fillColor: [14, 145, 178], halign: "right" },
    bodyStyles: { halign: "right" },
    styles: { font: "helvetica", fontSize: 10 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Transaction Status Details
  doc.setFontSize(14);
  doc.text("جزئیات وضعیت تراکنش‌ها", 105, yPosition, { align: "center" });
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [["وضعیت", "تعداد", "مبلغ (ریال)", "درصد"]],
    body: data.transactionStatusSummary.map((item) => [
      item.statusTitle,
      formatNumber(item.transactionCount),
      formatNumber(item.totalAmount),
      `${item.percent}%`,
    ]),
    theme: "grid",
    headStyles: { fillColor: [14, 145, 178], halign: "right" },
    bodyStyles: { halign: "right" },
    styles: { font: "helvetica", fontSize: 9 },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Payment Type Details
  doc.setFontSize(14);
  doc.text("جزئیات انواع پرداخت", 105, yPosition, { align: "center" });
  yPosition += 8;

  autoTable(doc, {
    startY: yPosition,
    head: [["نوع پرداخت", "تعداد", "مبلغ (ریال)"]],
    body: data.paymentTypeSummary.map((item) => [
      item.paymentTypeTitle,
      formatNumber(item.count),
      formatNumber(item.totalAmount),
    ]),
    theme: "grid",
    headStyles: { fillColor: [14, 145, 178], halign: "right" },
    bodyStyles: { halign: "right" },
    styles: { font: "helvetica", fontSize: 9 },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(
      `صفحه ${i} از ${pageCount}`,
      105,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  // Save file
  const fileName = `Dashboard_Report_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(fileName);

  return fileName;
};
