/**
 * Mock Transactions
 * داده‌های نمونه تراکنش‌ها
 */

import { Transaction, TransactionStatus } from "@/types";
import { subtractDays, addHours, now } from "@/lib/date";

// تابع کمکی برای تولید شماره تراکنش تصادفی
const generateTransactionNumber = (index: number): string => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `TRX${random}${index}`;
};

// تابع کمکی برای تولید شماره حساب مقصد تصادفی
const generateDestinationAccount = (): string => {
  const randomDigits = Math.floor(1000000000000000 + Math.random() * 9000000000000000);
  return randomDigits.toString();
};

// تابع کمکی برای تولید شماره شبا تصادفی
const generateSheba = (): string => {
  const randomDigits = Math.floor(10000000000000000000 + Math.random() * 90000000000000000000);
  return `IR${randomDigits}`;
};

// نام‌های واقعی برای گیرندگان
const beneficiaryNames = [
  "شرکت تولیدی آریا",
  "سازمان تأمین اجتماعی",
  "شرکت خدماتی پارس",
  "موسسه مالی کیان",
  "شرکت بازرگانی نوین",
  "اداره دارایی",
  "پیمانکار ساختمانی مهر",
  "تأمین کننده مواد اولیه",
  "شرکت حمل و نقل سپهر",
  "موسسه فرهنگی هنری",
  "شرکت صنعتی ایران",
  "فروشگاه زنجیره‌ای",
  "شرکت مهندسی مشاور",
  "سازمان آب و برق",
  "شرکت تعاونی کارگران",
];

// مبالغ متنوع
const amounts = [
  50000000,   // 50 میلیون
  75000000,   // 75 میلیون
  100000000,  // 100 میلیون
  150000000,  // 150 میلیون
  200000000,  // 200 میلیون
  250000000,  // 250 میلیون
  300000000,  // 300 میلیون
  500000000,  // 500 میلیون
  750000000,  // 750 میلیون
  1000000000, // 1 میلیارد
];

/**
 * تولید تراکنش‌های یک دستور
 */
export const generateTransactionsForOrder = (
  orderId: string,
  count: number,
  orderCreatedAt: string,
  orderStatus: string
): Transaction[] => {
  const transactions: Transaction[] = [];
  
  for (let i = 0; i < count; i++) {
    const randomName = beneficiaryNames[Math.floor(Math.random() * beneficiaryNames.length)];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    
    // تعیین وضعیت بر اساس وضعیت دستور
    let status: TransactionStatus;
    if (orderStatus === "draft" || orderStatus === "waiting_for_owners_approval") {
      status = TransactionStatus.Pending;
    } else if (orderStatus === "owners_approved") {
      status = TransactionStatus.Approved;
    } else if (orderStatus === "submitted_to_bank") {
      status = i % 5 === 0 ? TransactionStatus.Processing : TransactionStatus.Submitted;
    } else if (orderStatus === "succeeded") {
      status = TransactionStatus.Succeeded;
    } else if (orderStatus === "partially_succeeded") {
      status = i % 4 === 0 ? TransactionStatus.Failed : TransactionStatus.Succeeded;
    } else if (orderStatus === "rejected" || orderStatus === "bank_rejected") {
      status = TransactionStatus.Rejected;
    } else {
      status = TransactionStatus.Pending;
    }

    const transaction: Transaction = {
      id: `trx-${orderId}-${i + 1}`,
      orderId: orderId,
      transactionNumber: generateTransactionNumber(i),
      beneficiaryName: randomName,
      beneficiaryAccountNumber: generateDestinationAccount(),
      beneficiarySheba: generateSheba(),
      beneficiaryBankName: ["بانک ملی", "بانک صادرات", "بانک ملت", "بانک تجارت", "بانک پاسارگاد"][Math.floor(Math.random() * 5)],
      amount: randomAmount,
      currency: "IRR",
      description: `پرداخت بابت ${randomName}`,
      status: status,
      createdAt: orderCreatedAt,
      processedAt: status === TransactionStatus.Succeeded || status === TransactionStatus.Failed 
        ? addHours(orderCreatedAt, 24 + i) 
        : undefined,
      trackingNumber: status === TransactionStatus.Succeeded 
        ? `${Math.floor(100000000000 + Math.random() * 900000000000)}`
        : undefined,
      failureReason: status === TransactionStatus.Failed 
        ? ["موجودی ناکافی", "خطا در اتصال به بانک", "حساب مقصد نامعتبر"][Math.floor(Math.random() * 3)]
        : undefined,
    };

    transactions.push(transaction);
  }

  return transactions;
};

// ذخیره تمام تراکنش‌ها (پر خواهد شد توسط mockOrders)
export const mockTransactions: Transaction[] = [];

/**
 * Helper Functions
 */

// گرفتن تراکنش با ID
export const getTransactionById = (transactionId: string): Transaction | undefined => {
  return mockTransactions.find((t) => t.id === transactionId);
};

// گرفتن تراکنش‌های یک دستور
export const getTransactionsByOrderId = (orderId: string): Transaction[] => {
  return mockTransactions.filter((t) => t.orderId === orderId);
};

// گرفتن تراکنش‌ها با وضعیت خاص
export const getTransactionsByStatus = (status: TransactionStatus): Transaction[] => {
  return mockTransactions.filter((t) => t.status === status);
};

// محاسبه مجموع مبلغ تراکنش‌های یک دستور
export const calculateOrderTotalAmount = (orderId: string): number => {
  const transactions = getTransactionsByOrderId(orderId);
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};

// محاسبه تعداد تراکنش‌های موفق یک دستور
export const countSuccessfulTransactions = (orderId: string): number => {
  const transactions = getTransactionsByOrderId(orderId);
  return transactions.filter((t) => t.status === TransactionStatus.Succeeded).length;
};

// محاسبه تعداد تراکنش‌های ناموفق یک دستور
export const countFailedTransactions = (orderId: string): number => {
  const transactions = getTransactionsByOrderId(orderId);
  return transactions.filter((t) => t.status === TransactionStatus.Failed).length;
};
