import { create } from "zustand";

interface AccountGroupState {
  groupId: string | null;
  refreshKey: number;
  setGroupId: (id: string) => void;
  triggerRefresh: () => void;
}

export const useAccountGroupStore = create<AccountGroupState>((set) => ({
  groupId: null,
  refreshKey: 0,
  setGroupId: (id) => set({ groupId: id }),
  triggerRefresh: () => set((state) => ({ refreshKey: state.refreshKey + 1 })),
}));
