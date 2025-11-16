"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

/**
 * کامپوننت برای handle کردن خطای 401 (Unauthorized)
 * وقتی token منقضی می‌شود یا invalid است، این کامپوننت logout می‌کند
 */
export function UnauthorizedHandler() {
  useEffect(() => {
    const handleUnauthorized = async () => {
      console.log("Unauthorized event received - signing out...");
      // Logout کردن کاربر و redirect به صفحه اصلی
      await signOut({ callbackUrl: "/" });
    };

    // گوش دادن به event که از api-client dispatch می‌شود
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  return null; // این کامپوننت چیزی render نمی‌کند
}
