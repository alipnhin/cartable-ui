/**
 * Account Types
 * انواع مربوط به حساب‌های بانکی
 */

import { ChangeHistoryEntry } from "./common";
import { Signer } from "./signer";

export enum AccountStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
  Closed = "closed",
}

export interface Account {
  id: string;
  groupId: string; // شناسه گروه حساب
  accountTitle: string;
  accountNumber: string;
  sheba: string; // شماره شبا (26 کاراکتر با IR)
  bankName: string;
  bankCode: string;
  branchName?: string;
  branchCode?: string;
  accountType?: string; // نوع حساب (جاری، پس‌انداز، etc.)
  currency: string; // IRR, USD, EUR
  balance?: number;
  minimumSignatureCount: number; // حداقل تعداد امضا برای تأیید
  status: AccountStatus;
  isActive: boolean;
  signerIds: string[]; // آرایه ID های کاربران امضاکننده
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

// Account Group (برای دسته‌بندی حساب‌ها)
export interface AccountGroup {
  id: string;
  name: string;
  description?: string;
  color?: string;
  accountIds: string[];
  icon?: string;
}

export enum AccountGroup_OLD {
  Operational = "operational", // عملیاتی
  Investment = "investment", // سرمایه‌گذاری
  Savings = "savings", // پس‌انداز
  Foreign = "foreign", // ارزی
  Other = "other", // سایر
}

export enum Currency {
  IRR = "IRR", // ریال
  USD = "USD", // دلار
  EUR = "EUR", // یورو
  AED = "AED", // درهم
}

export interface AccountDetail extends Account {
  description?: string;
  changeHistory: ChangeHistoryEntry[];
  statistics?: AccountStatistics;
}

export interface AccountStatistics {
  totalOrders: number;
  pendingOrders: number;
  approvedOrders: number;
  rejectedOrders: number;
  totalAmount: number;
  lastTransactionDate?: string;
}

// Bank List
export interface Bank {
  code: string;
  name_fa: string;
  name_en: string;
  logo?: string;
}

export const IRANIAN_BANKS: Bank[] = [
  { code: "017", name_fa: "بانک ملی ایران", name_en: "Bank Melli Iran" },
  { code: "018", name_fa: "بانک تجارت", name_en: "Bank Tejarat" },
  { code: "015", name_fa: "بانک سپه", name_en: "Bank Sepah" },
  { code: "019", name_fa: "بانک صادرات ایران", name_en: "Bank Saderat Iran" },
  { code: "012", name_fa: "بانک ملت", name_en: "Bank Mellat" },
  { code: "016", name_fa: "بانک کشاورزی", name_en: "Bank Keshavarzi" },
  { code: "021", name_fa: "بانک پست بانک", name_en: "Post Bank" },
  { code: "054", name_fa: "بانک پارسیان", name_en: "Parsian Bank" },
  { code: "055", name_fa: "بانک اقتصاد نوین", name_en: "EN Bank" },
  { code: "056", name_fa: "بانک سامان", name_en: "Saman Bank" },
  { code: "057", name_fa: "بانک پاسارگاد", name_en: "Pasargad Bank" },
  { code: "058", name_fa: "بانک سرمایه", name_en: "Sarmayeh Bank" },
  { code: "060", name_fa: "بانک مهر ایران", name_en: "Mehr Iran Bank" },
  { code: "062", name_fa: "بانک آینده", name_en: "Ayandeh Bank" },
];
