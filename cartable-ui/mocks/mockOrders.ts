/**
 * Mock Orders
 * داده‌های نمونه دستورات پرداخت (25 عدد)
 */

import { PaymentOrder, OrderStatus, PaymentOrderDetail } from "@/types";
import { mockAccounts, getAccountById } from "./mockAccounts";
import { mockUsers, getUserById, CURRENT_USER } from "./mockUsers";
import {
  generateTransactionsForOrder,
  mockTransactions,
  getTransactionsByOrderId,
  calculateOrderTotalAmount,
} from "./mockTransactions";
import { generateApproversForOrder } from "./mockSigners";
import { generateChangeHistoryForOrder } from "./mockChangeHistory";
import { subtractDays, addHours, now } from "@/lib/date";
import { OrderApproveStatus } from "@/types/signer";

// تابع کمکی برای تولید شماره درخواست
const generateOrderId = (index: number): string => {
  const year = "1403";
  const paddedIndex = index.toString().padStart(4, "0");
  return `WO-${year}-${paddedIndex}`;
};

// عناوین متنوع برای دستورات
const orderTitles = [
  "پرداخت حقوق کارکنان",
  "تسویه تأمین‌کنندگان",
  "پرداخت مالیات",
  "تسویه پیمانکاران",
  "پرداخت بیمه",
  "پرداخت هزینه‌های جاری",
  "تسویه سفارشات",
  "پرداخت اقساط بانکی",
  "تسویه فاکتورها",
  "پرداخت پاداش",
  "هزینه‌های عملیاتی",
  "پرداخت خدمات",
  "تسویه حساب مشتریان",
  "پرداخت کمیسیون",
  "هزینه‌های اداری",
];

// وضعیت‌های مختلف با توزیع واقعی
const statusDistribution: OrderStatus[] = [
  OrderStatus.WaitingForOwnersApproval, // 8 عدد
  OrderStatus.WaitingForOwnersApproval,
  OrderStatus.WaitingForOwnersApproval,
  OrderStatus.WaitingForOwnersApproval,
  OrderStatus.WaitingForOwnersApproval,
  OrderStatus.WaitingForOwnersApproval,
  OrderStatus.WaitingForOwnersApproval,
  OrderStatus.WaitingForOwnersApproval,
  OrderStatus.OwnersApproved, // 4 عدد
  OrderStatus.OwnersApproved,
  OrderStatus.OwnersApproved,
  OrderStatus.OwnerRejected,
  OrderStatus.OwnerRejected, // 4 عدد
  OrderStatus.SubmittedToBank,
  OrderStatus.SubmittedToBank,
  OrderStatus.SubmittedToBank,
  OrderStatus.Succeeded, // 5 عدد
  OrderStatus.Succeeded,
  OrderStatus.Succeeded,
  OrderStatus.Succeeded,
  OrderStatus.Succeeded,
  OrderStatus.PartiallySucceeded, // 2 عدد
  OrderStatus.PartiallySucceeded,
  OrderStatus.Rejected, // 1 عدد
  OrderStatus.Draft, // 1 عدد
];

/**
 * تولید 25 دستور پرداخت
 */
export const mockOrders: PaymentOrder[] = [];

// تولید دستورات
for (let i = 0; i < 25; i++) {
  // انتخاب تصادفی حساب
  const account = mockAccounts[i % mockAccounts.length];

  // انتخاب عنوان
  const title = orderTitles[i % orderTitles.length];

  // انتخاب وضعیت
  const status = statusDistribution[i];

  // تعداد تراکنش‌ها (5 تا 15)
  const transactionCount = 50 + Math.floor(Math.random() * 10);

  // تاریخ ایجاد (7 روز گذشته تا امروز)
  const daysAgo = Math.floor(Math.random() * 7);
  const createdAt = subtractDays(now(), daysAgo);

  // کاربر ایجادکننده
  const creator = mockUsers[i % mockUsers.length];

  const order: PaymentOrder = {
    id: `order-${i + 1}`,
    orderId: generateOrderId(i + 1),
    title: title,
    accountId: account.id,
    accountNumber: account.accountNumber,
    accountSheba: account.sheba,
    bankName: account.bankName,
    numberOfTransactions: transactionCount,
    totalAmount: 0, // محاسبه می‌شود
    currency: account.currency,
    status: status,
    createdBy: creator.id,
    createdByName: creator.fullName,
    createdAt: createdAt,
    updatedAt:
      status === OrderStatus.Draft ? createdAt : addHours(createdAt, 2 + i),
    submittedToBankAt:
      status === OrderStatus.SubmittedToBank ||
      status === OrderStatus.Succeeded ||
      status === OrderStatus.PartiallySucceeded
        ? addHours(createdAt, 6)
        : undefined,
    processedAt:
      status === OrderStatus.Succeeded ||
      status === OrderStatus.PartiallySucceeded
        ? addHours(createdAt, 24)
        : undefined,
    description: `${title} - دوره ${
      daysAgo === 0 ? "امروز" : `${daysAgo} روز پیش`
    }`,

    // فیلدهای اضافی برای UI
    orderNumber: generateOrderId(i + 1),
    accountTitle: `${account.bankName} - ${account.accountNumber}`,
    totalTransactions: transactionCount,
    createdDate: createdAt,
    createdDateTime: createdAt,
    paymentType: i % 3, // 0: داخلی، 1: پایا، 2: ساتنا
  };

  mockOrders.push(order);

  // تولید تراکنش‌ها برای این دستور
  const transactions = generateTransactionsForOrder(
    order.id,
    transactionCount,
    order.createdAt,
    order.status
  );
  mockTransactions.push(...transactions);

  // محاسبه مجموع مبلغ
  order.totalAmount = calculateOrderTotalAmount(order.id);
}

/**
 * تولید جزئیات کامل یک دستور
 */
export const getOrderDetailById = (
  orderId: string
): PaymentOrderDetail | undefined => {
  const order = mockOrders.find((o) => o.id === orderId);
  if (!order) return undefined;

  const account = getAccountById(order.accountId);
  if (!account) return undefined;

  const transactions = getTransactionsByOrderId(order.id);
  const approvers = generateApproversForOrder(order, account);
  const changeHistory = generateChangeHistoryForOrder(order, approvers);

  // محاسبه قابلیت‌های عملیاتی برای کاربر فعلی
  const currentUserId = CURRENT_USER.id;
  const isApprover = approvers.some((a) => a.signerId === currentUserId);
  const hasApproved = approvers.some(
    (a) =>
      a.signerId === currentUserId && a.status === OrderApproveStatus.Accepted
  );

  const canApprove =
    isApprover &&
    !hasApproved &&
    order.status === OrderStatus.WaitingForOwnersApproval;

  const canReject =
    isApprover &&
    !hasApproved &&
    order.status === OrderStatus.WaitingForOwnersApproval;

  const canEdit =
    order.createdBy === currentUserId && order.status === OrderStatus.Draft;

  const canCancel =
    order.createdBy === currentUserId &&
    (order.status === OrderStatus.Draft ||
      order.status === OrderStatus.WaitingForOwnersApproval);

  const canInquiry =
    order.status === OrderStatus.SubmittedToBank ||
    order.status === OrderStatus.Succeeded ||
    order.status === OrderStatus.PartiallySucceeded;

  const orderDetail: PaymentOrderDetail = {
    ...order,
    account: account,
    transactions: transactions,
    approvers: approvers,
    changeHistory: changeHistory,
    canApprove: canApprove,
    canReject: canReject,
    canEdit: canEdit,
    canCancel: canCancel,
    canInquiry: canInquiry,
  };

  return orderDetail;
};

/**
 * Helper Functions
 */

// گرفتن دستور با ID
export const getOrderById = (orderId: string): PaymentOrder | undefined => {
  return mockOrders.find((o) => o.id === orderId);
};

// گرفتن دستورات با وضعیت خاص
export const getOrdersByStatus = (status: OrderStatus): PaymentOrder[] => {
  return mockOrders.filter((o) => o.status === status);
};

// گرفتن دستورات یک حساب
export const getOrdersByAccountId = (accountId: string): PaymentOrder[] => {
  return mockOrders.filter((o) => o.accountId === accountId);
};

// گرفتن دستوراتی که کاربر فعلی باید تأیید کند
export const getOrdersForApproval = (
  userId: string = CURRENT_USER.id
): PaymentOrder[] => {
  return mockOrders.filter((order) => {
    // فقط دستورات در انتظار تأیید
    if (order.status !== OrderStatus.WaitingForOwnersApproval) return false;

    // بررسی اینکه آیا کاربر از امضاکنندگان حساب است
    const account = getAccountById(order.accountId);
    if (!account) return false;

    return account.signerIds.includes(userId);
  });
};

// فیلتر کردن دستورات
export const filterOrders = (filters: {
  accountGroups?: string[];
  statuses?: OrderStatus[];
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
}): PaymentOrder[] => {
  let filtered = [...mockOrders];

  // فیلتر گروه حساب
  if (filters.accountGroups && filters.accountGroups.length > 0) {
    filtered = filtered.filter((order) => {
      const account = getAccountById(order.accountId);
      return account && filters.accountGroups!.includes(account.groupId);
    });
  }

  // فیلتر وضعیت
  if (filters.statuses && filters.statuses.length > 0) {
    filtered = filtered.filter((order) =>
      filters.statuses!.includes(order.status)
    );
  }

  // فیلتر تاریخ
  if (filters.fromDate) {
    filtered = filtered.filter((order) => order.createdAt >= filters.fromDate!);
  }
  if (filters.toDate) {
    filtered = filtered.filter((order) => order.createdAt <= filters.toDate!);
  }

  // فیلتر مبلغ
  if (filters.minAmount !== undefined) {
    filtered = filtered.filter(
      (order) => order.totalAmount >= filters.minAmount!
    );
  }
  if (filters.maxAmount !== undefined) {
    filtered = filtered.filter(
      (order) => order.totalAmount <= filters.maxAmount!
    );
  }

  // جستجو
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.orderId.toLowerCase().includes(query) ||
        order.title.toLowerCase().includes(query) ||
        order.createdByName.toLowerCase().includes(query)
    );
  }

  return filtered;
};

// آمار دستورات
export const getOrderStatistics = () => {
  return {
    total: mockOrders.length,
    pending: getOrdersByStatus(OrderStatus.WaitingForOwnersApproval).length,
    approved: getOrdersByStatus(OrderStatus.OwnersApproved).length,
    rejected: getOrdersByStatus(OrderStatus.Rejected).length,
    submitted: getOrdersByStatus(OrderStatus.SubmittedToBank).length,
    succeeded: getOrdersByStatus(OrderStatus.Succeeded).length,
    totalAmount: mockOrders.reduce((sum, o) => sum + o.totalAmount, 0),
  };
};
