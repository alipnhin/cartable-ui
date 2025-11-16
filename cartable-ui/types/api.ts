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

// تایپ آیتم کارتابل (دستور پرداخت)
export interface CartableItem {
  id: string;
  orderId: string;
  providerCode: string;
  trackingId: string;
  name: string;
  description: string;
  sourceIban: string;
  bankGatewayId: string;
  tenantId: string;
  transactionsFee: number;
  bankCode: string;
  bankName: string;
  gatewayTitle: string;
  accountNumber: string;
  totalAmount: string;
  numberOfTransactions: string;
  status: string;
  createdDateTime: string;
  updatedDateTime: string;
}

// تایپ پاسخ لیست کارتابل
export type CartableListResponse = PaginatedResponse<CartableItem>;
