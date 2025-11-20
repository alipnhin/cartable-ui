import apiClient from "@/lib/api-client";
import {
  PaymentListResponse,
  CartableFilterParams,
  SendOperationOtpRequest,
  ApproveRequest,
  SendBatchOperationOtpRequest,
  BatchApproveRequest,
} from "@/types/api";

/**
 * سرویس کارتابل مدیر
 * شامل توابع مربوط به واکشی و مدیریت دستورات پرداخت در کارتابل مدیر
 *
 * توجه: در حال حاضر از API های کارتابل امضادار استفاده می‌شود
 * پس از آماده شدن API های مخصوص مدیر، URL ها باید تغییر کنند
 */

/**
 * واکشی لیست درخواست‌های در انتظار تائید مدیر
 * @param params پارامترهای فیلتر و صفحه‌بندی
 * @param accessToken توکن دسترسی کاربر
 * @returns لیست دستورات پرداخت به صورت صفحه‌بندی شده
 */
export const getManagerCartable = async (
  params: CartableFilterParams,
  accessToken: string
): Promise<PaymentListResponse> => {
  const {
    pageNumber = 1,
    pageSize = 10,
    orderBy = "createdDateTime",
    bankGatewayId,
  } = params;

  // ساخت query parameters
  const queryParams = new URLSearchParams({
    pageNumber: pageNumber.toString(),
    pageSize: pageSize.toString(),
    orderBy,
  });

  // اگر bankGatewayId وجود داشت، اضافه کن
  if (bankGatewayId) {
    queryParams.append("bankGatewayId", bankGatewayId);
  }

  // TODO: تغییر URL به endpoint مخصوص مدیر پس از آماده شدن API
  // فعلاً از endpoint کارتابل امضادار استفاده می‌شود
  const response = await apiClient.post<PaymentListResponse>(
    `/v1-Cartable/Approver/ApproverCartable?${queryParams.toString()}`,
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
 * ارسال کد OTP برای عملیات تکی (تایید یا لغو)
 * @param request درخواست شامل شناسه و نوع عملیات
 * @param accessToken توکن دسترسی کاربر
 * @returns پیام موفقیت
 */
export const sendManagerOperationOtp = async (
  request: SendOperationOtpRequest,
  accessToken: string
): Promise<string> => {
  // TODO: تغییر URL به endpoint مخصوص مدیر پس از آماده شدن API
  const response = await apiClient.post<string>(
    `/v1-Cartable/Approver/SendOperationOtp`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * تایید یا لغو تکی دستور پرداخت توسط مدیر
 * @param request درخواست شامل شناسه، نوع عملیات و کد OTP
 * @param accessToken توکن دسترسی کاربر
 * @returns پیام موفقیت
 */
export const managerApprovePayment = async (
  request: ApproveRequest,
  accessToken: string
): Promise<string> => {
  // TODO: تغییر URL به endpoint مخصوص مدیر پس از آماده شدن API
  const response = await apiClient.post<string>(
    `/v1-Cartable/Approver/Approve`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * ارسال کد OTP برای عملیات گروهی (تایید یا لغو)
 * @param request درخواست شامل لیست شناسه‌ها و نوع عملیات
 * @param accessToken توکن دسترسی کاربر
 * @returns پیام موفقیت
 */
export const sendManagerBatchOperationOtp = async (
  request: SendBatchOperationOtpRequest,
  accessToken: string
): Promise<string> => {
  // TODO: تغییر URL به endpoint مخصوص مدیر پس از آماده شدن API
  const response = await apiClient.post<string>(
    `/v1-Cartable/Approver/SendBatchOperationOtp`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};

/**
 * تایید یا لغو گروهی دستورات پرداخت توسط مدیر
 * @param request درخواست شامل لیست شناسه‌ها، نوع عملیات و کد OTP
 * @param accessToken توکن دسترسی کاربر
 * @returns پیام موفقیت
 */
export const managerBatchApprovePayments = async (
  request: BatchApproveRequest,
  accessToken: string
): Promise<string> => {
  // TODO: تغییر URL به endpoint مخصوص مدیر پس از آماده شدن API
  const response = await apiClient.post<string>(
    `/v1-Cartable/Approver/BatchApprove`,
    request,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response.data;
};
