/**
 * Order Utility Functions
 * توابع کمکی برای کار با دستورات پرداخت
 */

import type { WithdrawalOrderDetails } from "@/types/api";
import type { OrderStatus } from "@/types/order";

/**
 * نوع داده برای header کامپوننت
 */
export interface OrderForHeader {
  id: string;
  orderId: string;
  title: string;
  accountSheba: string;
  bankName: string;
  numberOfTransactions: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  description?: string;
  trackingId?: string;
  gatewayTitle?: string;
  accountTitle?: string;
  accountNumber?: string;
}

/**
 * تبدیل WithdrawalOrderDetails به فرمت مورد نیاز OrderDetailHeader
 *
 * این تابع type-safe است و از any استفاده نمی‌کند
 *
 * @param orderDetails - جزئیات دستور پرداخت از API
 * @returns داده‌های فرمت شده برای header
 *
 * @example
 * ```tsx
 * const orderForHeader = mapOrderDetailsToHeader(orderDetails);
 * <OrderDetailHeader order={orderForHeader} />
 * ```
 */
export function mapOrderDetailsToHeader(
  orderDetails: WithdrawalOrderDetails
): OrderForHeader {
  return {
    id: orderDetails.id,
    orderId: orderDetails.orderId,
    title: orderDetails.name,
    accountSheba: orderDetails.sourceIban,
    bankName: orderDetails.bankName,
    numberOfTransactions: parseInt(orderDetails.numberOfTransactions, 10),
    totalAmount: parseFloat(orderDetails.totalAmount),
    status: orderDetails.status, // Type-safe - هر دو PaymentStatusEnum هستند
    createdAt: orderDetails.createdDateTime,
    description: orderDetails.description,
    trackingId: orderDetails.trackingId,
    gatewayTitle: orderDetails.gatewayTitle,
    accountTitle: orderDetails.name,
    accountNumber: orderDetails.accountNumber,
  };
}
