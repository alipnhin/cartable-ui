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
 * سرویس کارتابل
 * شامل توابع مربوط به واکشی و مدیریت دستورات پرداخت در کارتابل
 */

/**
 * واکشی لیست درخواست‌های در انتظار تائید امضادار
 * @param params پارامترهای فیلتر و صفحه‌بندی * @returns لیست دستورات پرداخت به صورت صفحه‌بندی شده
 */
export const getApproverCartable = async (
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
    `/Cartable/approver-cartable`,
    requestBody
  );

  return response.data;
};

/**
 * ارسال کد OTP برای عملیات تکی (تایید یا رد)
 * @param request درخواست شامل شناسه و نوع عملیات * @returns پیام موفقیت
 */
export const sendOperationOtp = async (
  request: SendOperationOtpRequest
): Promise<string> => {
  const response = await apiClient.post<string>(`/Cartable/send-otp`, request);

  return response.data;
};

/**
 * تایید یا رد تکی دستور پرداخت
 * @param request درخواست شامل شناسه، نوع عملیات و کد OTP * @returns پیام موفقیت
 *
 * توجه: این عملیات ممکن است تا 60 ثانیه زمان ببرد (بسته به سرعت بانک)
 */
export const approvePayment = async (
  request: ApproveRequest
): Promise<string> => {
  const response = await apiClient.post<string>(`/Cartable/approve`, request, {
    timeout: 60000, // 60 ثانیه برای عملیات بانکی کند
  });

  return response.data;
};

/**
 * ارسال کد OTP برای عملیات گروهی (تایید یا رد)
 * @param request درخواست شامل لیست شناسه‌ها و نوع عملیات * @returns پیام موفقیت
 */
export const sendBatchOperationOtp = async (
  request: SendBatchOperationOtpRequest
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/Cartable/send-batch-otp`,
    request
  );

  return response.data;
};

/**
 * تایید یا رد گروهی دستورات پرداخت
 * @param request درخواست شامل لیست شناسه‌ها، نوع عملیات و کد OTP * @returns پیام موفقیت
 *
 * توجه: این عملیات ممکن است برای هر دستور تا 40 ثانیه زمان ببرد
 * برای 10 دستور: حدود 400 ثانیه (6-7 دقیقه)
 */
export const batchApprovePayments = async (
  request: BatchApproveRequest
): Promise<string> => {
  const response = await apiClient.post<string>(
    `/Cartable/batch-approve`,
    request,
    {
      timeout: 420000, // 7 دقیقه (420 ثانیه) برای عملیات گروهی
    }
  );

  return response.data;
};
