/**
 * API Mappers
 * توابع تبدیل داده‌های API به تایپ‌های داخلی برنامه
 */

import { PaymentListDto, PaymentStatusEnum } from "@/types/api";
import { PaymentOrder, OrderStatus } from "@/types/order";

/**
 * تبدیل PaymentStatusEnum (از API) به OrderStatus (داخلی)
 */
function mapPaymentStatus(status: PaymentStatusEnum): OrderStatus {
  switch (status) {
    case PaymentStatusEnum.Draft:
      return OrderStatus.Draft;
    case PaymentStatusEnum.WaitingForOwnersApproval:
      return OrderStatus.WaitingForOwnersApproval;
    case PaymentStatusEnum.OwnersApproved:
      return OrderStatus.OwnersApproved;
    case PaymentStatusEnum.OwnerRejected:
      return OrderStatus.OwnerRejected;
    case PaymentStatusEnum.SubmittedToBank:
      return OrderStatus.SubmittedToBank;
    case PaymentStatusEnum.Succeeded:
      return OrderStatus.Succeeded;
    case PaymentStatusEnum.PartiallySucceeded:
      return OrderStatus.PartiallySucceeded;
    case PaymentStatusEnum.Rejected:
      return OrderStatus.Rejected;
    case PaymentStatusEnum.BankRejected:
      return OrderStatus.BankRejected;
    case PaymentStatusEnum.Canceled:
      return OrderStatus.Canceled;
    case PaymentStatusEnum.Expired:
      return OrderStatus.Expired;
    default:
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
