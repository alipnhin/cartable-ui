import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { AccountGroup } from "@/types/account-group-types";

// کلیدهای قدیمی برای migration
const OLD_STORAGE_KEYS = [
  "selected-account-group-data",
  "selected-account-group",
];

interface AccountGroupState {
  // State
  selectedGroup: AccountGroup | null;
  accountGroups: AccountGroup[]; // لیست تمام گروه‌ها
  refreshKey: number;
  isHydrated: boolean;
  userId: string | null;

  // Actions
  setSelectedGroup: (group: AccountGroup) => void;
  setAccountGroups: (groups: AccountGroup[]) => void;
  setUserId: (userId: string | null) => void;
  triggerRefresh: () => void;
  clearStorage: () => void;
  _setHasHydrated: (state: boolean) => void;
}

/**
 * دریافت کلید storage با توجه به userId
 * هر کاربر کلید مخصوص به خودش را دارد
 */
const getStorageKey = (userId: string | null): string => {
  if (!userId) {
    return "account-group-store"; // fallback برای حالتی که userId هنوز set نشده
  }
  return `account-group-store:${userId}`;
};

/**
 * پاک کردن کلیدهای قدیمی و migration
 */
const cleanupOldKeys = () => {
  if (typeof window === "undefined") return;

  OLD_STORAGE_KEYS.forEach((key) => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        console.log(`[AccountGroupStore] Removing old storage key: ${key}`);
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`[AccountGroupStore] Error cleaning up key ${key}:`, error);
    }
  });
};

/**
 * Custom storage که user-scoped است
 */
const createUserScopedStorage = () => {
  let currentUserId: string | null = null;

  return {
    getItem: (name: string) => {
      const key = getStorageKey(currentUserId);
      const value = localStorage.getItem(key);
      return value;
    },
    setItem: (name: string, value: string) => {
      const key = getStorageKey(currentUserId);
      localStorage.setItem(key, value);
    },
    removeItem: (name: string) => {
      const key = getStorageKey(currentUserId);
      localStorage.removeItem(key);
    },
    // این متد توسط store استفاده می‌شود برای update کردن userId
    updateUserId: (userId: string | null) => {
      currentUserId = userId;
    },
  };
};

const userScopedStorage = createUserScopedStorage();

export const useAccountGroupStore = create<AccountGroupState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedGroup: null,
      accountGroups: [],
      refreshKey: 0,
      isHydrated: false,
      userId: null,

      // Actions
      setSelectedGroup: (group) => {
        set({
          selectedGroup: group,
        });
      },

      setAccountGroups: (groups) => {
        set({
          accountGroups: groups,
        });
      },

      setUserId: (userId) => {
        const currentUserId = get().userId;

        // اگر userId تغییر کرد، storage را پاک کن و user جدید را set کن
        if (currentUserId !== userId) {
          // Update storage userId
          userScopedStorage.updateUserId(userId);

          // اگر userId تغییر کرده، state را reset کن
          set({
            userId,
            selectedGroup: null,
            accountGroups: [],
            refreshKey: 0,
          });

          // Storage قدیمی کاربر قبلی را rehydrate نکن
          // فقط اگر userId جدید است، از storage جدید بخوان
          if (userId && typeof window !== "undefined") {
            try {
              const key = getStorageKey(userId);
              const stored = localStorage.getItem(key);
              if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed.state?.selectedGroup) {
                  set({
                    selectedGroup: parsed.state.selectedGroup,
                    accountGroups: parsed.state.accountGroups || [],
                  });
                }
              }
            } catch (error) {
              console.error("[AccountGroupStore] Error loading user data:", error);
            }
          }
        }
      },

      triggerRefresh: () => {
        set((state) => ({ refreshKey: state.refreshKey + 1 }));
      },

      clearStorage: () => {
        const userId = get().userId;
        if (typeof window !== "undefined" && userId) {
          const key = getStorageKey(userId);
          localStorage.removeItem(key);
        }
        set({
          selectedGroup: null,
          accountGroups: [],
          refreshKey: 0,
        });
      },

      _setHasHydrated: (state) => {
        set({ isHydrated: state });
      },
    }),
    {
      name: "account-group-store", // این فقط یک نام پایه است، واقعی user-scoped خواهد بود
      storage: createJSONStorage(() => userScopedStorage as any),
      onRehydrateStorage: () => (state) => {
        // بعد از hydration، isHydrated را true کن
        state?._setHasHydrated(true);

        // پاک کردن کلیدهای قدیمی فقط یک بار، بعد از اولین hydration
        cleanupOldKeys();
      },
      // selectedGroup و accountGroups را persist کن
      partialize: (state) => ({
        selectedGroup: state.selectedGroup,
        accountGroups: state.accountGroups,
      }),
    }
  )
);

/**
 * Hook برای دریافت وضعیت hydration
 * این برای جلوگیری از hydration mismatch در SSR استفاده می‌شود
 */
export const useAccountGroupStoreHydration = () => {
  return useAccountGroupStore((state) => state.isHydrated);
};
