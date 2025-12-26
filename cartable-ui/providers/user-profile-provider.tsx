"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface UserProfile {
  fullName: string;
  email: string;
  image: string;
}

interface UserProfileContextValue {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

const UserProfileContext = createContext<UserProfileContextValue>({
  profile: null,
  isLoading: true,
  error: null,
});

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return context;
}

interface UserProfileProviderProps {
  children: ReactNode;
}

/**
 * Provider برای مدیریت profile کاربر
 * فقط یک بار fetch می‌کند و در تمام app قابل دسترسی است
 */
export function UserProfileProvider({ children }: UserProfileProviderProps) {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!session?.accessToken) {
        setIsLoading(false);
        return;
      }

      // اگر قبلاً fetch شده، دوباره fetch نکن
      if (hasFetched) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/user/profile", {
          method: "GET",
          cache: "force-cache", // profile کاربر - OK برای cache
          next: { revalidate: 3600 }, // 1 ساعت
        });

        if (response.ok) {
          const data = await response.json();
          setProfile({
            fullName:
              data.given_name && data.family_name
                ? `${data.given_name} ${data.family_name}`
                : data.name || session?.user?.name || "کاربر",
            email: data.email || session?.user?.email || "",
            image:
              data.picture ||
              session?.user?.image ||
              "/media/avatars/blank.png",
          });
        } else {
          // Fallback به session
          setProfile({
            fullName: session?.user?.name || "کاربر",
            email: session?.user?.email || "",
            image: session?.user?.image || "/media/avatars/blank.png",
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("خطا در دریافت اطلاعات کاربر");
        // Fallback به session
        setProfile({
          fullName: session?.user?.name || "کاربر",
          email: session?.user?.email || "",
          image: session?.user?.image || "/media/avatars/blank.png",
        });
      } finally {
        setHasFetched(true);
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [session?.accessToken, hasFetched]); // وابسته به accessToken و hasFetched

  return (
    <UserProfileContext.Provider value={{ profile, isLoading, error }}>
      {children}
    </UserProfileContext.Provider>
  );
}
