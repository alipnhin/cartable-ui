import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import axiosRetry, { isNetworkOrIdempotentRequestError } from "axios-retry";
import { isValidationError, extractErrorMessage } from "@/types/api-error";

// Base URL برای API - از environment variable استفاده می‌شود
// در صورت عدم وجود، از مقدار پیش‌فرض استفاده می‌شود
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ecartableapi.etadbirco.ir/api";

// Timeout های بهینه شده برای موبایل
// GET requests: تایم‌اوت کوتاه‌تر (معمولاً سریع‌تر هستند)
// POST/PUT/DELETE: تایم‌اوت بلندتر (ممکن است پردازش طولانی داشته باشند)
const API_TIMEOUT_GET = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT_GET || "20000", // 20 ثانیه برای GET
  10
);
const API_TIMEOUT_DEFAULT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", // 30 ثانیه برای بقیه
  10
);

// تنظیمات Retry
const RETRY_COUNT = parseInt(process.env.NEXT_PUBLIC_API_RETRY_COUNT || "3", 10);
const RETRY_DELAY = parseInt(process.env.NEXT_PUBLIC_API_RETRY_DELAY || "1000", 10);

// فعال‌سازی لاگ‌ها فقط در development
const isDevelopment = process.env.NODE_ENV === "development";

// متغیر برای جلوگیری از چندین درخواست refresh همزمان
let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

// اضافه کردن subscriber به لیست
const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

// اجرای همه subscriber ها بعد از refresh موفق
const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// ایجاد instance از axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
  timeout: API_TIMEOUT_DEFAULT,
});

// پیکربندی axios-retry با شرایط هوشمند
axiosRetry(apiClient, {
  retries: RETRY_COUNT,

  // استراتژی Exponential Backoff برای تأخیر بین تلاش‌ها
  retryDelay: (retryCount) => {
    const delay = Math.min(RETRY_DELAY * Math.pow(2, retryCount - 1), 10000);
    if (isDevelopment) {
      console.log(`Retry attempt ${retryCount}, waiting ${delay}ms...`);
    }
    return delay;
  },

  // شرایط هوشمند برای retry
  retryCondition: (error: AxiosError) => {
    // نوع خطا را بررسی می‌کنیم
    const status = error.response?.status;
    const code = error.code;

    // ❌ موارد زیر RETRY نمی‌شوند (خطاهای client-side یا منطقی):
    // - 400 Bad Request (داده نامعتبر)
    // - 401 Unauthorized (مدیریت توسط interceptor)
    // - 403 Forbidden (عدم دسترسی)
    // - 404 Not Found (منبع وجود ندارد)
    // - 422 Unprocessable Entity (validation error)
    if (status && [400, 401, 403, 404, 422].includes(status)) {
      return false;
    }

    // ✅ موارد زیر RETRY می‌شوند:
    // 1. خطاهای شبکه (network errors)
    if (isNetworkOrIdempotentRequestError(error)) {
      return true;
    }

    // 2. خطاهای 5xx سرور (server errors)
    if (status && status >= 500 && status < 600) {
      return true;
    }

    // 3. Timeout errors
    if (code === "ECONNABORTED" || code === "ETIMEDOUT") {
      return true;
    }

    // 4. Rate limiting (429 Too Many Requests) - با تأخیر بیشتر
    if (status === 429) {
      return true;
    }

    // بقیه موارد retry نمی‌شوند
    return false;
  },

  // فقط GET requests به صورت پیش‌فرض idempotent هستند
  // POST/PUT/DELETE ممکن است side-effect داشته باشند
  shouldResetTimeout: true,

  // Callback برای لاگ کردن retry ها در development
  onRetry: (retryCount, error, requestConfig) => {
    if (isDevelopment) {
      console.warn(
        `[Retry ${retryCount}/${RETRY_COUNT}] ${requestConfig.method?.toUpperCase()} ${requestConfig.url}`,
        error.message
      );
    }
  },
});

// Interceptor برای تنظیم timeout بر اساس method و اضافه کردن timestamp
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // تنظیم timeout بر اساس نوع درخواست
    if (config.method === "get") {
      config.timeout = API_TIMEOUT_GET;
    } else {
      config.timeout = API_TIMEOUT_DEFAULT;
    }

    // اضافه کردن timestamp به URL برای جلوگیری از cache
    // فقط برای GET requests
    if (config.method === "get" && config.url) {
      // لیست endpoint هایی که نباید timestamp اضافه شود
      const excludedPatterns = ["/exclude urls/"];

      const shouldExclude = excludedPatterns.some((pattern) =>
        config.url?.includes(pattern)
      );

      if (!shouldExclude) {
        const separator = config.url.includes("?") ? "&" : "?";
        config.url = `${config.url}${separator}_t=${Date.now()}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor برای مدیریت خطاها
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response) {
      // سرور پاسخ با status code خارج از 2xx داده
      const { status, data } = error.response;

      // لاگ فقط در development
      if (isDevelopment) {
        console.error(`API Error [${status}]:`, data);
      }

      // مدیریت خطاهای 400 (Validation & Bad Request)
      if (status === 400) {
        const errorData = data as any;

        // اگر خطای validation است
        if (isValidationError(errorData)) {
          const clientError = extractErrorMessage(errorData);

          if (isDevelopment) {
            console.error("Validation Errors:", clientError.validationErrors);
          }

          // اضافه کردن اطلاعات خطا به error object برای دسترسی در component
          return Promise.reject({
            ...error,
            isValidationError: true,
            validationErrors: clientError.validationErrors,
            clientMessage: clientError.message,
          });
        }

        // خطای عادی 400
        return Promise.reject({
          ...error,
          isValidationError: false,
          clientMessage: errorData.message || "درخواست نامعتبر است",
        });
      }

      // مدیریت 401 - Unauthorized
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // اگر در browser هستیم
        if (typeof window !== "undefined") {
          // اگر در حال refresh هستیم، صبر کن تا تمام شود
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              subscribeTokenRefresh(() => {
                // بعد از refresh موفق، reject می‌کنیم تا component دوباره درخواست را با توکن جدید بفرستد
                reject(error);
              });
            });
          }

          isRefreshing = true;

          if (isDevelopment) {
            console.warn(
              "Unauthorized: Token is invalid or expired - attempting refresh..."
            );
          }

          // dispatch event برای refresh توکن
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));

          // گوش دادن به event موفقیت refresh
          return new Promise((resolve, reject) => {
            const handleRefreshed = () => {
              isRefreshing = false;
              onRefreshed();
              window.removeEventListener(
                "auth:token-refreshed",
                handleRefreshed
              );
              window.removeEventListener("auth:refresh-failed", handleFailed);
              // بعد از refresh موفق، reject می‌کنیم تا component دوباره درخواست را با توکن جدید بفرستد
              reject(error);
            };

            const handleFailed = () => {
              isRefreshing = false;
              refreshSubscribers = [];
              window.removeEventListener(
                "auth:token-refreshed",
                handleRefreshed
              );
              window.removeEventListener("auth:refresh-failed", handleFailed);
              reject(error);
            };

            window.addEventListener("auth:token-refreshed", handleRefreshed, {
              once: true,
            });
            window.addEventListener("auth:refresh-failed", handleFailed, {
              once: true,
            });

            // اگر بعد از 10 ثانیه هنوز refresh نشد، fail کن
            setTimeout(() => {
              if (isRefreshing) {
                handleFailed();
              }
            }, 10000);
          });
        }
      }

      // سایر خطاهای HTTP
      return Promise.reject({
        ...error,
        clientMessage: (data as any)?.message || `خطای سرور: ${status}`,
      });
    } else if (error.request) {
      // درخواست ارسال شده ولی پاسخی دریافت نشده
      if (isDevelopment) {
        console.error("Network Error:", error.message);
      }

      return Promise.reject({
        ...error,
        clientMessage:
          "خطا در ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.",
      });
    } else {
      // خطای دیگر (مثلاً در تنظیمات درخواست)
      if (isDevelopment) {
        console.error("Request Setup Error:", error.message);
      }

      return Promise.reject({
        ...error,
        clientMessage: "خطا در ارسال درخواست",
      });
    }
  }
);

export default apiClient;
