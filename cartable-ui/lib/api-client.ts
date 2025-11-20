import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Base URL برای API - از environment variable استفاده می‌شود
// در صورت عدم وجود، از مقدار پیش‌فرض استفاده می‌شود
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://si-lab-tadbirpay.etadbir.com/api";

// Timeout برای درخواست‌های API
const API_TIMEOUT =
  parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "30000", 10);

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
  async (error) => {
    const originalRequest = error.config;

    if (error.response) {
      // سرور پاسخ با status code خارج از 2xx داده
      console.error("API Error:", error.response.data);

      // اگر 401 بود، یعنی unauthorized - token منقضی شده یا invalid است
      if (error.response.status === 401 && !originalRequest._retry) {
        // اگر در browser هستیم
        if (typeof window !== "undefined") {
          // اگر در حال refresh هستیم، صبر کن تا تمام شود
          if (isRefreshing) {
            return new Promise((resolve) => {
              subscribeTokenRefresh(() => {
                // بعد از refresh، درخواست اصلی باید با توکن جدید از session گرفته شود
                // این کار در component انجام می‌شود
                resolve(Promise.reject(error));
              });
            });
          }

          originalRequest._retry = true;
          isRefreshing = true;

          console.error("Unauthorized: Token is invalid or expired - attempting refresh...");

          // dispatch event برای refresh توکن
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));

          // گوش دادن به event موفقیت refresh
          return new Promise((resolve, reject) => {
            const handleRefreshed = () => {
              isRefreshing = false;
              onRefreshed();
              window.removeEventListener("auth:token-refreshed", handleRefreshed);
              // بعد از refresh موفق، کاربر باید درخواست را دوباره انجام دهد
              // چون توکن جدید از session گرفته می‌شود
              reject(error);
            };

            const handleFailed = () => {
              isRefreshing = false;
              refreshSubscribers = [];
              window.removeEventListener("auth:token-refreshed", handleRefreshed);
              reject(error);
            };

            window.addEventListener("auth:token-refreshed", handleRefreshed);

            // اگر بعد از 10 ثانیه هنوز refresh نشد، fail کن
            setTimeout(() => {
              handleFailed();
            }, 10000);
          });
        }
      }
    } else if (error.request) {
      // درخواست ارسال شده ولی پاسخی دریافت نشده
      console.error("Network Error:", error.request);
    } else {
      // خطای دیگر
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
