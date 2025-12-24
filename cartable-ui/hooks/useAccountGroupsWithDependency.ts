"use client";

/**
 * @deprecated این hook دیگر استفاده نمی‌شود
 * به جای آن مستقیماً از useAccountGroupStore استفاده کنید:
 * 
 * ```tsx
 * import { useAccountGroupStore, useAccountGroupStoreHydration } from "@/store/account-group-store";
 * 
 * const selectedGroup = useAccountGroupStore((s) => s.selectedGroup);
 * const isHydrated = useAccountGroupStoreHydration();
 * ```
 * 
 * این hook فقط برای backward compatibility نگه داشته شده است
 */

import {
  useAccountGroupStore,
  useAccountGroupStoreHydration,
} from "@/store/account-group-store";

interface UseAccountGroupsWithDependencyReturn {
  /** گروه انتخاب شده */
  selectedGroup: import("@/types/account-group-types").AccountGroup | null;

  /** ID گروه انتخاب شده */
  selectedGroupId: string | null;

  /** آیا store hydrate شده و آماده است؟ */
  isReady: boolean;

  /** تابع تغییر گروه */
  setSelectedGroupId: (groupId: string) => void;

  /** تمام گروه‌های حساب (deprecated - همیشه empty array) */
  allGroups: never[];

  /** آیا گروه‌ها در حال بارگذاری هستند؟ (deprecated - همیشه false) */
  isLoadingGroups: false;

  /** خطای بارگذاری گروه‌ها (deprecated - همیشه null) */
  groupsError: null;
}

/**
 * @deprecated Hook قدیمی - از useAccountGroupStore استفاده کنید
 */
export function useAccountGroupsWithDependency(): UseAccountGroupsWithDependencyReturn {
  const selectedGroup = useAccountGroupStore((s) => s.selectedGroup);
  const setSelectedGroup = useAccountGroupStore((s) => s.setSelectedGroup);
  const isHydrated = useAccountGroupStoreHydration();

  // برای backward compatibility
  const setSelectedGroupId = (groupId: string) => {
    // این فانکشن دیگر استفاده نمی‌شود
    // باید مستقیماً setSelectedGroup را با object کامل صدا بزنید
    console.warn(
      "[useAccountGroupsWithDependency] This hook is deprecated. Use useAccountGroupStore directly."
    );
  };

  return {
    selectedGroup,
    selectedGroupId: selectedGroup?.id || null,
    isReady: isHydrated,
    setSelectedGroupId,
    allGroups: [],
    isLoadingGroups: false,
    groupsError: null,
  };
}
