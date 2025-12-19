import apiClient from "@/lib/api-client";
import {
  PaymentListResponse,
  CartableFilterParams,
  WithdrawalOrderDetails,
  WithdrawalStatistics,
  TransactionListResponse,
  TransactionFilterParams,
  WithdrawalTransaction,
} from "@/types/api";

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
    accountGroupId,
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
  // اگر accountGroupId وجود داشت و "all" نبود، اضافه کن
  // اگر "all" باشد یا undefined، null ارسال می‌شود
  if (accountGroupId && accountGroupId !== "all") {
    requestBody.accountGroupId = accountGroupId;
  }
  if (status) requestBody.status = status; // enum به صورت string ارسال می‌شود
  if (fromDate) requestBody.fromDate = fromDate;
  if (toDate) requestBody.toDate = toDate;

  const response = await apiClient.post<PaymentListResponse>(
    `/PaymentOrders/search`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * دریافت جزئیات کامل دستور پرداخت
 *
 * @param id شناسه دستور پرداخت
 * @param accessToken توکن دسترسی کاربر
 * @returns جزئیات کامل دستور پرداخت شامل تاییدکنندگان و تاریخچه
 */
export const getWithdrawalOrderDetails = async (
  id: string,
  accessToken: string
): Promise<WithdrawalOrderDetails> => {
  const response = await apiClient.get<WithdrawalOrderDetails>(
    `/PaymentOrders/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * دریافت آمار کامل دستور پرداخت
 *
 * @param id شناسه دستور پرداخت
 * @param accessToken توکن دسترسی کاربر
 * @returns آمار کامل شامل وضعیت، نوع پرداخت، کد علت و آمار مالی
 */
export const getWithdrawalStatistics = async (
  id: string,
  accessToken: string
): Promise<WithdrawalStatistics> => {
  const response = await apiClient.get<WithdrawalStatistics>(
    `/PaymentOrders/${id}/statistics`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * دریافت لیست تراکنش‌های دستور پرداخت با فیلترهای پیشرفته
 *
 * @param params پارامترهای فیلتر و صفحه‌بندی
 * @param accessToken توکن دسترسی کاربر
 * @returns لیست تراکنش‌ها به صورت صفحه‌بندی شده
 */
export const getWithdrawalTransactions = async (
  params: TransactionFilterParams,
  accessToken: string
): Promise<TransactionListResponse> => {
  const {
    withdrawalOrderId,
    pageNumber = 1,
    pageSize = 10,
    orderBy,
    serchValue,
    reasonCode,
    status,
    paymentType,
  } = params;

  // ساخت body برای درخواست POST
  const requestBody: any = {
    withdrawalOrderId,
    pageNumber,
    pageSize,
  };

  // اضافه کردن فیلدهای اختیاری
  if (orderBy) requestBody.orderBy = orderBy;
  if (serchValue) requestBody.serchValue = serchValue;
  if (reasonCode) requestBody.reasonCode = reasonCode;
  if (status) requestBody.status = status;
  if (paymentType) requestBody.paymentType = paymentType;

  const response = await apiClient.post<TransactionListResponse>(
    `/PaymentOrders/transactions`,
    requestBody,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * دریافت جزئیات یک تراکنش
 *
 * @param transactionId شناسه تراکنش
 * @param accessToken توکن دسترسی کاربر
 * @returns جزئیات کامل تراکنش شامل تاریخچه تغییرات
 */
export const getTransactionDetails = async (
  transactionId: string,
  accessToken: string
): Promise<WithdrawalTransaction> => {
  const response = await apiClient.get<WithdrawalTransaction>(
    `/v1-Cartable/Withdrawal/FindTransaction/${transactionId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * استعلام دستور پرداخت
 * بعد از فراخوانی موفق، باید اطلاعات صفحه ریلود شود
 *
 * @param orderId شناسه دستور پرداخت
 * @param accessToken توکن دسترسی کاربر
 * @returns وضعیت 200 در صورت موفقیت
 */
export const inquiryOrderById = async (
  orderId: string,
  accessToken: string
): Promise<void> => {
  await apiClient.get(`/PaymentOrders/${orderId}/inquiry`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

/**
 * استعلام تراکنش
 * بعد از فراخوانی موفق، باید لیست تراکنش‌ها refresh شود
 *
 * @param transactionId شناسه تراکنش
 * @param accessToken توکن دسترسی کاربر
 * @returns اطلاعات به‌روز شده تراکنش
 */
export const inquiryTransactionById = async (
  transactionId: string,
  accessToken: string
): Promise<WithdrawalTransaction> => {
  const response = await apiClient.get<WithdrawalTransaction>(
    `/PaymentOrders/transactions/${transactionId}/inquiry`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * ارسال دستور پرداخت به بانک
 * این عملیات فقط برای دستورات با وضعیت OwnersApproved قابل انجام است
 *
 * @param orderId شناسه دستور پرداخت
 * @param accessToken توکن دسترسی کاربر
 * @returns پیام موفقیت
 */
export const sendToBank = async (
  orderId: string,
  accessToken: string
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/PaymentOrders/${orderId}/send-to-bank`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * دانلود فایل اکسل تراکنش‌های دستور پرداخت
 *
 * @param orderId شناسه دستور پرداخت
 * @param accessToken توکن دسترسی کاربر
 * @param signal AbortSignal برای لغو درخواست
 * @returns فایل اکسل به صورت Blob
 */
export const exportOrderTransactionsToExcel = async (
  orderId: string,
  accessToken: string,
  signal?: AbortSignal
): Promise<Blob> => {
  const response = await apiClient.post(
    `/PaymentOrders/${orderId}/transactions/export`,
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: "blob",
      signal, // Add abort signal support
    }
  );

  return response.data;
};

/**
 * Helper to download blob as file
 */
export const downloadBlobAsFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
