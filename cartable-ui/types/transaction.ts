/**
 * Transaction Types
 * انواع مربوط به تراکنش‌های پرداخت
 */

import { ChangeHistoryEntry } from "./common";
import {
  PaymentItemStatusEnum,
  PaymentMethodEnum,
  TransactionReasonEnum,
} from "./api";

// Re-export API enums for backward compatibility
export { PaymentItemStatusEnum as TransactionStatus };
export { PaymentMethodEnum as PaymentMethodEnum };

export interface Transaction {
  id: string;
  orderId: string; // شناسه دستور پرداخت
  roweNumber: number; // شماره ردیف در دستور
  amount: number;
  nationalCode: string;
  accountNumber: string;
  destinationIban: string;
  bankName: string;
  bankCode: string;
  ownerName: string;
  description?: string;
  trackingId?: string; // کد پیگیری بانک
  status: PaymentItemStatusEnum;
  providerMessage?: string;
  createdDateTime: string;
  reasonCode?: TransactionReasonEnum;
  paymentType?: PaymentMethodEnum;
  UpdatedDateTime?: string;
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
  status: PaymentItemStatusEnum;
  color: string;
  icon?: string;
}

export const TRANSACTION_STATUSES: TransactionStatusInfo[] = [
  {
    status: PaymentItemStatusEnum.Registered,
    color: "gray",
  },
  {
    status: PaymentItemStatusEnum.Expired,
    color: "yellow",
  },
  {
    status: PaymentItemStatusEnum.WaitForExecution,
    color: "blue",
  },
  {
    status: PaymentItemStatusEnum.WaitForBank,
    color: "purple",
  },
  {
    status: PaymentItemStatusEnum.BankSucceeded,
    color: "green",
  },
  {
    status: PaymentItemStatusEnum.BankRejected,
    color: "red",
  },
  {
    status: PaymentItemStatusEnum.TransactionRollback,
    color: "dark",
  },
  {
    status: PaymentItemStatusEnum.Canceled,
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

  if (!transaction.ownerName) {
    errors.push("نام ذینفع الزامی است");
  }

  if (!transaction.destinationIban) {
    errors.push("شماره شبا الزامی است");
  } else if (!/^IR\d{24}$/.test(transaction.destinationIban)) {
    errors.push("فرمت شماره شبا صحیح نیست");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};
