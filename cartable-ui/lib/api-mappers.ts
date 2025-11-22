/**
 * API Mappers
 * توابع تبدیل داده‌های API به تایپ‌های داخلی برنامه
 */

import { PaymentListDto, PaymentStatusEnum } from "@/types/api";
import { PaymentOrder, OrderStatus } from "@/types/order";

/**
 * تبدیل PaymentStatusEnum (از API) به OrderStatus (داخلی)
 */
function mapPaymentStatus(status: PaymentStatusEnum | string): OrderStatus {
  // تبدیل به lowercase برای مقایسه case-insensitive
  const statusStr = String(status).toLowerCase();

  switch (statusStr) {
    case "draft":
      return OrderStatus.Draft;
    case "waitingforownersapproval":
    case "waiting_for_owners_approval":
      return OrderStatus.WaitingForOwnersApproval;
    case "ownersapproved":
    case "owners_approved":
      return OrderStatus.OwnersApproved;
    case "ownerrejected":
    case "owner_rejected":
      return OrderStatus.OwnerRejected;
    case "submittedtobank":
    case "submitted_to_bank":
      return OrderStatus.SubmittedToBank;
    case "succeeded":
    case "banksucceeded":
    case "bank_succeeded":
      return OrderStatus.Succeeded;
    case "partiallysucceeded":
    case "partially_succeeded":
      return OrderStatus.PartiallySucceeded;
    case "rejected":
      return OrderStatus.Rejected;
    case "bankrejected":
    case "bank_rejected":
      return OrderStatus.BankRejected;
    case "canceled":
      return OrderStatus.Canceled;
    case "expired":
      return OrderStatus.Expired;
    default:
      console.warn(`Unknown payment status: ${status}, defaulting to Draft`);
      return OrderStatus.Draft;
  }
}

/**
 * تبدیل PaymentListDto (از API) به PaymentOrder (برای UI)
 */
export function mapPaymentListDtoToPaymentOrder(
  dto: PaymentListDto
): PaymentOrder {
  return {
    id: dto.id,
    orderId: dto.orderId,
    title: dto.name,
    accountId: dto.bankGatewayId,
    accountNumber: dto.accountNumber,
    accountSheba: dto.sourceIban,
    bankName: dto.bankName,
    numberOfTransactions: parseInt(dto.numberOfTransactions) || 0,
    totalAmount: parseFloat(dto.totalAmount) || 0,
    currency: "IRR",
    status: mapPaymentStatus(dto.status),
    createdBy: "",
    createdByName: "",
    createdAt: dto.createdDateTime,
    updatedAt: dto.updatedDateTime,
    description: dto.description,
    // فیلدهای اضافی برای UI
    orderNumber: dto.orderId,
    accountTitle: dto.bankName,
    totalTransactions: parseInt(dto.numberOfTransactions) || 0,
    createdDate: dto.createdDateTime,
    createdDateTime: dto.createdDateTime,
  };
}

/**
 * تبدیل لیست PaymentListDto به لیست PaymentOrder
 */
export function mapPaymentListDtosToPaymentOrders(
  dtos: PaymentListDto[]
): PaymentOrder[] {
  return dtos.map(mapPaymentListDtoToPaymentOrder);
}
