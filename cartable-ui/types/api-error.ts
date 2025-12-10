/**
 * API Error Types
 * انواع خطاهای API
 */

/**
 * Validation Error Response از FluentValidation
 */
export interface ValidationErrorResponse {
  type: string;
  title: string;
  status: 400;
  errors: Record<string, string[]>;
  traceId?: string;
}

/**
 * Generic API Error Response
 */
export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
  traceId?: string;
}

/**
 * Client Error برای نمایش به کاربر
 */
export interface ClientError {
  message: string;
  validationErrors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Extended Axios Error با اطلاعات client-side
 */
export interface EnhancedApiError extends Error {
  isValidationError?: boolean;
  validationErrors?: Record<string, string[]>;
  clientMessage?: string;
  response?: {
    status: number;
    data: any;
  };
}

/**
 * بررسی اینکه آیا خطا یک validation error است
 */
export function isValidationError(error: any): error is ValidationErrorResponse {
  return (
    error &&
    typeof error === "object" &&
    error.status === 400 &&
    error.errors &&
    typeof error.errors === "object"
  );
}

/**
 * تبدیل validation errors به یک پیغام قابل نمایش
 */
export function formatValidationErrors(
  errors: Record<string, string[]>
): string {
  const messages: string[] = [];

  for (const [field, fieldErrors] of Object.entries(errors)) {
    if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
      // اگر فیلد camelCase باشد، تبدیل به فارسی خوانا
      const fieldName = formatFieldName(field);
      messages.push(`${fieldName}: ${fieldErrors.join(", ")}`);
    }
  }

  return messages.join("\n");
}

/**
 * تبدیل نام فیلد به فرمت خوانا
 */
function formatFieldName(field: string): string {
  // نقشه‌برداری فیلدهای رایج به فارسی
  const fieldMap: Record<string, string> = {
    PageNumber: "شماره صفحه",
    PageSize: "اندازه صفحه",
    ToDate: "تاریخ پایان",
    FromDate: "تاریخ شروع",
    NationalCode: "کد ملی",
    DestinationIban: "شبای مقصد",
    SourceIban: "شبای مبدا",
    TrackingId: "شناسه پیگیری",
    OrderId: "شناسه سفارش",
    OtpCode: "کد OTP",
    WithdrawalOrderId: "شناسه دستور برداشت",
  };

  return fieldMap[field] || field;
}

/**
 * استخراج پیغام خطا از response
 */
export function extractErrorMessage(error: any): ClientError {
  // اگر خطای validation است
  if (isValidationError(error)) {
    const formattedMessage = formatValidationErrors(error.errors);
    return {
      message: formattedMessage || "خطاهای اعتبارسنجی رخ داده است",
      validationErrors: error.errors,
      statusCode: 400,
    };
  }

  // اگر خطای معمولی با پیغام است
  if (error?.message) {
    return {
      message: error.message,
      statusCode: error.statusCode || error.status,
    };
  }

  // خطای پیش‌فرض
  return {
    message: "خطای نامشخص رخ داده است",
    statusCode: error?.status || 500,
  };
}
