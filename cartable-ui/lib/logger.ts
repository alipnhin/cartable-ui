/**
 * Logger Utility
 * سیستم لاگینگ مرکزی برای برنامه
 * در محیط production به صورت خودکار غیرفعال می‌شود (توسط next.config.ts)
 */

const isDevelopment = process.env.NODE_ENV === "development";
const isDebugEnabled = process.env.NEXT_PUBLIC_DEBUG === "true";

/**
 * لاگ اطلاعات عمومی
 */
export const log = (...args: any[]) => {
  if (isDevelopment || isDebugEnabled) {
    console.log(...args);
  }
};

/**
 * لاگ اطلاعات مهم
 */
export const info = (...args: any[]) => {
  if (isDevelopment || isDebugEnabled) {
    console.info(...args);
  }
};

/**
 * لاگ هشدارها - همیشه نمایش داده می‌شود
 */
export const warn = (...args: any[]) => {
  console.warn(...args);
};

/**
 * لاگ خطاها - همیشه نمایش داده می‌شود
 */
export const error = (...args: any[]) => {
  console.error(...args);
};

/**
 * لاگ اطلاعات debug
 */
export const debug = (...args: any[]) => {
  if (isDevelopment && isDebugEnabled) {
    console.debug(...args);
  }
};

/**
 * Export default object برای استفاده راحت‌تر
 */
const logger = {
  log,
  info,
  warn,
  error,
  debug,
};

export default logger;
