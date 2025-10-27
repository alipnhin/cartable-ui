/**
 * Mock Signers & Approvers
 * امضاکنندگان و تأییدکنندگان
 */

import { Approver, SignatureProgress, ApprovalSummary } from "@/types";
import { Account, PaymentOrder, OrderStatus } from "@/types";
import { getUserById } from "./mockUsers";
import { subtractHours, addHours } from "@/lib/date";

/**
 * تولید لیست تأییدکنندگان برای یک دستور
 */
export const generateApproversForOrder = (
  order: PaymentOrder,
  account: Account
): Approver[] => {
  const approvers: Approver[] = [];

  // تمام امضاکنندگان حساب به عنوان تأییدکننده
  account.signerIds.forEach((userId, index) => {
    const user = getUserById(userId);
    if (!user) return;

    // تعیین وضعیت تأیید بر اساس وضعیت دستور
    let hasApproved = false;
    let hasRejected = false;
    let approvedAt: string | undefined;
    let rejectedAt: string | undefined;
    let comment: string | undefined;

    if (order.status === OrderStatus.Draft) {
      // پیش‌نویس - هیچکس تأیید نکرده
      hasApproved = false;
    } else if (order.status === OrderStatus.WaitingForOwnersApproval) {
      // در انتظار تأیید - برخی تأیید کرده‌اند
      // اولین نفر تأیید کرده
      if (index === 0) {
        hasApproved = true;
        approvedAt = addHours(order.createdAt, 1);
        comment = "تأیید می‌شود";
      }
      // اگر minimumSignature بیشتر از 2 باشد، نفر دوم هم تأیید کرده
      if (account.minimumSignatureCount > 2 && index === 1) {
        hasApproved = true;
        approvedAt = addHours(order.createdAt, 2);
      }
    } else if (order.status === OrderStatus.Rejected) {
      // رد شده - اولین نفر تأیید، دومی رد کرده
      if (index === 0) {
        hasApproved = true;
        approvedAt = addHours(order.createdAt, 1);
      } else if (index === 1) {
        hasRejected = true;
        rejectedAt = addHours(order.createdAt, 3);
        comment = "مدارک ناقص است";
      }
    } else {
      // سایر وضعیت‌ها - حداقل تعداد لازم تأیید کرده‌اند
      if (index < account.minimumSignatureCount) {
        hasApproved = true;
        approvedAt = addHours(order.createdAt, index + 1);
        if (index === 0) comment = "بررسی و تأیید شد";
      }
    }

    const approver: Approver = {
      userId: user.id,
      fullName: user.fullName,
      role: user.role,
      email: user.email,
      phoneNumber: user.phoneNumber,
      avatar: user.avatar,
      hasApproved: hasApproved,
      hasRejected: hasRejected,
      approvedAt: approvedAt,
      rejectedAt: rejectedAt,
      comment: comment,
      order: index + 1,
    };

    approvers.push(approver);
  });

  return approvers;
};

/**
 * تولید پیشرفت امضاها
 */
export const generateSignatureProgressForOrder = (
  order: PaymentOrder,
  account: Account,
  approvers: Approver[]
): SignatureProgress => {
  const approved = approvers.filter((a) => a.hasApproved).length;
  const rejected = approvers.filter((a) => a.hasRejected).length;
  const pending = approvers.length - approved - rejected;

  return {
    required: account.minimumSignatureCount,
    approved: approved,
    rejected: rejected,
    pending: pending,
    total: approvers.length,
    percentage: Math.round((approved / account.minimumSignatureCount) * 100),
    isComplete: approved >= account.minimumSignatureCount,
    canProceed: approved >= account.minimumSignatureCount && rejected === 0,
  };
};

/**
 * محاسبه خلاصه تأییدها
 */
export const calculateApprovalSummary = (
  account: Account,
  approvers: Approver[]
): ApprovalSummary => {
  const approved = approvers.filter((a) => a.hasApproved).length;
  const rejected = approvers.filter((a) => a.hasRejected).length;
  const pending = approvers.length - approved - rejected;

  return {
    required: account.minimumSignatureCount,
    approved: approved,
    rejected: rejected,
    pending: pending,
    isComplete: approved >= account.minimumSignatureCount,
  };
};

/**
 * بررسی اینکه آیا کاربر می‌تواند تأیید کند
 */
export const canUserApprove = (
  userId: string,
  order: PaymentOrder,
  account: Account,
  approvers: Approver[]
): boolean => {
  // فقط در وضعیت انتظار تأیید
  if (order.status !== OrderStatus.WaitingForOwnersApproval) return false;

  // باید از امضاکنندگان باشد
  if (!account.signerIds.includes(userId)) return false;

  // قبلاً تأیید یا رد نکرده باشد
  const approver = approvers.find((a) => a.userId === userId);
  if (!approver) return false;
  if (approver.hasApproved || approver.hasRejected) return false;

  return true;
};

/**
 * بررسی اینکه آیا کاربر می‌تواند رد کند
 */
export const canUserReject = (
  userId: string,
  order: PaymentOrder,
  account: Account,
  approvers: Approver[]
): boolean => {
  // همان شرایط تأیید
  return canUserApprove(userId, order, account, approvers);
};
