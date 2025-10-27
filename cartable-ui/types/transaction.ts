/**
 * Transaction Types
 * انواع مربوط به تراکنش‌های پرداخت
 */

import { ChangeHistoryEntry } from "./common";

export interface Transaction {
  id: string;
  orderId: string; // شناسه دستور پرداخت
  sequenceNumber: number; // شماره ردیف در دستور
  amount: number;
  currency: string;
  beneficiaryName: string; // نام ذینفع
  beneficiaryAccountNumber: string;
  beneficiarySheba: string;
  beneficiaryBankName: string;
  description?: string;
  trackingCode?: string; // کد پیگیری بانک
  status: TransactionStatus;
  statusDescription?: string;
  createdAt: string;
  submittedToBankAt?: string;
  processedAt?: string;
  errorCode?: string;
  errorMessage?: string;
}

export enum TransactionStatus {
  Draft = "draft", // پیش‌نویس
  WaitingForApproval = "waiting_for_approval", // در انتظار تأیید
  Approved = "approved", // تأیید شده
  SubmittedToBank = "submitted_to_bank", // ارسال شده به بانک
  Succeeded = "succeeded", // موفق
  Failed = "failed", // ناموفق
  Rejected = "rejected", // رد شده
  Canceled = "canceled", // لغو شده
}

export interface TransactionDetail extends Transaction {
  changeHistory: ChangeHistoryEntry[];
  bankResponse?: BankResponse;
}

export interface BankResponse {
  responseCode: string;
  responseMessage: string;
  timestamp: string;
  referenceNumber?: string;
  additionalInfo?: Record<string, any>;
}

// Transaction Status Info for UI
export interface TransactionStatusInfo {
  status: TransactionStatus;
  label_fa: string;
  label_en: string;
  color: string;
  icon?: string;
}

export const TRANSACTION_STATUSES: TransactionStatusInfo[] = [
  {
    status: TransactionStatus.Draft,
    label_fa: "پیش‌نویس",
    label_en: "Draft",
    color: "gray",
  },
  {
    status: TransactionStatus.WaitingForApproval,
    label_fa: "در انتظار تأیید",
    label_en: "Waiting for Approval",
    color: "yellow",
  },
  {
    status: TransactionStatus.Approved,
    label_fa: "تأیید شده",
    label_en: "Approved",
    color: "blue",
  },
  {
    status: TransactionStatus.SubmittedToBank,
    label_fa: "ارسال شده به بانک",
    label_en: "Submitted to Bank",
    color: "purple",
  },
  {
    status: TransactionStatus.Succeeded,
    label_fa: "موفق",
    label_en: "Succeeded",
    color: "green",
  },
  {
    status: TransactionStatus.Failed,
    label_fa: "ناموفق",
    label_en: "Failed",
    color: "red",
  },
  {
    status: TransactionStatus.Rejected,
    label_fa: "رد شده",
    label_en: "Rejected",
    color: "red",
  },
  {
    status: TransactionStatus.Canceled,
    label_fa: "لغو شده",
    label_en: "Canceled",
    color: "gray",
  },
];

// Validation
export interface TransactionValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export const validateTransaction = (
  transaction: Partial<Transaction>
): TransactionValidation => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!transaction.amount || transaction.amount <= 0) {
    errors.push("مبلغ باید بزرگتر از صفر باشد");
  }

  if (!transaction.beneficiaryName) {
    errors.push("نام ذینفع الزامی است");
  }

  if (!transaction.beneficiarySheba) {
    errors.push("شماره شبا الزامی است");
  } else if (!/^IR\d{24}$/.test(transaction.beneficiarySheba)) {
    errors.push("فرمت شماره شبا صحیح نیست");
  }

  if (transaction.amount && transaction.amount > 1000000000) {
    warnings.push("مبلغ تراکنش بیش از حد مجاز است");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
