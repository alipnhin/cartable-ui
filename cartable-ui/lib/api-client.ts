import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { isValidationError, extractErrorMessage } from "@/types/api-error";
import { useAuthStore } from "@/store/auth.store";

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
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(null)));
  failedQueue = [];
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

  // 🔐 Authorization from store (SYNC)
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // X-Request-Id
  if (config.headers) {
    config.headers["X-Request-Id"] = crypto.randomUUID();
  }

  // Idempotency-Key
  const method = config.method?.toLowerCase();
  if (method && ["post", "put", "patch"].includes(method) && config.headers) {
    config.headers["Idempotency-Key"] = crypto.randomUUID();
  }

  // HTTPS guard
  if (
    process.env.NODE_ENV === "production" &&
    config.baseURL &&
    !config.baseURL.startsWith("https://")
  ) {
    throw new Error(`[SECURITY] Non-HTTPS URL blocked: ${config.baseURL}`);
  }

  return config;
}, Promise.reject);

/* =========================
   Response Interceptor
========================= */

const MAX_RETRIES = 1;

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & {
          _retry?: boolean;
          _retryCount?: number;
        })
      | undefined;

    if (originalRequest) {
      originalRequest._retryCount ??= 0;
    }

    if (error.response) {
      const { status, data } = error.response;

      /* ---- 400 ---- */
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
          clientMessage: (data as any) ?? "درخواست نامعتبر",
        });
      }

      /* ---- 401 ---- */
      if (
        status === 401 &&
        originalRequest &&
        !originalRequest._retry &&
        (originalRequest._retryCount ?? 0) < MAX_RETRIES &&
        typeof window !== "undefined"
      ) {
        originalRequest._retry = true;
        originalRequest._retryCount = (originalRequest._retryCount ?? 0) + 1;

        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => apiClient(originalRequest));
        }

        isRefreshing = true;
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));

        return new Promise((resolve, reject) => {
          const cleanup = () => {
            window.removeEventListener("auth:token-refreshed", onSuccess);
            window.removeEventListener("auth:refresh-failed", onFail);
          };

          const onSuccess = () => {
            cleanup();
            isRefreshing = false;
            processQueue(null);
            resolve(apiClient(originalRequest));
          };

          const onFail = () => {
            cleanup();
            isRefreshing = false;
            processQueue(error);
            reject(error);
          };

          window.addEventListener("auth:token-refreshed", onSuccess, {
            once: true,
          });
          window.addEventListener("auth:refresh-failed", onFail, {
            once: true,
          });

          setTimeout(onFail, 30000);
        });
      }

      return Promise.reject({
        ...error,
        clientMessage: (data as any)?.message ?? `خطای سرور (${status})`,
      });
    }

    return Promise.reject({
      ...error,
      clientMessage: "ارتباط با سرور برقرار نشد",
    });
  }
);

export default apiClient;
