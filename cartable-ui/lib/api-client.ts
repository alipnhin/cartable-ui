import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { isValidationError, extractErrorMessage } from "@/types/api-error";

// Base URL برای API - از environment variable استفاده می‌شود
// در صورت عدم وجود، از مقدار پیش‌فرض استفاده می‌شود
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ecartableapi.etadbirco.ir/api";

// Timeout برای درخواست‌های API
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || "120000",
  10
);

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
  timeout: API_TIMEOUT,
});

// Interceptor برای اضافه کردن Authorization token و timestamp برای cache busting
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // در سمت کلاینت، توکن از session گرفته می‌شود
    // این کار در هر component که از API استفاده می‌کند انجام می‌شود

    // اضافه کردن timestamp به URL برای جلوگیری از cache
    // فقط برای GET requests
    // استثنا: endpoint های inquiry که با POST کار می‌کنند یا query parameter قبول نمی‌کنند
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
