/**
 * Mock Accounts
 * داده‌های نمونه حساب‌های بانکی
 */

import { Account, AccountGroup, AccountStatus } from "@/types";
import { subtractDays, now } from "@/lib/date";

// Account Groups
export const mockAccountGroups: AccountGroup[] = [
  {
    id: "group-1",
    name_fa: "حساب‌های اصلی",
    name_en: "Main Accounts",
    description_fa: "حساب‌های اصلی شرکت",
    color: "blue",
    accountIds: ["acc-1", "acc-2"],
  },
  {
    id: "group-2",
    name_fa: "حساب‌های فرعی",
    name_en: "Sub Accounts",
    description_fa: "حساب‌های فرعی و عملیاتی",
    color: "purple",
    accountIds: ["acc-3", "acc-4", "acc-5"],
  },
];

// Mock Bank Accounts
export const mockAccounts: Account[] = [
  {
    id: "acc-1",
    groupId: "group-1",
    accountTitle: "حساب اصلی - بانک ملی",
    accountNumber: "1234567890123456",
    sheba: "IR120100001234567890123456",
    bankName: "بانک ملی ایران",
    bankCode: "011",
    branchName: "شعبه مرکزی",
    branchCode: "1000",
    accountType: "جاری",
    currency: "IRR",
    balance: 5000000000, // 5 میلیارد ریال
    minimumSignatureCount: 2,
    status: AccountStatus.Active,
    isActive: true,
    signerIds: ["user-1", "user-2", "user-3"],
    createdBy: "user-1",
    createdAt: subtractDays(now(), 365),
    updatedAt: subtractDays(now(), 10),
  },
  {
    id: "acc-2",
    groupId: "group-1",
    accountTitle: "حساب سرمایه‌گذاری - بانک صادرات",
    accountNumber: "2345678901234567",
    sheba: "IR130200002345678901234567",
    bankName: "بانک صادرات ایران",
    bankCode: "020",
    branchName: "شعبه میدان ولیعصر",
    branchCode: "2050",
    accountType: "سرمایه‌گذاری",
    currency: "IRR",
    balance: 15000000000, // 15 میلیارد ریال
    minimumSignatureCount: 3,
    status: AccountStatus.Active,
    isActive: true,
    signerIds: ["user-1", "user-2", "user-3", "user-4", "user-6"],
    createdBy: "user-1",
    createdAt: subtractDays(now(), 300),
    updatedAt: subtractDays(now(), 5),
  },
  {
    id: "acc-3",
    groupId: "group-2",
    accountTitle: "حساب عملیاتی - بانک تجارت",
    accountNumber: "3456789012345678",
    sheba: "IR140300003456789012345678",
    bankName: "بانک تجارت",
    bankCode: "018",
    branchName: "شعبه سعادت‌آباد",
    branchCode: "3100",
    accountType: "جاری",
    currency: "IRR",
    balance: 2000000000, // 2 میلیارد ریال
    minimumSignatureCount: 2,
    status: AccountStatus.Active,
    isActive: true,
    signerIds: ["user-2", "user-4", "user-5"],
    createdBy: "user-2",
    createdAt: subtractDays(now(), 250),
    updatedAt: subtractDays(now(), 3),
  },
  {
    id: "acc-4",
    groupId: "group-2",
    accountTitle: "حساب پس‌انداز - بانک ملت",
    accountNumber: "4567890123456789",
    sheba: "IR150120004567890123456789",
    bankName: "بانک ملت",
    bankCode: "012",
    branchName: "شعبه تهران‌پارس",
    branchCode: "4200",
    accountType: "پس‌انداز",
    currency: "IRR",
    balance: 8000000000, // 8 میلیارد ریال
    minimumSignatureCount: 2,
    status: AccountStatus.Active,
    isActive: true,
    signerIds: ["user-3", "user-5", "user-7"],
    createdBy: "user-3",
    createdAt: subtractDays(now(), 200),
    updatedAt: subtractDays(now(), 7),
  },
  {
    id: "acc-5",
    groupId: "group-2",
    accountTitle: "حساب ارزی - بانک پاسارگاد",
    accountNumber: "5678901234567890",
    sheba: "IR160570005678901234567890",
    bankName: "بانک پاسارگاد",
    bankCode: "057",
    branchName: "شعبه ونک",
    branchCode: "5300",
    accountType: "ارزی",
    currency: "USD",
    balance: 500000, // 500 هزار دلار
    minimumSignatureCount: 3,
    status: AccountStatus.Active,
    isActive: true,
    signerIds: ["user-1", "user-6", "user-9"],
    createdBy: "user-1",
    createdAt: subtractDays(now(), 180),
    updatedAt: subtractDays(now(), 2),
  },
];

/**
 * Helper Functions
 */

// گرفتن حساب با ID
export const getAccountById = (accountId: string): Account | undefined => {
  return mockAccounts.find((acc) => acc.id === accountId);
};

// گرفتن حساب‌های یک گروه
export const getAccountsByGroup = (groupId: string): Account[] => {
  return mockAccounts.filter((acc) => acc.groupId === groupId);
};

// گرفتن حساب‌های فعال
export const getActiveAccounts = (): Account[] => {
  return mockAccounts.filter((acc) => acc.isActive);
};

// گرفتن حساب‌هایی که کاربر خاص امضاکننده آن است
export const getAccountsBySignerId = (userId: string): Account[] => {
  return mockAccounts.filter((acc) => acc.signerIds.includes(userId));
};

// گرفتن گروه با ID
export const getAccountGroupById = (
  groupId: string
): AccountGroup | undefined => {
  return mockAccountGroups.find((g) => g.id === groupId);
};

// گرفتن تمام گروه‌ها
export const getAllAccountGroups = (): AccountGroup[] => {
  return mockAccountGroups;
};
