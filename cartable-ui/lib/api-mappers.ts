/**
 * API Mappers
 * توابع تبدیل داده‌های API به تایپ‌های داخلی برنامه
 */

import { CartableItem } from "@/types/api";
import { PaymentOrder, OrderStatus } from "@/types/order";

/**
 * تبدیل CartableItem (از API) به PaymentOrder (داخلی)
 */
export function mapCartableItemToPaymentOrder(
  item: CartableItem
): PaymentOrder {
  return {
    id: item.id,
    orderId: item.orderId,
    name: item.name,
    description: item.description,
    status: item.status as OrderStatus,
    sourceIban: item.sourceIban,
    accountNumber: item.accountNumber,
    bankCode: item.bankCode,
    bankName: item.bankName,
    gatewayTitle: item.gatewayTitle,
    totalAmount: parseFloat(item.totalAmount) || 0,
    numberOfTransactions: parseInt(item.numberOfTransactions) || 0,
    totalTransactions: parseInt(item.numberOfTransactions) || 0,
    transactionsFee: item.transactionsFee,
    trackingId: item.trackingId,
    createdDateTime: item.createdDateTime,
    updatedDateTime: item.updatedDateTime,
    providerCode: item.providerCode,
    bankGatewayId: item.bankGatewayId,
    tenantId: item.tenantId,
  };
}

/**
 * تبدیل لیست CartableItem به لیست PaymentOrder
 */
export function mapCartableItemsToPaymentOrders(
  items: CartableItem[]
): PaymentOrder[] {
  return items.map(mapCartableItemToPaymentOrder);
}
