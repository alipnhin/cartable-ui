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
  name_fa: string;
  name_en: string;
  description_fa?: string;
  color?: string;
  accountIds: string[];
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

// Account Groups for filtering
export interface AccountGroupInfo {
  code: AccountGroup;
  name_fa: string;
  name_en: string;
  icon?: string;
  color?: string;
}

export const ACCOUNT_GROUPS: AccountGroup[] = [
  {
    id: "operational",
    name_fa: "حساب‌های عملیاتی",
    name_en: "Operational Accounts",
    color: "blue",
    accountIds: [],
  },
  {
    id: "Investment",
    name_fa: "حساب‌های سرمایه‌گذاری",
    name_en: "Investment Accounts",
    color: "green",
    accountIds: [],
  },
  {
    id: "Savings",
    name_fa: "حساب‌های پس‌انداز",
    name_en: "Savings Accounts",
    color: "purple",
    accountIds: [],
  },
  {
    id: "Foreign",
    name_fa: "حساب‌های ارزی",
    name_en: "Foreign Accounts",
    color: "orange",
    accountIds: [],
  },
  {
    id: "Other",
    name_fa: "سایر",
    name_en: "Other",
    color: "gray",
    accountIds: [],
  },
];

// Bank List
export interface Bank {
  code: string;
  name_fa: string;
  name_en: string;
  logo?: string;
}

export const IRANIAN_BANKS: Bank[] = [
  { code: "017", name_fa: "بانک ملی ایران", name_en: "Bank Melli Iran" },
  { code: "018", name_fa: "بانک صنعت و معدن", name_en: "Bank Sanat O Madan" },
  { code: "019", name_fa: "بانک سپه", name_en: "Bank Sepah" },
  { code: "011", name_fa: "بانک صادرات ایران", name_en: "Bank Saderat Iran" },
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
