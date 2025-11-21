/**
 * Role-Based Access Control Configuration
 * تنظیمات کنترل دسترسی مبتنی بر نقش
 *
 * این فایل تمام نقش‌ها و دسترسی‌های برنامه را مدیریت می‌کند.
 * برای افزودن نقش جدید، کافیست نقش را به UserRole اضافه کرده و
 * تنظیمات مربوطه را در routePermissions و navigationPermissions تعریف کنید.
 *
 * @module config/permissions
 */

/**
 * User Roles
 * نقش‌های کاربری سیستم
 */
export enum UserRole {
  /** امضادار - دسترسی به کارتابل من */
  CARTABLE_APPROVER = "cartableapprover.role",

  /** مدیر - دسترسی به کارتابل مدیر و مدیریت حساب‌ها */
  CARTABLE_MANAGER = "cartableadmin.role",

  /** ادمین سیستم - دسترسی کامل */
  ADMIN = "Administrator",
}

/**
 * Page Access Configuration
 * تنظیمات دسترسی به صفحات
 */
export interface PageAccess {
  /** آیا صفحه نیاز به احراز هویت دارد؟ */
  requiresAuth: boolean;

  /** نقش‌های مجاز برای دسترسی به صفحه */
  allowedRoles?: UserRole[];

  /** آیا دسترسی به صفحه عمومی است؟ */
  isPublic?: boolean;
}

/**
 * Route Permissions Configuration
 * تنظیمات دسترسی مسیرها
 *
 * برای هر مسیر، مشخص می‌کند:
 * - آیا نیاز به احراز هویت دارد؟
 * - کدام نقش‌ها مجاز به دسترسی هستند؟
 * - آیا صفحه عمومی است؟
 */
export const routePermissions: Record<string, PageAccess> = {
  // صفحات عمومی - بدون نیاز به احراز هویت
  "/": {
    requiresAuth: false,
    isPublic: true,
  },

  "/auth/error": {
    requiresAuth: false,
    isPublic: true,
  },

  // داشبورد - نیاز به احراز هویت
  "/dashboard": {
    requiresAuth: true,
    allowedRoles: [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  },

  // کارتابل من - فقط برای امضادارها
  "/my-cartable": {
    requiresAuth: true,
    allowedRoles: [UserRole.CARTABLE_APPROVER, UserRole.ADMIN],
  },

  // کارتابل مدیر - فقط برای مدیران
  "/manager-cartable": {
    requiresAuth: true,
    allowedRoles: [UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  },

  // دستورهای پرداخت - برای همه کاربران احراز شده
  "/payment-orders": {
    requiresAuth: true,
    allowedRoles: [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  },

  // حساب‌ها - فقط برای مدیران
  "/accounts": {
    requiresAuth: true,
    allowedRoles: [UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  },

  // گزارشات - برای همه کاربران احراز شده
  "/reports": {
    requiresAuth: true,
    allowedRoles: [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  },

  // تنظیمات - برای همه کاربران احراز شده
  "/settings": {
    requiresAuth: true,
    allowedRoles: [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  },
};

/**
 * Navigation Permissions
 * تنظیمات نمایش منوها بر اساس نقش
 *
 * مشخص می‌کند کدام آیتم‌های منو برای کدام نقش‌ها نمایش داده شوند
 */
export const navigationPermissions: Record<string, UserRole[]> = {
  dashboard: [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  myCartable: [UserRole.CARTABLE_APPROVER, UserRole.ADMIN],
  managerCartable: [UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  paymentOrders: [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  accounts: [UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
  reports: [UserRole.CARTABLE_APPROVER, UserRole.CARTABLE_MANAGER, UserRole.ADMIN],
};

/**
 * Check if user has required role
 * بررسی اینکه آیا کاربر نقش مورد نیاز را دارد
 *
 * @param userRoles - نقش‌های کاربر
 * @param requiredRoles - نقش‌های مورد نیاز
 * @returns true اگر کاربر حداقل یکی از نقش‌های مورد نیاز را داشته باشد
 */
export function hasRequiredRole(
  userRoles: string[] | undefined,
  requiredRoles: UserRole[] | undefined
): boolean {
  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  return requiredRoles.some((role) => userRoles.includes(role));
}

/**
 * Check if user has access to route
 * بررسی دسترسی کاربر به یک مسیر
 *
 * @param pathname - مسیر صفحه
 * @param userRoles - نقش‌های کاربر
 * @param isAuthenticated - وضعیت احراز هویت کاربر
 * @returns true اگر کاربر دسترسی داشته باشد
 */
export function canAccessRoute(
  pathname: string,
  userRoles: string[] | undefined,
  isAuthenticated: boolean
): boolean {
  // پیدا کردن تنظیمات مسیر
  const routeConfig = Object.entries(routePermissions).find(([route]) =>
    pathname.startsWith(route) && route !== "/"
  )?.[1] || routePermissions["/"];

  // اگر صفحه عمومی است، دسترسی آزاد
  if (routeConfig.isPublic) {
    return true;
  }

  // اگر نیاز به احراز هویت دارد ولی کاربر احراز نشده
  if (routeConfig.requiresAuth && !isAuthenticated) {
    return false;
  }

  // بررسی نقش‌ها
  return hasRequiredRole(userRoles, routeConfig.allowedRoles);
}

/**
 * Check if user has minimum required role
 * بررسی اینکه آیا کاربر حداقل یکی از نقش‌های مجاز را دارد
 *
 * @param userRoles - نقش‌های کاربر
 * @returns true اگر کاربر حداقل یکی از نقش‌های cartable-approver یا cartable-manager را داشته باشد
 */
export function hasMinimumRole(userRoles: string[] | undefined): boolean {
  if (!userRoles || userRoles.length === 0) {
    return false;
  }

  const minimumRoles = [
    UserRole.CARTABLE_APPROVER,
    UserRole.CARTABLE_MANAGER,
    UserRole.ADMIN,
  ];

  return minimumRoles.some((role) => userRoles.includes(role));
}

/**
 * Get accessible menu items for user
 * دریافت آیتم‌های منو که کاربر به آن‌ها دسترسی دارد
 *
 * @param userRoles - نقش‌های کاربر
 * @returns لیست آیتم‌های منو که کاربر می‌تواند ببیند
 */
export function getAccessibleMenuItems(userRoles: string[] | undefined): string[] {
  if (!userRoles || userRoles.length === 0) {
    return [];
  }

  return Object.entries(navigationPermissions)
    .filter(([_, allowedRoles]) => hasRequiredRole(userRoles, allowedRoles))
    .map(([menuItem]) => menuItem);
}

/**
 * Permission Error Messages
 * پیام‌های خطا برای عدم دسترسی
 */
export const permissionErrors = {
  NOT_AUTHENTICATED: "برای دسترسی به این صفحه باید وارد سیستم شوید",
  INSUFFICIENT_PERMISSIONS: "شما دسترسی لازم برای مشاهده این صفحه را ندارید",
  INVALID_ROLE: "نقش شما برای این عملیات معتبر نیست",
  REQUIRES_APPROVER: "این صفحه فقط برای امضاداران قابل دسترسی است",
  REQUIRES_MANAGER: "این صفحه فقط برای مدیران قابل دسترسی است",
} as const;
