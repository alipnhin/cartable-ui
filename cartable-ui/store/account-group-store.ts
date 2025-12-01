import { create } from "zustand";

interface AccountGroupState {
  groupId: string | null;
  setGroupId: (id: string) => void;
}

export const useAccountGroupStore = create<AccountGroupState>((set) => ({
  groupId: null,
  setGroupId: (id) => set({ groupId: id }),
}));
