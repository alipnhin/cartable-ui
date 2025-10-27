/**
 * Date Utilities
 * توابع کمکی برای کار با تاریخ (جلالی و میلادی)
 */

/**
 * تبدیل تاریخ به فرمت ISO string
 */
export const toISOString = (date: Date = new Date()): string => {
  return date.toISOString();
};

/**
 * گرفتن تاریخ فعلی
 */
export const now = (): string => {
  return new Date().toISOString();
};

/**
 * اضافه کردن روز به تاریخ
 */
export const addDays = (date: Date | string, days: number): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

/**
 * کم کردن روز از تاریخ
 */
export const subtractDays = (date: Date | string, days: number): string => {
  return addDays(date, -days);
};

/**
 * اضافه کردن ساعت به تاریخ
 */
export const addHours = (date: Date | string, hours: number): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  d.setHours(d.getHours() + hours);
  return d.toISOString();
};

/**
 * فرمت کردن تاریخ به فارسی
 */
export const formatPersianDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  // این یک implementation ساده است - در production باید از کتابخانه moment-jalaali استفاده کنید
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
};

/**
 * فرمت کردن تاریخ و زمان به فارسی
 */
export const formatPersianDateTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
};

/**
 * فرمت کردن زمان نسبی (مثلاً "2 ساعت پیش")
 */
export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) return `${years} سال پیش`;
  if (months > 0) return `${months} ماه پیش`;
  if (days > 0) return `${days} روز پیش`;
  if (hours > 0) return `${hours} ساعت پیش`;
  if (minutes > 0) return `${minutes} دقیقه پیش`;
  return "چند لحظه پیش";
};

/**
 * گرفتن تاریخ شروع روز
 */
export const startOfDay = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

/**
 * گرفتن تاریخ پایان روز
 */
export const endOfDay = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  d.setHours(23, 59, 59, 999);
  return d.toISOString();
};

/**
 * چک کردن اینکه آیا تاریخ در محدوده است
 */
export const isInRange = (
  date: Date | string,
  start: Date | string,
  end: Date | string
): boolean => {
  const d = typeof date === "string" ? new Date(date) : date;
  const s = typeof start === "string" ? new Date(start) : start;
  const e = typeof end === "string" ? new Date(end) : end;
  return d >= s && d <= e;
};

/**
 * گرفتن تاریخ رندوم بین دو تاریخ
 */
export const randomDate = (start: Date, end: Date): string => {
  const startTime = start.getTime();
  const endTime = end.getTime();
  const randomTime = startTime + Math.random() * (endTime - startTime);
  return new Date(randomTime).toISOString();
};

/**
 * محاسبه تفاوت روز بین دو تاریخ
 */
export const daysDiff = (date1: Date | string, date2: Date | string): number => {
  const d1 = typeof date1 === "string" ? new Date(date1) : date1;
  const d2 = typeof date2 === "string" ? new Date(date2) : date2;
  const diff = Math.abs(d1.getTime() - d2.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};
