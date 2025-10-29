/**
 * Order Types
 * انواع مربوط به دستورات پرداخت
 */

import { Account } from "./account";
import { ChangeHistoryEntry } from "./common";
import { Approver, SignatureProgress, ApprovalSummary } from "./signer";
import { Transaction } from "./transaction";

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
  status: OrderStatus;
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

export enum OrderStatus {
  Draft = "draft", // پیش‌نویس
  WaitingForOwnersApproval = "waiting_for_owners_approval", // در انتظار تأیید صاحبان امضا
  OwnersApproved = "owners_approved", // تأیید شده توسط صاحبان امضا
  SubmittedToBank = "submitted_to_bank", // ارسال شده به بانک
  Succeeded = "succeeded", // انجام شده
  PartiallySucceeded = "partially_succeeded", // انجام شده با خطا
  Rejected = "rejected", // عدم تأیید
  BankRejected = "bank_rejected", // رد شده توسط بانک
  Canceled = "canceled", // لغو شده
  Expired = "expired", // منقضی شده
}

export interface PaymentOrderDetail extends PaymentOrder {
  account: Account;
  transactions: Transaction[];
  approvers: Approver[];
  signatureProgress: SignatureProgress;
  approvalSummary: ApprovalSummary;
  changeHistory: ChangeHistoryEntry[];
  canApprove: boolean; // آیا کاربر فعلی می‌تواند تأیید کند؟
  canReject: boolean; // آیا کاربر فعلی می‌تواند رد کند؟
  canEdit: boolean; // آیا قابل ویرایش است؟
  canCancel: boolean; // آیا قابل لغو است؟
  canInquiry: boolean; // آیا می‌توان استعلام زد؟
}

// Order Status Info for UI
export interface OrderStatusInfo {
  status: OrderStatus;
  label_fa: string;
  label_en: string;
  color: string;
  icon?: string;
  description_fa?: string;
}

export const ORDER_STATUSES: OrderStatusInfo[] = [
  {
    status: OrderStatus.Draft,
    label_fa: "پیش‌نویس",
    label_en: "Draft",
    color: "gray",
    description_fa: "دستور در حال تکمیل است",
  },
  {
    status: OrderStatus.WaitingForOwnersApproval,
    label_fa: "در انتظار تأیید",
    label_en: "Waiting for Approval",
    color: "yellow",
    description_fa: "در انتظار تأیید صاحبان امضا",
  },
  {
    status: OrderStatus.OwnersApproved,
    label_fa: "تأیید شده",
    label_en: "Approved",
    color: "blue",
    description_fa: "تأیید شده توسط صاحبان امضا",
  },
  {
    status: OrderStatus.SubmittedToBank,
    label_fa: "ارسال شده به بانک",
    label_en: "Submitted to Bank",
    color: "purple",
    description_fa: "ارسال شده به سیستم بانک",
  },
  {
    status: OrderStatus.Succeeded,
    label_fa: "انجام شده",
    label_en: "Succeeded",
    color: "green",
    description_fa: "تمام تراکنش‌ها با موفقیت انجام شد",
  },
  {
    status: OrderStatus.PartiallySucceeded,
    label_fa: "انجام شده با خطا",
    label_en: "Partially Succeeded",
    color: "orange",
    description_fa: "برخی تراکنش‌ها با خطا مواجه شدند",
  },
  {
    status: OrderStatus.Rejected,
    label_fa: "عدم تأیید",
    label_en: "Rejected",
    color: "red",
    description_fa: "رد شده توسط تأییدکنندگان",
  },
  {
    status: OrderStatus.BankRejected,
    label_fa: "رد شده توسط بانک",
    label_en: "Bank Rejected",
    color: "red",
    description_fa: "رد شده توسط سیستم بانک",
  },
  {
    status: OrderStatus.Canceled,
    label_fa: "لغو شده",
    label_en: "Canceled",
    color: "gray",
    description_fa: "لغو شده توسط کاربر",
  },
  {
    status: OrderStatus.Expired,
    label_fa: "منقضی شده",
    label_en: "Expired",
    color: "gray",
    description_fa: "زمان دستور به پایان رسیده",
  },
];

// Filter
export interface OrderFilterParams {
  accountGroups?: string[];
  statuses?: OrderStatus[];
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
