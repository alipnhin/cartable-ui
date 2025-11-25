import apiClient from "@/lib/api-client";

// API Types matching the response structure
export interface TransactionItem {
  id: string;
  destinationAccountOwner: string;
  nationalCode: string | null;
  destinationIban: string;
  accountNumber: string;
  bankName: string;
  accountCode: string | null;
  orderId: string;
  amount: number;
  status: string; // "WaitForExecution", "Success", "Failed", etc.
  paymentType: string; // "Paya", "Satna", "Internal"
  createdDateTime: string;
  updatedDateTime: string | null;
  transferDateTime: string | null;
  sendToBankDateTime: string | null;
}

// Helper function to format amount
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("fa-IR").format(amount) + " ریال";
};

// Helper function to format date to Persian
export const formatDateToPersian = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// این mapping ها حذف شدند و از badge function ها در components/ui/status-badge.tsx استفاده می‌شود

export interface TransactionsResponse {
  items: TransactionItem[];
  pageNumber: number;
  pageSize: number;
  totalPageCount: number;
  totalItemCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstItemOnPage: number;
  lastItemOnPage: number;
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
  accountGroupId?: string;
  paymentType?: string; // PaymentMethodEnum values
  status?: string;
  fromDate?: string;
  toDate?: string;
  transferFromDate?: string;
  transferToDate?: string;
}

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
