import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// Base URL برای API
const API_BASE_URL = "https://si-lab-tadbirpay.etadbir.com/api";

// ایجاد instance از axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Interceptor برای اضافه کردن Authorization token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // در سمت کلاینت، توکن از session گرفته می‌شود
    // این کار در هر component که از API استفاده می‌کند انجام می‌شود
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
  (error) => {
    if (error.response) {
      // سرور پاسخ با status code خارج از 2xx داده
      console.error("API Error:", error.response.data);

      // اگر 401 بود، یعنی unauthorized - token منقضی شده یا invalid است
      if (error.response.status === 401) {
        // فقط error را throw می‌کنیم و در component handle می‌شود
        // چون نمی‌توانیم اینجا signOut را صدا بزنیم
        console.error("Unauthorized: Token is invalid or expired");

        // اگر در browser هستیم، می‌توانیم یک custom event dispatch کنیم
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
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
