/**
 * Navigation Configuration
 * تنظیمات منوی اصلی برنامه
 *
 * @module config/navigation
 */

import { AreaChart, UserCheck } from "lucide-react";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Wallet,
  ChartArea,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { canAccessRoute, UserRole } from "./permissions";

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  route: string;
  badge?: number;
  children?: MenuItem[];
}

/**
 * منوی کامل برنامه
 * در دسکتاپ: همه نمایش داده می‌شوند (sidebar)
 * در موبایل: فقط 5 تای اول در dock نمایش داده می‌شوند
 */
export const mainMenuItems: MenuItem[] = [
  {
    title: "dashboard",
    icon: LayoutDashboard,
    route: "/dashboard",
  },
  {
    title: "myCartable",
    icon: Inbox,
    route: "/my-cartable",
    badge: 8,
  },
  {
    title: "managerCartable",
    icon: UserCheck,
    route: "/manager-cartable",
    badge: 3,
  },
  {
    title: "paymentOrders",
    icon: FileText,
    route: "/payment-orders",
    badge: 5,
  },
  {
    title: "accounts",
    icon: Wallet,
    route: "/accounts",
  },
  {
    title: "reports",
    icon: ChartArea,
    route: "/reports",
  },
];

/**
 * منوی dock موبایل (همه آیتم‌ها)
 */
export const dockMenuItems = mainMenuItems;

/**
 * گرفتن آیتم منو بر اساس route
 */
export const getMenuItemByRoute = (route: string): MenuItem | undefined => {
  return mainMenuItems.find((item) => item.route === route);
};

/**
 * بررسی فعال بودن یک route
 */
export const isRouteActive = (
  currentPath: string,
  itemRoute: string
): boolean => {
  if (itemRoute === "/") return currentPath === "/";
  return currentPath.startsWith(itemRoute);
};

/**
 * فیلتر کردن آیتم‌های منو بر اساس نقش‌های کاربر
 *
 * @param userRoles - نقش‌های کاربر جاری
 * @param isAuthenticated - وضعیت احراز هویت کاربر
 * @returns آیتم‌های منویی که کاربر به آن‌ها دسترسی دارد
 *
 * @example
 * ```tsx
 * const { data: session } = useSession();
 * const userRoles = getUserRolesFromSession(session);
 * const filteredItems = getFilteredMenuItems(userRoles, !!session);
 * ```
 */
export const getFilteredMenuItems = (
  userRoles: string[],
  isAuthenticated: boolean
): MenuItem[] => {
  return mainMenuItems.filter((item) =>
    canAccessRoute(item.route, userRoles, isAuthenticated)
  );
};

/**
 * استخراج نقش‌های کاربر از session
 *
 * @param session - session object از NextAuth
 * @returns آرایه‌ای از نقش‌های کاربر
 *
 * @example
 * ```tsx
 * const { data: session } = useSession();
 * const userRoles = getUserRolesFromSession(session);
 * ```
 */
export const getUserRolesFromSession = (session: any): string[] => {
  if (!session?.accessToken) {
    return [];
  }

  try {
    // Decode JWT token to extract roles
    const tokenPayload = JSON.parse(
      Buffer.from(session.accessToken.split(".")[1], "base64").toString()
    );

    // Roles might be in 'role' or 'roles' claim
    const roles = tokenPayload.role || tokenPayload.roles || [];

    // Ensure it's always an array
    return Array.isArray(roles) ? roles : [roles];
  } catch (error) {
    console.error("Error extracting roles from session:", error);
    return [];
  }
};
