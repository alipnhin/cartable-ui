/**
 * Error Handling Utilities
 *
 * این ماژول شامل توابع کمکی برای مدیریت خطاهای API است
 * و پیغام‌های خطا را از فرمت‌های مختلف سرور استخراج می‌کند
 */

/**
 * استخراج پیغام خطا از response سرور
 *
 * این تابع پیغام خطا را از فرمت‌های مختلف response استخراج می‌کند:
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
 * try {
 *   await apiCall();
 * } catch (error) {
 *   const message = getErrorMessage(error);
 *   toast.error(message);
 * }
 */
export function getErrorMessage(error: any): string {
  // اگر خطا axios error است
  if (error.response) {
    const response = error.response;

    // اگر پیغام مستقیم در data است
    if (typeof response.data === "string") {
      return response.data;
    }

    // اگر پیغام در فیلد message است
    if (response.data?.message) {
      return response.data.message;
    }

    // اگر پیغام در فیلد error است
    if (response.data?.error) {
      return response.data.error;
    }

    // اگر پیغام در فیلد title است (ASP.NET Core format)
    if (response.data?.title) {
      return response.data.title;
    }

    // اگر آرایه‌ای از errors است (validation errors)
    if (response.data?.errors && typeof response.data.errors === "object") {
      const errors = response.data.errors;
      const errorMessages = Object.keys(errors)
        .map((key) => {
          const messages = errors[key];
          return Array.isArray(messages) ? messages.join(", ") : messages;
        })
        .filter(Boolean)
        .join("; ");

      if (errorMessages) {
        return errorMessages;
      }
    }

    // اگر status code معلوم است
    if (response.status) {
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
  if (error.message) {
    return error.message;
  }

  // پیغام پیش‌فرض
  return "خطای نامشخص رخ داده است";
}
