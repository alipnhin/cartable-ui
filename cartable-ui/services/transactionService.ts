import apiClient from "@/lib/api-client";

// API Types matching the response structure
export interface TransactionItem {
  id: string;
  destinationAccountOwner: string;
  nationalCode: string | null;
  destinationIban: string;
  accountNumber: string;
  bankName: string;
  accountCode: string;
  orderId: string;
  amount: number;
  amountShow: string;
  status: number;
  statusShow: string;
  statusClass: string;
  paymentType: number;
  paymentTypeShow: string;
  paymentTypeClass: string;
  createdDateTime: string;
  createdDateTimeFa: string;
  updatedDateTime: string | null;
  updatedDateTimeFa: string;
  transferDateTime: string | null;
  transferDateTimeFa: string;
  sendToBankDateTime: string | null;
  sendToBankDateFa: string;
}

export interface TransactionsResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: TransactionItem[];
}

export interface TransactionsRequest {
  pageNumber: number;
  pageSize: number;
  orderBy?: string;
  nationalCode?: string;
  destinationIban?: string;
  accountNumber?: string;
  orderId?: string;
  bankGatewayId?: string;
  paymentType?: number;
  status?: number;
  fromDate?: string;
  toDate?: string;
  transferFromDate?: string;
  transferToDate?: string;
}

// Status mapping
export const TransactionStatusMap: Record<
  number,
  { label: string; class: string }
> = {
  1: { label: "ثبت شده", class: "secondary" },
  2: { label: "در انتظار اجرا", class: "info" },
  3: { label: "تراکنش انجام شده", class: "success" },
  4: { label: "رد شده توسط بانک", class: "danger" },
  5: { label: "در انتظار بانک", class: "warning" },
  6: { label: "بازگشت داده شده", class: "secondary" },
  7: { label: "لغو شده", class: "warning" },
  8: { label: "منقضی شده", class: "secondary" },
};

// Payment type mapping
export const PaymentTypeMap: Record<number, { label: string; class: string }> =
  {
    0: { label: "داخلی", class: "success" },
    1: { label: "پایا", class: "info" },
    2: { label: "ساتنا", class: "primary" },
    3: { label: "کارت به کارت", class: "warning" },
  };

/**
 * Get paginated list of transactions
 */
export const getTransactionsList = async (
  request: TransactionsRequest,
  accessToken: string
): Promise<TransactionsResponse> => {
  const response = await apiClient.post<TransactionsResponse>(
    "/v1-Cartable/Withdrawal/withdrawal-transactions/paged",
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
};

/**
 * Export transactions to Excel
 * Returns a blob for file download
 */
export const exportTransactionsToExcel = async (
  request: TransactionsRequest,
  accessToken: string
): Promise<Blob> => {
  const response = await apiClient.post(
    "/v1-Cartable/Withdrawal/withdrawal-transactions/export",
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "blob",
    }
  );
  return response.data;
};

/**
 * Helper to get default date range (last 7 days)
 */
export const getDefaultDateRange = (): { fromDate: string; toDate: string } => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 7);

  return {
    fromDate: fromDate.toISOString().split("T")[0],
    toDate: toDate.toISOString().split("T")[0],
  };
};

/**
 * Helper to download blob as file
 */
export const downloadBlobAsFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
