import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
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
let refreshPromise: Promise<boolean> | null = null;
let resolveRefresh: ((value: boolean) => void) | null = null;

export const notifyTokenRefreshSuccess = () => {
  if (resolveRefresh) {
    resolveRefresh(true);
    resolveRefresh = null;
  }
};

export const notifyTokenRefreshFailed = () => {
  if (resolveRefresh) {
    resolveRefresh(false);
    resolveRefresh = null;
  }
};

type RefreshTokenCallback = () => Promise<void>;
let refreshTokenCallback: RefreshTokenCallback | null = null;

export const setRefreshTokenCallback = (callback: RefreshTokenCallback) => {
  refreshTokenCallback = callback;
};

let logoutCallback: (() => void) | null = null;

export const setLogoutCallback = (callback: () => void) => {
  logoutCallback = callback;
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
   Request Interceptor
========================= */

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.timeout =
    config.method === "get" ? API_TIMEOUT_GET : API_TIMEOUT_DEFAULT;

  // Authorization Header
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  // X-Request-Id for tracing
  if (config.headers) {
    config.headers["X-Request-Id"] = crypto.randomUUID();
  }

  // Idempotency-Key for POST/PUT/PATCH
  const method = config.method?.toLowerCase();
  if (
    method &&
    ["post", "put", "patch"].includes(method) &&
    config.headers
  ) {
    config.headers["Idempotency-Key"] = crypto.randomUUID();
  }

  // HTTPS guard in production
  if (
    process.env.NODE_ENV === "production" &&
    config.baseURL &&
    !config.baseURL.startsWith("https://")
  ) {
    throw new Error(
      `[SECURITY] Non-HTTPS URL blocked in production: ${config.baseURL}`
    );
  }

  return config;
}, Promise.reject);

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
        console.error(`API Error [${status}]`);
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
          clientMessage: (data as any) ?? "درخواست نامعتبر است",
        });
      }

      /* ---- 401 Unauthorized ---- */
      if (status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        if (typeof window === "undefined") {
          return Promise.reject(error);
        }

        if (isRefreshing && refreshPromise) {
          return refreshPromise.then((success) =>
            success ? apiClient(originalRequest) : Promise.reject(error)
          );
        }

        isRefreshing = true;

        refreshPromise = new Promise<boolean>((resolve) => {
          resolveRefresh = resolve;
        });

        if (refreshTokenCallback) {
          const timeoutId = setTimeout(() => {
            isRefreshing = false;
            refreshPromise = null;
            if (resolveRefresh) {
              resolveRefresh(false);
              resolveRefresh = null;
            }
            logoutCallback?.();
          }, 30000);

          refreshTokenCallback()
            .then(() => {
              clearTimeout(timeoutId);
              notifyTokenRefreshSuccess();
            })
            .catch(() => {
              clearTimeout(timeoutId);
              notifyTokenRefreshFailed();
              logoutCallback?.();
            });
        } else {
          isRefreshing = false;
          refreshPromise = null;
          if (resolveRefresh) {
            resolveRefresh(false);
            resolveRefresh = null;
          }
          logoutCallback?.();
        }

        return (refreshPromise ?? Promise.resolve(false)).then((success) =>
          success ? apiClient(originalRequest) : Promise.reject(error)
        );
      }

      /* ---- Other HTTP errors ---- */
      return Promise.reject({
        ...error,
        clientMessage: (data as any)?.message ?? `خطای سرور (${status})`,
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
