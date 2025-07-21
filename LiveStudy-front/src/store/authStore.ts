import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  token: string | null;

  login: (username: string, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      username: null,
      token: null,

      login: (username, token) => 
        set({ isLoggedIn: true, username, token }),
      logout: () => 
        set({ isLoggedIn: false, username: null, token: null }),
    }),
    {
      name: "auth-storage",
    }
  )
)