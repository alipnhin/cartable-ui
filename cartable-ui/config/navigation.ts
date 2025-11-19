/**
 * Navigation Configuration
 * تنظیمات منوی اصلی برنامه
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
 * منوی dock موبایل (5 آیتم اول)
 */
export const dockMenuItems = mainMenuItems.slice(0, 5);

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
