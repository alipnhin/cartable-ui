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

/**
 * تایپ پارامترهای فیلتر کارتابل
 * همه فیلدها به جز pageNumber و pageSize اختیاری هستند
 */
export interface CartableFilterParams extends PaginationParams {
  /** کد پیگیری */
  trackingId?: string;
  /** شماره دستور */
  orderId?: string;
  /** نام دستور پرداخت */
  name?: string;
  /** شماره شبا */
  sourceIban?: string;
  /** شناسه درگاه بانکی */
  bankGatewayId?: string;
  /** شناسه گروه حساب - اگر null باشد یعنی همه گروه‌ها */
  accountGroupId?: string | null;
  /** وضعیت دستور پرداخت (به صورت رشته‌ای ارسال می‌شود) */
  status?: PaymentStatusEnum;
  /** از تاریخ (ISO 8601 format) */
  fromDate?: string;
  /** تا تاریخ (ISO 8601 format) */
  toDate?: string;
}

/**
 * Enum وضعیت پرداخت - مطابق با بک‌اند
 * مقادیر عددی باید دقیقاً مطابق با بک‌اند باشند
 */
export enum PaymentStatusEnum {
  /** در انتظار تائید امضاداران */
  WaitingForOwnersApproval = 0,
  /** تائید شده توسط امضاداران */
  OwnersApproved = 1,
  /** ارسال شده به بانک جهت پردازش */
  SubmittedToBank = 2,
  /** تراکنش با موفقیت انجام شده */
  BankSucceeded = 3,
  /** عدم تائید توسط امضا داران */
  OwnerRejected = 4,
  /** رد شده توسط بانک */
  BankRejected = 5,
  /** پیش نویس */
  Draft = 6,
  /** انجام شده با خطا */
  DoneWithError = 7,
  /** لغو شده */
  Canceled = 8,
  /** منقضی شده */
  Expired = 9,
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

/**
 * Enum نوع عملیات برای دریافت کد OTP
 */
export enum OperationTypeEnum {
  /** بدون عملیات */
  None = 0,
  /** تائید درخواست پرداخت */
  ApproveCartablePayment = 1,
  /** رد درخواست پرداخت */
  RejectCartablePayment = 2,
  /** فعال کردن امضادار */
  EnableGatewayUser = 3,
  /** غیرفعال کردن امضادار */
  DisableGatewayUser = 4,
  /** رد درخواست امضادار */
  RejectGatewayUser = 5,
}

/**
 * درخواست ارسال کد OTP برای عملیات تکی
 */
export interface SendOperationOtpRequest {
  /** شناسه دستور پرداخت */
  objectId: string;
  /** نوع عملیات */
  operation: OperationTypeEnum;
}

/**
 * درخواست تایید/رد تکی
 */
export interface ApproveRequest {
  /** نوع عملیات */
  operationType: OperationTypeEnum;
  /** شناسه دستور پرداخت */
  withdrawalOrderId: string;
  /** کد OTP */
  otpCode: string;
}

/**
 * درخواست ارسال کد OTP برای عملیات گروهی
 */
export interface SendBatchOperationOtpRequest {
  /** لیست شناسه‌های دستور پرداخت */
  objectIds: string[];
  /** نوع عملیات */
  operation: OperationTypeEnum;
}

/**
 * درخواست تایید/رد گروهی
 */
export interface BatchApproveRequest {
  /** لیست شناسه‌های دستور پرداخت */
  objectIds: string[];
  /** نوع عملیات */
  operationType: OperationTypeEnum;
  /** کد OTP */
  otpCode: string;
}

/**
 * Enum کد علت پرداخت - مقادیر API (PascalCase)
 * برای mapping به TransactionReasonEnum موجود
 */
export enum ReasonCodeApiEnum {
  InvestmentAndBourse = "InvestmentAndBourse",
  ImportGoods = "ImportGoods",
  SalaryAndWages = "SalaryAndWages",
  TaxAndDuties = "TaxAndDuties",
  LoanRepayment = "LoanRepayment",
  OtherPayments = "OtherPayments",
}

/**
 * Enum وضعیت تراکنش - مقادیر API (PascalCase)
 * برای mapping به TransactionStatus موجود
 */
export enum TransactionStatusApiEnum {
  Draft = "Draft",
  WaitForExecution = "WaitForExecution",
  WaitForBank = "WaitForBank",
  BankSucceeded = "BankSucceeded",
  BankFailed = "BankFailed",
  Canceled = "Canceled",
}

/**
 * Enum نوع پرداخت - مقادیر API (PascalCase)
 * برای mapping به PaymentMethodEnum موجود
 */
export enum PaymentTypeApiEnum {
  Paya = "Paya",
  Satna = "Satna",
  Rtgs = "Rtgs",
}

/**
 * Enum وضعیت تاییدکننده
 */
export enum ApproverStatusEnum {
  WaitForAction = "WaitForAction",
  Accepted = "Accepted",
  Rejected = "Rejected",
}

/**
 * تاریخچه تغییرات دستور پرداخت
 */
export interface WithdrawalChangeHistory {
  id: string;
  withdrawalOrderId: string;
  status: PaymentStatusEnum;
  createdDateTime: string;
  description: string;
}

/**
 * تاییدکننده دستور پرداخت
 */
export interface WithdrawalApprover {
  id: string;
  status: ApproverStatusEnum;
  approverId: string;
  userId: string | null;
  approverName: string;
  withdrawalOrderId: string;
  createdDateTime: string;
}

/**
 * جزئیات کامل دستور پرداخت
 */
export interface WithdrawalOrderDetails {
  id: string;
  orderId: string;
  providerCode: string;
  bankCode: string;
  bankName: string;
  gatewayTitle: string;
  accountNumber: string;
  trackingId: string;
  name: string;
  description: string;
  sourceIban: string;
  bankGatewayId: string;
  totalAmount: string;
  numberOfTransactions: string;
  transactionsFee: number;
  status: PaymentStatusEnum;
  createdDateTime: string;
  updatedDateTime: string;
  metaData: string;
  changeHistory: WithdrawalChangeHistory[];
  transactions: any[]; // معمولاً خالی است
  approvers: WithdrawalApprover[];
}

/**
 * آمار وضعیت
 */
export interface StatusBreakdown {
  status: TransactionStatusApiEnum;
  statusName: string;
  count: number;
  percentage: number;
  amount: number;
}

/**
 * آمار نوع پرداخت
 */
export interface PaymentTypeBreakdown {
  paymentType: PaymentTypeApiEnum;
  typeName: string;
  count: number;
  percentage: number;
  amount: number;
  successRate: number;
  averageAmount: number;
}

/**
 * آمار کد علت
 */
export interface ReasonCodeBreakdown {
  reasonCode: ReasonCodeApiEnum;
  reasonName: string;
  count: number;
  percentage: number;
  amount: number;
  successRate: number;
}

/**
 * آمار ساعتی
 */
export interface HourlyDistribution {
  hour: number;
  count: number;
  percentage: number;
}

/**
 * آمار کامل دستور پرداخت
 */
export interface WithdrawalStatistics {
  withdrawalOrderId: string;
  totalTransactions: number;
  totalAmount: number;
  successfulAmount: number;
  failedAmount: number;
  overallSuccessRate: number;
  statusStatistics: {
    breakdown: StatusBreakdown[];
    successRate: number;
    failureRate: number;
  };
  paymentTypeStatistics: {
    breakdown: PaymentTypeBreakdown[];
    mostUsedType: PaymentTypeApiEnum;
    mostUsedTypePercentage: number;
  };
  reasonCodeStatistics: {
    breakdown: ReasonCodeBreakdown[];
    mostUsedReason: ReasonCodeApiEnum;
    mostUsedReasonPercentage: number;
  };
  financialStatistics: {
    totalAmount: number;
    successfulAmount: number;
    failedAmount: number;
    pendingAmount: number;
    averageAmount: number;
    minAmount: number;
    maxAmount: number;
    medianAmount: number;
  };
  timeStatistics: {
    earliestTransaction: string;
    latestTransaction: string;
    lastUpdate: string;
    averageProcessingTimeMinutes: number;
    hourlyDistribution: HourlyDistribution[];
  };
}

/**
 * تاریخچه تغییرات تراکنش
 */
export interface TransactionChangeHistory {
  id: string;
  withdrawalTransactionId: string;
  description: string;
  status: TransactionStatusApiEnum;
  createdDateTime: string;
}

/**
 * تراکنش دستور پرداخت
 */
export interface WithdrawalTransaction {
  id: string;
  orderId: string;
  trackingId: string;
  destinationIban: string;
  nationalCode: string;
  accountNumber: string;
  destinationAccountOwner: string;
  ownerFirstName: string;
  ownerLastName: string;
  description: string;
  providerMessage: string;
  amount: string;
  paymentNumber: string;
  reasonCode: ReasonCodeApiEnum;
  rowNumber: number;
  status: TransactionStatusApiEnum;
  paymentType: PaymentTypeApiEnum;
  transferDateTime: string;
  createdDateTime: string;
  updatedDateTime: string;
  accountCode: string | null;
  withdrawalOrderId: string;
  metaData: string | null;
  changeHistory: TransactionChangeHistory[];
}

/**
 * پاسخ لیست تراکنش‌ها
 */
export type TransactionListResponse = PaginatedResponse<WithdrawalTransaction>;

/**
 * پارامترهای فیلتر تراکنش‌ها
 */
export interface TransactionFilterParams extends PaginationParams {
  /** شناسه دستور پرداخت (الزامی) */
  withdrawalOrderId: string;
  /** جستجو در تمام فیلدها */
  serchValue?: string;
  /** کد علت پرداخت */
  reasonCode?: ReasonCodeApiEnum;
  /** وضعیت تراکنش */
  status?: TransactionStatusApiEnum;
  /** نوع پرداخت */
  paymentType?: PaymentTypeApiEnum;
}

/**
 * پاسخ تعداد آیتم‌های منو
 * برای نمایش Badge در منوهای مختلف
 */
export interface MenuCountsResponse {
  /** تعداد دستورات در کارتابل من (در انتظار تایید من) */
  myCartableCount: number;
  /** تعداد دستورات در کارتابل مدیر (در انتظار تایید مدیر) */
  managerCartableCount: number;
  /** تعداد دستورات باز (Draft + WaitingForApproval + Approved + SubmittedToBank) */
  openPaymentOrdersCount: number;
}
