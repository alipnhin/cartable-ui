/**
 * API Mappers
 * توابع تبدیل داده‌های API به تایپ‌های داخلی برنامه
 */

import { PaymentListDto, PaymentStatusEnum } from "@/types/api";
import { PaymentOrder, OrderStatus } from "@/types/order";

/**
 * تبدیل PaymentStatusEnum (از API) به OrderStatus (داخلی)
 * چون هر دو enum مقادیر عددی یکسان دارند، مستقیماً cast می‌کنیم
 */
function mapPaymentStatus(status: PaymentStatusEnum): OrderStatus {
  return status as unknown as OrderStatus;
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
