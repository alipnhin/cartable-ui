/**
 * Mock Change History
 * تاریخچه تغییرات دستورات
 */

import {
  OrderApproveStatus,
  ChangeHistoryEntry,
  TransactionStatus,
} from "@/types";
import { PaymentOrder, OrderStatus, OrderApprover } from "@/types";
import { addHours } from "@/lib/date";

/**
 * تولید تاریخچه تغییرات برای یک دستور
 */
export const generateChangeHistoryForOrder = (
  order: PaymentOrder,
  approvers: OrderApprover[]
): ChangeHistoryEntry[] => {
  const history: ChangeHistoryEntry[] = [];

  // 1. ایجاد دستور
  history.push({
    id: `ch-${order.id}-1`,
    createdDateTime: order.createdAt,
    userName: order.createdByName,
    Status: OrderStatus.WaitingForOwnersApproval,
    title: "ایجاد دستور",
    description: `دستور پرداخت ایجاد شد`,
  });

  // 2. تأییدها و ردها
  approvers.forEach((approver, index) => {
    if (
      approver.status === OrderApproveStatus.Accepted &&
      approver.createdDateTime
    ) {
      history.push({
        id: `ch-${order.id}-approve-${index}`,
        createdDateTime: approver.createdDateTime,
        userName: approver.approverName,
        title: "تأیید",
        description: `دستور توسط ${approver.approverName} تأیید شد`,
        Status: OrderStatus.OwnersApproved,
      });
    }

    if (
      approver.status === OrderApproveStatus.Rejected &&
      approver.createdDateTime
    ) {
      history.push({
        id: `ch-${order.id}-reject-${index}`,
        createdDateTime: approver.createdDateTime,
        userName: approver.approverName,
        title: "رد",
        description: `دستور توسط ${approver.approverName} رد شد`,
        Status: OrderStatus.OwnerRejected,
      });
    }
  });

  // 3. تغییر وضعیت به تأیید شده
  if (
    order.status === OrderStatus.OwnersApproved ||
    order.status === OrderStatus.SubmittedToBank ||
    order.status === OrderStatus.Succeeded ||
    order.status === OrderStatus.PartiallySucceeded
  ) {
    const lastApproval = approvers
      .filter((a) => a.status === OrderApproveStatus.Accepted)
      .sort((a, b) => (a.createdDateTime! > b.createdDateTime! ? -1 : 1))[0];

    if (lastApproval && lastApproval.createdDateTime) {
      history.push({
        id: `ch-${order.id}-status-approved`,
        createdDateTime: addHours(lastApproval.createdDateTime, 0.5),
        userName: "علی پناهیان",
        title: "تغییر وضعیت",
        description: "وضعیت به 'تأیید شده' تغییر یافت",
        Status: OrderStatus.OwnersApproved,
      });
    }
  }

  // 4. ارسال به بانک
  if (order.submittedToBankAt) {
    history.push({
      id: `ch-${order.id}-submitted`,
      createdDateTime: order.submittedToBankAt,
      userName: "علی پناهیان",
      title: "ارسال به بانک",
      description: "دستور به علی پناهیان بانک ارسال شد",
      Status: OrderStatus.SubmittedToBank,
    });
  }

  // 5. پردازش نهایی
  if (order.processedAt) {
    let newStatus = order.status;
    let description_fa = "";

    if (order.status === OrderStatus.Succeeded) {
      description_fa = "تمام تراکنش‌ها با موفقیت انجام شد";
    } else if (order.status === OrderStatus.PartiallySucceeded) {
      description_fa = "برخی تراکنش‌ها با خطا مواجه شدند";
    }

    history.push({
      id: `ch-${order.id}-processed`,
      createdDateTime: order.processedAt,
      userName: "علی پناهیان",
      title: "پردازش شده",
      description: description_fa,
      Status: newStatus,
    });
  }

  // 6. رد شده
  if (order.status === OrderStatus.Rejected) {
    const rejection = approvers.find(
      (a) => a.status === OrderApproveStatus.Rejected
    );
    if (rejection && rejection.createdDateTime) {
      history.push({
        id: `ch-${order.id}-status-rejected`,
        createdDateTime: addHours(rejection.createdDateTime, 0.5),
        userName: "علی پناهیان",
        title: "تغییر وضعیت",
        description: "وضعیت به 'عدم تأیید' تغییر یافت",
        Status: OrderStatus.Rejected,
      });
    }
  }

  // مرتب‌سازی بر اساس زمان
  history.sort((a, b) => (a.createdDateTime > b.createdDateTime ? 1 : -1));

  return history;
};

/**
 * اضافه کردن یک رویداد جدید به تاریخچه
 */
export const addHistoryEntry = (
  orderId: string,
  entry: Omit<ChangeHistoryEntry, "id">
): ChangeHistoryEntry => {
  const newEntry: ChangeHistoryEntry = {
    ...entry,
    id: `ch-${orderId}-${Date.now()}`,
  };

  return newEntry;
};
