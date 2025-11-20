/**
 * Next.js Middleware for Authentication and Authorization
 * میان‌افزار Next.js برای احراز هویت و مجوزدهی
 *
 * این middleware در هر درخواست اجرا می‌شود و:
 * 1. وضعیت احراز هویت کاربر را بررسی می‌کند
 * 2. نقش‌های کاربر را از توکن استخراج می‌کند
 * 3. دسترسی به صفحات را بر اساس نقش کنترل می‌کند
 * 4. کاربران غیرمجاز را به صفحات مناسب هدایت می‌کند
 *
 * @module middleware
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  canAccessRoute,
  hasMinimumRole,
  routePermissions,
  UserRole,
} from "@/config/permissions";

/**
 * Extract user roles from session token
 * استخراج نقش‌های کاربر از توکن session
 *
 * @param session - نشست کاربر
 * @returns آرایه‌ای از نقش‌های کاربر
 */
function getUserRoles(session: any): string[] {
  if (!session?.accessToken) {
    return [];
  }

  try {
    // Parse JWT token to extract roles
    const tokenPayload = JSON.parse(
      Buffer.from(session.accessToken.split(".")[1], "base64").toString()
    );

    // Roles can be in different claim types depending on Identity Server config
    const roles =
      tokenPayload.role ||
      tokenPayload.roles ||
      tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      [];

    // Ensure roles is always an array
    return Array.isArray(roles) ? roles : [roles];
  } catch (error) {
    console.error("Error parsing user roles from token:", error);
    return [];
  }
}

/**
 * Middleware Configuration
 * تنظیمات middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - sw.js (service worker)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth|sw.js|workbox-.*|media).*)",
  ],
};

/**
 * Middleware Function
 * تابع اصلی middleware
 *
 * @param request - درخواست Next.js
 * @returns پاسخ Next.js (ادامه، هدایت یا خطا)
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user session
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRoles = getUserRoles(session);

  // صفحات عمومی که همیشه در دسترس هستند
  const publicPaths = ["/", "/auth/error", "/not-found", "/unauthorized"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // صفحات خطا - همیشه در دسترس
  if (pathname.startsWith("/error") || pathname.startsWith("/404") || pathname.startsWith("/403") || pathname.startsWith("/500")) {
    return NextResponse.next();
  }

  // بررسی احراز هویت
  if (!isAuthenticated) {
    // اگر کاربر احراز هویت نشده، به صفحه لاگین هدایت شود
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // بررسی حداقل نقش مورد نیاز
  if (!hasMinimumRole(userRoles)) {
    // کاربر احراز هویت شده ولی نقش مجاز ندارد
    return NextResponse.redirect(new URL("/403", request.url));
  }

  // بررسی دسترسی به مسیر خاص
  if (!canAccessRoute(pathname, userRoles, isAuthenticated)) {
    // کاربر دسترسی به این صفحه را ندارد
    return NextResponse.redirect(new URL("/403", request.url));
  }

  // اضافه کردن headers برای اطلاعات کاربر (اختیاری)
  const response = NextResponse.next();
  response.headers.set("x-user-roles", JSON.stringify(userRoles));
  response.headers.set("x-is-authenticated", isAuthenticated.toString());

  return response;
}
