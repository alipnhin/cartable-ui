/**
 * Transaction Types
 * انواع مربوط به تراکنش‌های پرداخت
 */

import { ChangeHistoryEntry } from "./common";

export interface Transaction {
  id: string;
  orderId: string; // شناسه دستور پرداخت
  roweNumber: number; // شماره ردیف در دستور
  amount: number;
  nationalCode: string;
  accountNumber: string;
  destinationIban: string;
  bankName:string;
  ownerName: string;
  description?: string;
  trackingId?: string; // کد پیگیری بانک
  status: TransactionStatus;
  providerMessage?: string;
  createdDateTime: string;
  reasonCode?: TransactionReasonEnum;
  paymentType?: PaymentMethodEnum;
  UpdatedDateTime?: string;
}

export enum TransactionStatus {
  Registered = "registered",
  WaitForExecution = "waitForExecution",
  WaitForBank = "waitForBank",
  BankSucceeded = "bankSucceeded",
  BankRejected = "bankRejected",
  TransactionRollback = "transactionRollback",
  Failed = "failed",
  Canceled = "canceled",
  Expired = "expired",
}
export enum PaymentMethodEnum {
  /** نامشخص */
  Unknown = "unknown",

  /** داخلی */
  Internal = "internal",

  /** پایا */
  Paya = "paya",

  /** ساتنا */
  Satna = "satna",

  /** کارت به کارت */
  Card = "card",
}

export enum TransactionReasonEnum {
  /** نامشخص */
  Unknown = "unknown",

  /** واريز حقوق */
  SalaryDeposit = "salaryDeposit",

  /** امور بیمه خدمات */
  ServicesInsurance = "servicesInsurance",

  /** امور درمانی */
  Therapeutic = "therapeutic",

  /** امور سرمايه‌گذارى و بورس */
  InvestmentAndBourse = "investmentAndBourse",

  /** امور ارزى در چارچوب ضوابط و مقررات */
  LegalCurrencyActivities = "legalCurrencyActivities",

  /** پرداخت قرض و تاديه ديون (قرض‌الحسنه، بدهى و غیره) */
  DebtPayment = "debtPayment",

  /** امور بازنشستگی */
  Retirement = "retirement",

  /** اموال منقول */
  MovableProperties = "movableProperties",

  /** اموال غیر منقول */
  ImmovableProperties = "immovableProperties",

  /** مدیریت نقدینگی */
  CashManagement = "cashManagement",

  /** عوارض گمرکى */
  CustomsDuties = "customsDuties",

  /** تسویه مالیاتی */
  TaxSettle = "taxSettle",

  /** سایر خدمات دولتی */
  OtherGovernmentServices = "otherGovernmentServices",

  /** تسهیلات و تعهدات */
  FacilitiesAndCommitments = "facilitiesAndCommitments",

  /** بازگردانی وثیقه */
  BondReturn = "bondReturn",

  /** هزينه عمومى و امور روزمره */
  GeneralAndDailyCosts = "generalAndDailyCosts",

  /** امور خیریه */
  Charity = "charity",

  /** خرید کالا */
  StuffsPurchase = "stuffsPurchase",

  /** خرید خدمات */
  ServicesPurchase = "servicesPurchase",
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
  color: string;
  icon?: string;
}

export const TRANSACTION_STATUSES: TransactionStatusInfo[] = [
  {
    status: TransactionStatus.Registered,
    color: "gray",
  },
  {
    status: TransactionStatus.Expired,
    color: "yellow",
  },
  {
    status: TransactionStatus.WaitForExecution,
    color: "blue",
  },
  {
    status: TransactionStatus.WaitForBank,
    color: "purple",
  },
  {
    status: TransactionStatus.BankSucceeded,
    color: "green",
  },
  {
    status: TransactionStatus.BankRejected,
    color: "red",
  },
  {
    status: TransactionStatus.TransactionRollback,
    color: "dark",
  },
  {
    status: TransactionStatus.Canceled,
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
