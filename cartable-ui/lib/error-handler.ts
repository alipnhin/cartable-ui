/**
 * Error Handling Utilities
 *
 * این ماژول شامل توابع کمکی برای مدیریت خطاهای API است
 * و پیغام‌های خطا را از فرمت‌های مختلف سرور استخراج می‌کند
 */

import {
  EnhancedApiError,
  formatValidationErrors,
} from "@/types/api-error";

/**
 * Type guard to check if error is an axios-like error
 * بررسی اینکه آیا خطا از نوع axios error است
 */
function isAxiosError(error: unknown): error is {
  response?: {
    data?: unknown;
    status?: number;
  };
  request?: unknown;
  message?: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "request" in error || "message" in error)
  );
}

/**
 * Type guard to check if error is an enhanced API error
 * بررسی اینکه آیا خطا از نوع EnhancedApiError است
 */
function isEnhancedApiError(error: unknown): error is EnhancedApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    ("clientMessage" in error || "isValidationError" in error)
  );
}

/**
 * Type guard to check if value is a record
 * بررسی اینکه آیا مقدار یک object است
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * استخراج پیغام خطا از response سرور
 *
 * این تابع پیغام خطا را از فرمت‌های مختلف response استخراج می‌کند:
 * - clientMessage (اضافه شده توسط interceptor)
 * - validation errors (خطاهای اعتبارسنجی FluentValidation)
 * - رشته مستقیم در response.data
 * - فیلد message (فرمت استاندارد)
 * - فیلد error (فرمت جایگزین)
 * - فیلد title (فرمت ASP.NET Core)
 * - آرایه errors (validation errors)
 * - پیغام‌های پیش‌فرض بر اساس status code
 * - خطاهای شبکه (network errors)
 *
 * @param error - خطای دریافتی از API (معمولاً از Axios)
 * @returns پیغام خطا به زبان فارسی برای نمایش به کاربر
 *
 * @example
 * ```ts
 * try {
 *   await apiCall();
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 * ```
 */
export function getErrorMessage(error: unknown): string {
  // اگر Enhanced API Error است (اضافه شده توسط interceptor)
  if (isEnhancedApiError(error)) {
    // اگر clientMessage وجود دارد، از آن استفاده کن
    if (error.clientMessage) {
      return error.clientMessage;
    }

    // اگر validation error است
    if (error.isValidationError && error.validationErrors) {
      return formatValidationErrors(error.validationErrors);
    }
  }

  // Check if error is axios-like error
  if (!isAxiosError(error)) {
    // If it's a simple error with message
    if (isRecord(error) && typeof error.message === "string") {
      return error.message;
    }
    // If it's a string
    if (typeof error === "string") {
      return error;
    }
    // Default message for unknown errors
    return "خطای نامشخص رخ داده است";
  }

  // اگر خطا axios error است
  if (error.response) {
    const response = error.response;

    // اگر پیغام مستقیم در data است
    if (typeof response.data === "string") {
      return response.data;
    }

    // Check if data is a record
    if (isRecord(response.data)) {
      // اگر پیغام در فیلد message است
      if (typeof response.data.message === 'string') {
        return response.data.message;
      }

      // اگر پیغام در فیلد error است
      if (typeof response.data.error === 'string') {
        return response.data.error;
      }

      // اگر پیغام در فیلد title است (ASP.NET Core format)
      if (typeof response.data.title === 'string') {
        return response.data.title;
      }

      // اگر آرایه‌ای از errors است (validation errors)
      if (isRecord(response.data.errors)) {
        const errors = response.data.errors;
        const errorMessages = Object.keys(errors)
          .map((key) => {
            const messages = errors[key];
            if (Array.isArray(messages)) {
              return messages.filter((msg): msg is string => typeof msg === 'string').join(", ");
            }
            return typeof messages === 'string' ? messages : '';
          })
          .filter(Boolean)
          .join("; ");

        if (errorMessages) {
          return errorMessages;
        }
      }
    }

    // اگر status code معلوم است
    if (typeof response.status === 'number') {
      switch (response.status) {
        case 400:
          return "درخواست نامعتبر است";
        case 401:
          return "احراز هویت ناموفق - لطفاً مجدداً وارد شوید";
        case 403:
          return "شما مجوز انجام این عملیات را ندارید";
        case 404:
          return "اطلاعات مورد نظر یافت نشد";
        case 500:
          return "خطای سرور - لطفاً با پشتیبانی تماس بگیرید";
        default:
          return `خطای ${response.status}`;
      }
    }
  }

  // اگر خطای شبکه است
  if (error.request) {
    return "خطای ارتباط با سرور - اتصال اینترنت خود را بررسی کنید";
  }

  // اگر پیغام خطا مستقیماً وجود دارد
  if (typeof error.message === 'string') {
    return error.message;
  }

  // پیغام پیش‌فرض
  return "خطای نامشخص رخ داده است";
}

/**
 * بررسی اینکه آیا خطا یک validation error است
 */
export function isValidationErrorFn(error: unknown): boolean {
  const enhancedError = error as EnhancedApiError;
  return enhancedError.isValidationError === true;
}

/**
 * دریافت validation errors به صورت object
 */
export function getValidationErrors(
  error: unknown
): Record<string, string[]> | undefined {
  const enhancedError = error as EnhancedApiError;
  return enhancedError.validationErrors;
}

/**
 * دریافت لیست تمام پیغام‌های validation error
 *
 * @example
 * ```ts
 * const messages = getValidationErrorMessages(error);
 * messages.forEach(msg => toast.error(msg));
 * ```
 */
export function getValidationErrorMessages(error: unknown): string[] {
  const validationErrors = getValidationErrors(error);
  if (!validationErrors) return [];

  const messages: string[] = [];
  for (const fieldErrors of Object.values(validationErrors)) {
    if (Array.isArray(fieldErrors)) {
      messages.push(...fieldErrors);
    }
  }
  return messages;
}

/**
 * چک کردن اینکه آیا خطا مربوط به یک فیلد خاص است
 *
 * @example
 * ```ts
 * if (hasFieldError(error, 'ToDate')) {
 *   // نمایش خطا برای فیلد ToDate
 * }
 * ```
 */
export function hasFieldError(error: unknown, fieldName: string): boolean {
  const validationErrors = getValidationErrors(error);
  if (!validationErrors) return false;
  return fieldName in validationErrors;
}

/**
 * دریافت پیغام خطای یک فیلد خاص
 *
 * @example
 * ```ts
 * const toDateError = getFieldError(error, 'ToDate');
 * if (toDateError) {
 *   setFieldError('toDate', toDateError);
 * }
 * ```
 */
export function getFieldError(
  error: unknown,
  fieldName: string
): string | undefined {
  const validationErrors = getValidationErrors(error);
  if (!validationErrors || !(fieldName in validationErrors)) return undefined;

  const fieldErrors = validationErrors[fieldName];
  return Array.isArray(fieldErrors) && fieldErrors.length > 0
    ? fieldErrors[0]
    : undefined;
}
