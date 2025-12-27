"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { motion } from "motion/react";
import Image from "next/image";
import { toAbsoluteUrl } from "@/lib/helpers";
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
        window.location.href = `${
          process.env.NEXT_PUBLIC_AUTH_ISSUER
        }/connect/endsession?${params.toString()}`;
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
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Image
              src={toAbsoluteUrl("/media/logo.png")}
              alt="App Logo"
              width={64}
              height={64}
              className="object-contain"
            />
          </div>
        </motion.div>
        <motion.h4
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl font-bold text-foreground mb-2"
        >
          در حال خروج...
        </motion.h4>
      </div>
    </div>
  );
}
