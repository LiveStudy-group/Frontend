import { create } from 'zustand';

export type FocusStatus = 'idle' | 'focus' | 'pause' | 'ended';

export interface FocusStatusStore {
  focusStatuses: Record<string, FocusStatus>; 
  setStatus: (identity: string, status: FocusStatus) => void; 
  resetAll: () => void; 
}

export const useFocusStatusStore = create<FocusStatusStore>((set) => ({
  focusStatuses: {},

  setStatus: (identity: string, status: FocusStatus) => {
    set((state) => ({
      focusStatuses: {
        ...state.focusStatuses,
        [identity]: status,
      },
    }));
  },

  resetAll: () => {
    set({ focusStatuses: {} });
  },
}));
