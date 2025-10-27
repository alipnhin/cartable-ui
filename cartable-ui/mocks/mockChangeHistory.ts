/**
 * Mock Change History
 * تاریخچه تغییرات دستورات
 */

import { ChangeHistoryEntry } from "@/types";
import { PaymentOrder, OrderStatus, Approver } from "@/types";
import { addHours } from "@/lib/date";

/**
 * تولید تاریخچه تغییرات برای یک دستور
 */
export const generateChangeHistoryForOrder = (
  order: PaymentOrder,
  approvers: Approver[]
): ChangeHistoryEntry[] => {
  const history: ChangeHistoryEntry[] = [];

  // 1. ایجاد دستور
  history.push({
    id: `ch-${order.id}-1`,
    timestamp: order.createdAt,
    userId: order.createdBy,
    userName: order.createdByName,
    action: "created",
    actionLabel_fa: "ایجاد دستور",
    actionLabel_en: "Order Created",
    description_fa: `دستور پرداخت ایجاد شد`,
    description_en: `Payment order created`,
    oldValue: undefined,
    newValue: order.status,
  });

  // 2. تأییدها و ردها
  approvers.forEach((approver, index) => {
    if (approver.hasApproved && approver.approvedAt) {
      history.push({
        id: `ch-${order.id}-approve-${index}`,
        timestamp: approver.approvedAt,
        userId: approver.userId,
        userName: approver.fullName,
        action: "approved",
        actionLabel_fa: "تأیید",
        actionLabel_en: "Approved",
        description_fa: `دستور توسط ${approver.fullName} تأیید شد`,
        description_en: `Order approved by ${approver.fullName}`,
        comment: approver.comment,
      });
    }

    if (approver.hasRejected && approver.rejectedAt) {
      history.push({
        id: `ch-${order.id}-reject-${index}`,
        timestamp: approver.rejectedAt,
        userId: approver.userId,
        userName: approver.fullName,
        action: "rejected",
        actionLabel_fa: "رد",
        actionLabel_en: "Rejected",
        description_fa: `دستور توسط ${approver.fullName} رد شد`,
        description_en: `Order rejected by ${approver.fullName}`,
        comment: approver.comment,
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
      .filter((a) => a.hasApproved)
      .sort((a, b) => (a.approvedAt! > b.approvedAt! ? -1 : 1))[0];

    if (lastApproval && lastApproval.approvedAt) {
      history.push({
        id: `ch-${order.id}-status-approved`,
        timestamp: addHours(lastApproval.approvedAt, 0.5),
        userId: "system",
        userName: "سیستم",
        action: "status_changed",
        actionLabel_fa: "تغییر وضعیت",
        actionLabel_en: "Status Changed",
        description_fa: "وضعیت به 'تأیید شده' تغییر یافت",
        description_en: "Status changed to 'Approved'",
        oldValue: OrderStatus.WaitingForOwnersApproval,
        newValue: OrderStatus.OwnersApproved,
      });
    }
  }

  // 4. ارسال به بانک
  if (order.submittedToBankAt) {
    history.push({
      id: `ch-${order.id}-submitted`,
      timestamp: order.submittedToBankAt,
      userId: "system",
      userName: "سیستم",
      action: "submitted_to_bank",
      actionLabel_fa: "ارسال به بانک",
      actionLabel_en: "Submitted to Bank",
      description_fa: "دستور به سیستم بانک ارسال شد",
      description_en: "Order submitted to bank system",
      oldValue: OrderStatus.OwnersApproved,
      newValue: OrderStatus.SubmittedToBank,
    });
  }

  // 5. پردازش نهایی
  if (order.processedAt) {
    let newStatus = order.status;
    let description_fa = "";
    let description_en = "";

    if (order.status === OrderStatus.Succeeded) {
      description_fa = "تمام تراکنش‌ها با موفقیت انجام شد";
      description_en = "All transactions completed successfully";
    } else if (order.status === OrderStatus.PartiallySucceeded) {
      description_fa = "برخی تراکنش‌ها با خطا مواجه شدند";
      description_en = "Some transactions failed";
    }

    history.push({
      id: `ch-${order.id}-processed`,
      timestamp: order.processedAt,
      userId: "system",
      userName: "سیستم",
      action: "processed",
      actionLabel_fa: "پردازش شده",
      actionLabel_en: "Processed",
      description_fa: description_fa,
      description_en: description_en,
      oldValue: OrderStatus.SubmittedToBank,
      newValue: newStatus,
    });
  }

  // 6. رد شده
  if (order.status === OrderStatus.Rejected) {
    const rejection = approvers.find((a) => a.hasRejected);
    if (rejection && rejection.rejectedAt) {
      history.push({
        id: `ch-${order.id}-status-rejected`,
        timestamp: addHours(rejection.rejectedAt, 0.5),
        userId: "system",
        userName: "سیستم",
        action: "status_changed",
        actionLabel_fa: "تغییر وضعیت",
        actionLabel_en: "Status Changed",
        description_fa: "وضعیت به 'عدم تأیید' تغییر یافت",
        description_en: "Status changed to 'Rejected'",
        oldValue: OrderStatus.WaitingForOwnersApproval,
        newValue: OrderStatus.Rejected,
      });
    }
  }

  // مرتب‌سازی بر اساس زمان
  history.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));

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
