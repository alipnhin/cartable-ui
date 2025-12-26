// components/auth/AuthBootstrap.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";

export function AuthBootstrap() {
  const { data: session } = useSession();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    setAccessToken(session?.accessToken ?? null);
  }, [session?.accessToken, setAccessToken]);

  return null;
}
