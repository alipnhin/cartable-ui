/**
 * Order Types
 * انواع مربوط به دستورات پرداخت
 */

import { Account } from "./account";
import { ChangeHistoryEntry } from "./common";
import { OrderApprover } from "./signer";
import { Transaction } from "./transaction";
import { PaymentStatusEnum } from "./api";

export interface PaymentOrder {
  id: string;
  orderId: string; // شماره درخواست (نمایشی)
  title: string;
  accountId: string;
  accountNumber: string;
  accountSheba: string;
  bankName: string;
  numberOfTransactions: number;
  totalAmount: number;
  currency: string;
  status: PaymentStatusEnum;
  statusDescription?: string;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  submittedToBankAt?: string;
  processedAt?: string;
  description?: string;

  // فیلدهای اضافی برای UI (computed properties)
  orderNumber?: string; // alias for orderId
  accountTitle?: string; // alias for bankName or combination
  totalTransactions?: number; // alias for numberOfTransactions
  createdDate?: string; // alias for createdAt
  createdDateTime?: string; // alias for createdAt
  paymentType?: number; // نوع پرداخت (0: داخلی، 1: پایا، 2: ساتنا)
}

/**
 * Re-export PaymentStatusEnum as OrderStatus for backward compatibility
 * استفاده مستقیم از PaymentStatusEnum که تمام مقادیر را از بک‌اند دارد
 */
export { PaymentStatusEnum as OrderStatus } from "./api";

export interface PaymentOrderDetail extends PaymentOrder {
  account: Account;
  transactions: Transaction[];
  approvers: OrderApprover[];
  changeHistory: ChangeHistoryEntry[];
  canApprove: boolean; // آیا کاربر فعلی می‌تواند تأیید کند؟
  canReject: boolean; // آیا کاربر فعلی می‌تواند رد کند؟
  canEdit: boolean; // آیا قابل ویرایش است؟
  canCancel: boolean; // آیا قابل لغو است؟
  canInquiry: boolean; // آیا می‌توان استعلام زد؟
}

/**
 * REMOVED: OrderStatusInfo and ORDER_STATUSES
 * این آرایه حذف شده است. از تابع getPaymentStatusBadge در status-badge.tsx
 * و سیستم ترجمه i18n برای نمایش برچسب‌ها استفاده کنید.
 */

// Filter
export interface OrderFilterParams {
  accountGroups?: string[];
  statuses?: PaymentStatusEnum[];
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

// Bulk Actions
export interface BulkActionRequest {
  orderIds: string[];
  action: BulkAction;
  comment?: string;
}

export type BulkAction = "approve" | "reject" | "cancel";

export interface BulkActionResponse {
  success: boolean;
  successCount: number;
  failedCount: number;
  results: Array<{
    orderId: string;
    success: boolean;
    message?: string;
  }>;
}

// Order Statistics
export interface OrderStatistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  submitted: number;
  succeeded: number;
  totalAmount: number;
}
