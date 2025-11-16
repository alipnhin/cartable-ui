/**
 * API Types
 * تایپ‌های مربوط به درخواست و پاسخ API
 */

// تایپ پاسخ صفحه‌بندی شده
export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalPageCount: number;
  totalItemCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
  firstItemOnPage: number;
  lastItemOnPage: number;
}

// تایپ پارامترهای صفحه‌بندی
export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  orderBy?: string;
}

// تایپ پارامترهای فیلتر کارتابل
export interface CartableFilterParams extends PaginationParams {
  bankGatewayId?: string;
}

/**
 * Enum وضعیت پرداخت
 */
export enum PaymentStatusEnum {
  Draft = 0,
  WaitingForOwnersApproval = 1,
  OwnersApproved = 2,
  OwnerRejected = 3,
  SubmittedToBank = 4,
  Succeeded = 5,
  PartiallySucceeded = 6,
  Rejected = 7,
  BankRejected = 8,
  Canceled = 9,
  Expired = 10,
}

/**
 * Enum کد بانک
 */
export enum BankEnum {
  Mellat = 0,
  Saderat = 1,
  Tejarat = 2,
  Melli = 3,
  Sepah = 4,
  // سایر بانک‌ها را در صورت نیاز اضافه کنید
}

/**
 * مدل DTO لیست دستور پرداخت - مطابق با مدل سرور
 */
export interface PaymentListDto {
  id: string;
  orderId: string;
  /** کد بانک مبدا */
  providerCode: BankEnum;
  /** کد پیگیری ارائه شده از سوی بانک */
  trackingId: string;
  /** عنوان تراکنش */
  name: string;
  /** توضیحات دستور پرداخت */
  description: string;
  /** شماره شبای حساب مبدا */
  sourceIban: string;
  /** شناسه حساب تعریف شده در ادمین */
  bankGatewayId: string;
  tenantId: string;
  /** کارمزد تراکنش ها */
  transactionsFee: number;
  bankCode: string;
  bankName: string;
  gatewayTitle: string;
  accountNumber: string;
  /** مبلغ کل تراکنش */
  totalAmount: string;
  /** تعداد ردیف تراکنش */
  numberOfTransactions: string;
  status: PaymentStatusEnum;
  createdDateTime: string;
  updatedDateTime: string;
}

// تایپ پاسخ لیست دستورات پرداخت
export type PaymentListResponse = PaginatedResponse<PaymentListDto>;
