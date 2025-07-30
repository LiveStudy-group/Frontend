import { create } from "zustand";
import { persist } from "zustand/middleware";

interface BlockUserState {
  blockedUserIds: string[];
  blockUser: (uid: string) => void;
  unblockUser: (uid: string) => void;
  isBlocked: (uid: string) => boolean;
}

export const useBlockUserStore = create<BlockUserState>()(
  persist(
    (set, get) => ({
      blockedUserIds: [],
      blockUser: (uid) =>
        set((state) => ({
          blockedUserIds: [...state.blockedUserIds, uid],
        })),
      unblockUser: (uid) =>
        set((state) => ({
          blockedUserIds: state.blockedUserIds.filter((id) => id !== uid),
        })),
      isBlocked: (uid) => get().blockedUserIds.includes(uid),
    }),
    {
      name: "blocked-user-storage",
    }
  )
);