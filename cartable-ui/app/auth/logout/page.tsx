"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";

/**
 * Logout Page
 * این صفحه کاربر را از NextAuth و Identity Server خارج می‌کند
 */
export default function LogoutPage() {
  const { data: session } = useSession();

  useEffect(() => {
    const performLogout = async () => {
      // اگر session وجود دارد، ابتدا از Identity Server خارج شو
      if (session?.idToken) {
        const params = new URLSearchParams({
          id_token_hint: session.idToken,
          post_logout_redirect_uri: window.location.origin,
        });

        // Redirect به Identity Server logout endpoint
        window.location.href = `${process.env.NEXT_PUBLIC_AUTH_ISSUER}/connect/endsession?${params.toString()}`;
      } else {
        // اگر idToken نداریم، فقط از NextAuth خارج شو
        await signOut({ callbackUrl: "/" });
      }
    };

    performLogout();
  }, [session]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">در حال خروج...</p>
      </div>
    </div>
  );
}
