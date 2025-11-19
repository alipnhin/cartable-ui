"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

/**
 * کامپوننت برای handle کردن خطای 401 (Unauthorized)
 * وقتی token منقضی می‌شود یا invalid است، این کامپوننت تلاش می‌کند توکن را refresh کند
 * اگر refresh موفق نبود، logout می‌کند
 */
export function UnauthorizedHandler() {
  const { data: session, update } = useSession();

  useEffect(() => {
    const handleUnauthorized = async () => {
      console.log("Unauthorized event received - attempting to refresh token...");

      try {
        // تلاش برای refresh کردن session (این باعث فراخوانی jwt callback می‌شود)
        const newSession = await update();

        // اگر session خطا دارد یا accessToken ندارد، logout کن
        if (!newSession?.accessToken || newSession?.error === "RefreshAccessTokenError") {
          console.log("Token refresh failed - signing out...");
          await signOut({ callbackUrl: "/" });
        } else {
          console.log("Token refreshed successfully");
          // می‌توانید یک event برای retry کردن request dispatch کنید
          window.dispatchEvent(new CustomEvent("auth:token-refreshed"));
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        await signOut({ callbackUrl: "/" });
      }
    };

    // گوش دادن به event که از api-client dispatch می‌شود
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [update]);

  // بررسی خطای session در هر render
  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      console.log("Session has refresh token error - signing out...");
      signOut({ callbackUrl: "/" });
    }
  }, [session?.error]);

  return null; // این کامپوننت چیزی render نمی‌کند
}
