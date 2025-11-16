import apiClient from "@/lib/api-client";
import { PaymentListResponse, CartableFilterParams } from "@/types/api";

/**
 * سرویس دستورات پرداخت
 * شامل توابع مربوط به جستجو و واکشی تمامی دستورات پرداخت با فیلترهای پیشرفته
 */

/**
 * جستجو و واکشی لیست دستورات پرداخت با فیلترهای پیشرفته
 *
 * @param params پارامترهای فیلتر و صفحه‌بندی
 * @param accessToken توکن دسترسی کاربر
 * @returns لیست دستورات پرداخت به صورت صفحه‌بندی شده
 *
 * @example
 * // جستجوی ساده با صفحه‌بندی
 * const result = await searchPaymentOrders({
 *   pageNumber: 1,
 *   pageSize: 10
 * }, token);
 *
 * @example
 * // جستجو با فیلترهای پیشرفته
 * const result = await searchPaymentOrders({
 *   pageNumber: 1,
 *   pageSize: 10,
 *   status: PaymentStatusEnum.WaitingForOwnersApproval,
 *   fromDate: "2025-01-01T00:00:00.000Z",
 *   toDate: "2025-12-31T23:59:59.999Z"
 * }, token);
 */
export const searchPaymentOrders = async (
  params: CartableFilterParams,
  accessToken: string
): Promise<PaymentListResponse> => {
  const {
    pageNumber = 1,
    pageSize = 10,
    orderBy,
    trackingId,
    orderId,
    name,
    sourceIban,
    bankGatewayId,
    status,
    fromDate,
    toDate,
  } = params;

  // ساخت body برای درخواست POST
  // فقط فیلدهایی که مقدار دارند را اضافه می‌کنیم
  const requestBody: any = {
    pageNumber,
    pageSize,
  };

  // اضافه کردن فیلدهای اختیاری در صورت وجود
  if (orderBy) requestBody.orderBy = orderBy;
  if (trackingId) requestBody.trackingId = trackingId;
  if (orderId) requestBody.orderId = orderId;
  if (name) requestBody.name = name;
  if (sourceIban) requestBody.sourceIban = sourceIban;
  if (bankGatewayId) requestBody.bankGatewayId = bankGatewayId;
  if (status) requestBody.status = status; // enum به صورت string ارسال می‌شود
  if (fromDate) requestBody.fromDate = fromDate;
  if (toDate) requestBody.toDate = toDate;

  const response = await apiClient.post<PaymentListResponse>(
    `/v1-Cartable/Withdrawal/Search`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
