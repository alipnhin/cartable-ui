import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import axiosRetry from "axios-retry";
import { isValidationError, extractErrorMessage } from "@/types/api-error";

/* =========================
   Base Configuration
========================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://ecartableapi.etadbirco.ir/api";

const API_TIMEOUT_GET = Number(
  process.env.NEXT_PUBLIC_API_TIMEOUT_GET ?? 15000
);
const API_TIMEOUT_DEFAULT = Number(
  process.env.NEXT_PUBLIC_API_TIMEOUT ?? 25000
);

const isDev = process.env.NODE_ENV === "development";

/* =========================
   Token Refresh Control
========================= */

let isRefreshing = false;
let subscribers: Array<(ok: boolean) => void> = [];

const subscribe = (cb: (ok: boolean) => void) => subscribers.push(cb);
const notify = (ok: boolean) => {
  subscribers.forEach((cb) => cb(ok));
  subscribers = [];
};

/* =========================
   Axios Instance
========================= */

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_DEFAULT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",

    // ❗ سرویس مالی → هیچ کشی مجاز نیست
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

/* =========================
   Retry (Safe & Minimal)
========================= */

axiosRetry(apiClient, {
  retries: 1,
  retryDelay: () => 1000,

  retryCondition: (error: AxiosError) => {
    const method = error.config?.method?.toLowerCase();
    const status = error.response?.status;

    // فقط GET
    if (method !== "get") return false;

    // خطاهای منطقی
    if (status && [400, 401, 403, 404, 422].includes(status)) return false;

    // network / timeout / 5xx
    if (!error.response) return true;
    if (error.code === "ECONNABORTED") return true;
    if (status && status >= 500) return true;

    return false;
  },

  shouldResetTimeout: true,
});

/* =========================
   Request Interceptor
========================= */

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.timeout =
      config.method === "get"
        ? API_TIMEOUT_GET
        : API_TIMEOUT_DEFAULT;

    return config;
  },
  Promise.reject
);

/* =========================
   Response Interceptor
========================= */

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    /* ---------- Response exists ---------- */
    if (error.response) {
      const { status, data } = error.response;

      if (isDev) {
        console.error(`API Error [${status}]`, data);
      }

      /* ---- 400 (Validation / Bad Request) ---- */
      if (status === 400) {
        if (isValidationError(data)) {
          const parsed = extractErrorMessage(data);
          return Promise.reject({
            ...error,
            isValidationError: true,
            validationErrors: parsed.validationErrors,
            clientMessage: parsed.message,
          });
        }

        return Promise.reject({
          ...error,
          clientMessage: (data as any)?.message ?? "درخواست نامعتبر است",
        });
      }

    /* ---- 401 Unauthorized ---- */
if (status === 401 && originalRequest && !originalRequest._retry) {
  originalRequest._retry = true;

  if (typeof window === "undefined") {
    return Promise.reject(error);
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      subscribe((ok) =>
        ok
          ? resolve(apiClient(originalRequest))
          : reject(error)
      );
    });
  }

  isRefreshing = true;
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));

  return new Promise((resolve, reject) => {
    const onSuccess = () => {
      cleanup();
      notify(true);
      resolve(apiClient(originalRequest));
    };

    const onFail = () => {
      cleanup();
      notify(false);
      window.dispatchEvent(new CustomEvent("auth:logout"));
      reject(error);
    };

    const cleanup = () => {
      isRefreshing = false;
      window.removeEventListener("auth:token-refreshed", onSuccess);
      window.removeEventListener("auth:refresh-failed", onFail);
    };

    window.addEventListener("auth:token-refreshed", onSuccess, { once: true });
    window.addEventListener("auth:refresh-failed", onFail, { once: true });

    setTimeout(onFail, 10000);
  });
}


      /* ---- Other HTTP errors ---- */
      return Promise.reject({
        ...error,
        clientMessage:
          (data as any)?.message ?? `خطای سرور (${status})`,
      });
    }

    /* ---------- No response ---------- */
    if (error.request) {
      return Promise.reject({
        ...error,
        clientMessage:
          "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی کنید.",
      });
    }

    /* ---------- Setup error ---------- */
    return Promise.reject({
      ...error,
      clientMessage: "خطا در ارسال درخواست",
    });
  }
);

export default apiClient;
