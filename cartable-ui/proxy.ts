/**
 * Next.js Proxy for Authentication and Authorization
 * پروکسی Next.js برای احراز هویت و مجوزدهی
 *
 * این proxy در هر درخواست اجرا می‌شود و:
 * 1. وضعیت احراز هویت کاربر را بررسی می‌کند
 * 2. نقش‌های کاربر را از توکن استخراج می‌کند
 * 3. دسترسی به صفحات را بر اساس نقش کنترل می‌کند
 * 4. کاربران غیرمجاز را به صفحات مناسب هدایت می‌کند
 *
 * @module proxy
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

import { extractRolesFromToken } from "@/lib/jwt-utils";
import type { Session } from "next-auth";

/**
 * Extract user roles from session token
 * استخراج نقش‌های کاربر از توکن session
 *
 * @param session - نشست کاربر
 * @returns آرایه‌ای از نقش‌های کاربر
 */
function getUserRoles(session: Session | null): string[] {
  if (!session?.accessToken) {
    return [];
  }

  return extractRolesFromToken(session.accessToken);
}

/**
 * Proxy Configuration
 * تنظیمات proxy
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
 * Proxy Function
 * تابع اصلی proxy
 *
 * @param request - درخواست Next.js
 * @returns پاسخ Next.js (ادامه، هدایت یا خطا)
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get user session
  const session = await auth();
  const isAuthenticated = !!session?.user;
  const userRoles = getUserRoles(session);

  // صفحات عمومی که همیشه در دسترس هستند
  const publicPaths = ["/", "/auth/error", "/unauthorized"];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // صفحات خطا - همیشه در دسترس
  if (
    pathname.startsWith("/error") ||
    pathname.startsWith("/404") ||
    pathname.startsWith("/403") ||
    pathname.startsWith("/500")
  ) {
    return NextResponse.next();
  }

  // بررسی احراز هویت
  if (!isAuthenticated) {
    // اگر کاربر احراز هویت نشده، به صفحه لاگین هدایت شود
    const loginUrl = new URL("/", request.url);

    // فقط اگر pathname معتبر باشد و شامل // یا /pipe/ نباشد
    // (این مسیرها internal routes هستند که نباید در callbackUrl قرار بگیرند)
    if (
      pathname &&
      !pathname.startsWith("//") &&
      !pathname.includes("/pipe/") &&
      pathname !== "/"
    ) {
      loginUrl.searchParams.set("callbackUrl", pathname);
    }

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
