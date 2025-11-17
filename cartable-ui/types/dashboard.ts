// Dashboard transaction progress types
export interface TransactionStatusSummary {
  status: number;
  statusTitle: string;
  transactionCount: number;
  totalAmount: number;
  percent: number;
}

export interface PaymentTypeSummary {
  paymentType: number;
  paymentTypeTitle: string;
  count: number;
  totalAmount: number;
}

export interface TransactionProgressResponse {
  totalTransactions: number;
  totalAmount: number;
  succeededTransactions: number;
  succeededAmount: number;
  successPercent: number;
  pendingTransactions: number;
  pendingAmount: number;
  pendingPercent: number;
  failedTransactions: number;
  failedAmount: number;
  failedPercent: number;
  closedWithdrawalOrders: number;
  transactionStatusSummary: TransactionStatusSummary[];
  paymentTypeSummary: PaymentTypeSummary[];
}

export interface DashboardFilterParams {
  bankGatewayId?: string;
  fromDate?: string; // ISO date string
  toDate?: string; // ISO date string
}
