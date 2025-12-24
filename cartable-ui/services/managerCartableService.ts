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
 * @param params پارامترهای فیلتر و صفحه‌بندی * @returns لیست دستورات پرداخت به صورت صفحه‌بندی شده
 */
export const getManagerCartable = async (
  params: CartableFilterParams
): Promise<PaymentListResponse> => {
  const {
    pageNumber = 1,
    pageSize = 10,
    orderBy = "createdDateTime",
    bankGatewayId,
    accountGroupId,
  } = params;

  const requestBody: any = {
    pageNumber,
    pageSize,
  };
  if (orderBy) requestBody.orderBy = orderBy;
  if (bankGatewayId) requestBody.bankGatewayId = bankGatewayId;
  if (accountGroupId && accountGroupId !== "all") {
    requestBody.accountGroupId = accountGroupId;
  }

  const response = await apiClient.post<PaymentListResponse>(
    `/ManagerCartable/manager-cartable`,
    requestBody
  );

  return response.data;
};

/**
 * ارسال کد OTP برای عملیات تکی (تایید یا لغو)
 * @param request درخواست شامل شناسه و نوع عملیات * @returns پیام موفقیت
 */
export const sendManagerOperationOtp = async (
  request: SendOperationOtpRequest
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/ManagerCartable/send-otp`,
    request
  );

  return response.data;
};

/**
 * تایید یا لغو تکی دستور پرداخت توسط مدیر
 * @param request درخواست شامل شناسه، نوع عملیات و کد OTP * @returns پیام موفقیت
 *
 * توجه: این عملیات ممکن است تا 60 ثانیه زمان ببرد (بسته به سرعت بانک)
 */
export const managerApprovePayment = async (
  request: ApproveRequest
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/ManagerCartable/Approve`,
    request,
    {
      timeout: 60000, // 60 ثانیه برای عملیات بانکی کند
    }
  );

  return response.data;
};

/**
 * ارسال کد OTP برای عملیات گروهی (تایید یا لغو)
 * @param request درخواست شامل لیست شناسه‌ها و نوع عملیات * @returns پیام موفقیت
 */
export const sendManagerBatchOperationOtp = async (
  request: SendBatchOperationOtpRequest
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/ManagerCartable/send-batch-otp`,
    request
  );

  return response.data;
};

/**
 * تایید یا لغو گروهی دستورات پرداخت توسط مدیر
 * @param request درخواست شامل لیست شناسه‌ها، نوع عملیات و کد OTP * @returns پیام موفقیت
 *
 * توجه: این عملیات ممکن است برای هر دستور تا 40 ثانیه زمان ببرد
 * برای 10 دستور: حدود 400 ثانیه (6-7 دقیقه)
 */
export const managerBatchApprovePayments = async (
  request: BatchApproveRequest
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/ManagerCartable/batch-approve`,
    request,
    {
      timeout: 420000, // 7 دقیقه (420 ثانیه) برای عملیات گروهی
    }
  );

  return response.data;
};
