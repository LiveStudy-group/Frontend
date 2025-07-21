import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  username: null,
  login: (username) => set({ isLoggedIn: true, username }),
  logout: () => set({ isLoggedIn: false, username: null })
}))