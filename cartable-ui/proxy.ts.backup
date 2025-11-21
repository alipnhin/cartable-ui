import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // مسیرهای عمومی که نیاز به احراز هویت ندارند
  const publicPaths = [
    "/",
    "/auth/error",
    "/api/auth",
    "/_next",
    "/media",
    "/favicon.ico",
  ];

  // بررسی اینکه آیا مسیر فعلی عمومی است
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // اگر کاربر لاگین نکرده و مسیر private است، به صفحه اصلی هدایت شود
  if (!req.auth && !isPublicPath) {
    const homeUrl = new URL("/", req.url);
    homeUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(homeUrl);
  }

  // اگر کاربر لاگین کرده و به صفحه اصلی می‌رود، به dashboard هدایت شود
  if (req.auth && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
