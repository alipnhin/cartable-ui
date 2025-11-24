/**
 * API Mappers
 * توابع تبدیل داده‌های API به تایپ‌های داخلی برنامه
 */

import { PaymentListDto } from "@/types/api";
import { PaymentOrder } from "@/types/order";

/**
 * تبدیل PaymentListDto (از API) به PaymentOrder (برای UI)
 * دیگر نیازی به تبدیل status نیست چون هر دو از PaymentStatusEnum استفاده می‌کنند
 */
export function mapPaymentListDtoToPaymentOrder(
  dto: PaymentListDto
): PaymentOrder {
  // Debug: log status value and type
  console.log('Payment Order Mapping:', {
    orderId: dto.orderId,
    status: dto.status,
    statusType: typeof dto.status,
    statusNumber: Number(dto.status)
  });

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
    status: dto.status, // استفاده مستقیم بدون تبدیل
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
