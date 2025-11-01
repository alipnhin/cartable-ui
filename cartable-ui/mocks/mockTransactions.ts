/**
 * Mock Transactions
 * داده‌های نمونه تراکنش‌ها
 */

import { PaymentMethodEnum, Transaction, TransactionReasonEnum, TransactionStatus } from "@/types";
import { subtractDays, addHours, now } from "@/lib/date";

// تابع کمکی برای تولید کد ملی تصادفی
const generateNationalId = (): string => {
  // تولید 9 رقم اول تصادفی (به جز حالت‌های تکراری مثل 000000000)
  let digits = Array.from({ length: 9 }, () =>
    Math.floor(Math.random() * 10)
  );

  // جلوگیری از حالت‌هایی مثل تمام صفر یا تمام عدد تکراری
  if (new Set(digits).size === 1) {
    digits[8] = (digits[8] + 1) % 10;
  }

  // محاسبه رقم کنترل طبق الگوریتم رسمی ثبت احوال
  const sum = digits.reduce((acc, digit, i) => acc + digit * (10 - i), 0);
  const remainder = sum % 11;
  const controlDigit = remainder < 2 ? remainder : 11 - remainder;

  return [...digits, controlDigit].join("");
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
  "علی رضایی",
  "سارا احمدی",
  "محمد موسوی",
  "فاطمه کاظمی",
  "حسین صادقی",
  "زهرا محمدی",
  "رضا کریمی",
  "مینا یوسفی",
  "احمد نوری",
  "سمیه حسینی",
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
      status = TransactionStatus.WaitForExecution;
    } else if (orderStatus === "owners_approved") {
      status = TransactionStatus.WaitForExecution;
    } else if (orderStatus === "submitted_to_bank") {
      status =  TransactionStatus.WaitForBank;
    } else if (orderStatus === "succeeded") {
      status = TransactionStatus.BankSucceeded;
    } else if (orderStatus === "partially_succeeded") {
      status = i % 4 === 0 ? TransactionStatus.Failed : TransactionStatus.BankSucceeded;
    } else if (orderStatus === "rejected" || orderStatus === "bank_rejected") {
      status = TransactionStatus.BankRejected;
    } else {
      status = TransactionStatus.WaitForExecution;
    }

    const transaction: Transaction = {
      id: `trx-${orderId}-${i + 1}`,
      orderId: orderId,
      nationalCode: generateNationalId(),
      ownerName: randomName,
      accountNumber: generateDestinationAccount(),
      destinationIban: generateSheba(),
      bankName: ["بانک ملی", "بانک صادرات", "بانک ملت", "بانک تجارت", "بانک پاسارگاد"][Math.floor(Math.random() * 5)],
      amount: randomAmount,
      description: `پرداخت بابت ${randomName}`,
      status: status,
      createdDateTime: orderCreatedAt,
      UpdatedDateTime: status === TransactionStatus.BankSucceeded || status === TransactionStatus.Failed
        ? addHours(orderCreatedAt, 24 + i)
        : undefined,
      trackingId: status === TransactionStatus.BankSucceeded
        ? `${Math.floor(100000000000 + Math.random() * 900000000000)}`
        : undefined,
      providerMessage: status === TransactionStatus.Failed
        ? ["موجودی ناکافی", "خطا در اتصال به بانک", "حساب مقصد نامعتبر"][Math.floor(Math.random() * 3)]
        : undefined,
      roweNumber: i,
      paymentType: getRandomEnumValue(PaymentMethodEnum),
      reasonCode: getRandomEnumValue(TransactionReasonEnum)
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
const getRandomEnumValue = <T extends { [key: string]: string }>(
  enumObj: T
): T[keyof T] => {
  const values = Object.values(enumObj) as T[keyof T][];
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

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
  return transactions.filter((t) => t.status === TransactionStatus.BankSucceeded).length;
};

// محاسبه تعداد تراکنش‌های ناموفق یک دستور
export const countFailedTransactions = (orderId: string): number => {
  const transactions = getTransactionsByOrderId(orderId);
  return transactions.filter((t) => t.status === TransactionStatus.Failed).length;
};
