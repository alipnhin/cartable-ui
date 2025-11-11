/**
 * Mock Signers & Approvers
 * امضاکنندگان و تأییدکنندگان
 */

import {
  OrderApprover,
  Signer,
  SignerStatus,
  OrderApproveStatus,
} from "@/types";
import { Account, PaymentOrder, OrderStatus } from "@/types";
import { getUserById } from "./mockUsers";
import { addHours } from "@/lib/date";

/**
 * تولید لیست تأییدکنندگان برای یک دستور
 */
export const generateApproversForOrder = (
  order: PaymentOrder,
  account: Account
): OrderApprover[] => {
  const approvers: OrderApprover[] = [];

  // تمام امضاکنندگان حساب به عنوان تأییدکننده
  account.signerIds.forEach((userId, index) => {
    const user = getUserById(userId);
    if (!user) return;

    let approveStatus: OrderApproveStatus = OrderApproveStatus.WaitForAction;

    if (
      order.status === OrderStatus.SubmittedToBank ||
      order.status === OrderStatus.OwnersApproved
    ) {
      if (index < account.minimumSignatureCount) {
        approveStatus = OrderApproveStatus.Accepted;
      }
    } else if (order.status === OrderStatus.OwnerRejected) {
      if (index < 1) {
        approveStatus = OrderApproveStatus.Rejected;
      }
    }

    const approver: OrderApprover = {
      approverName: user.fullName,
      status: approveStatus,
      createdDateTime: addHours(order.createdAt, 3),
      signerId: user.id,
      orderId: order.id,
      id: "1",
    };

    approvers.push(approver);
  });

  return approvers;
};

/**
 * بررسی اینکه آیا کاربر می‌تواند تأیید کند
 */
export const canUserApprove = (
  userId: string,
  order: PaymentOrder,
  account: Account,
  approvers: OrderApprover[]
): boolean => {
  // فقط در وضعیت انتظار تأیید
  if (order.status !== OrderStatus.WaitingForOwnersApproval) return false;

  // باید از امضاکنندگان باشد
  if (!account.signerIds.includes(userId)) return false;

  // قبلاً تأیید یا رد نکرده باشد
  const approver = approvers.find((a) => a.signerId === userId);
  if (!approver) return false;
  if (
    approver.status == OrderApproveStatus.Accepted ||
    approver.status == OrderApproveStatus.Rejected
  )
    return false;

  return true;
};

/**
 * بررسی اینکه آیا کاربر می‌تواند رد کند
 */
export const canUserReject = (
  userId: string,
  order: PaymentOrder,
  account: Account,
  approvers: OrderApprover[]
): boolean => {
  // همان شرایط تأیید
  return canUserApprove(userId, order, account, approvers);
};
