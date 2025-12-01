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

/**
 * Account Group
 * گروه حساب - برای دسته‌بندی حساب‌های بانکی
 *
 * @property id - شناسه یکتای گروه حساب
 * @property title - عنوان گروه حساب
 * @property accountCount - تعداد حساب‌های موجود در این گروه
 * @property icon - نام آیکن برای نمایش (از lucide-react)
 * @property description - توضیحات اختیاری درباره گروه
 * @property color - رنگ اختیاری برای UI
 */
export interface AccountGroup {
  id: string;
  title: string;
  accountCount: number;
  icon?: string;
  description?: string;
  color?: string;
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
