import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  user: {
    uid: string;
    email: string;
    username: string;
    avatarUrl?: string;
  } | null
  token: string | null;

  login: (user: { uid: string; email: string; username: string; avatarUrl?: string }, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      isLoggedIn: false,
      user: {
        uid: '',
        email: '',
        username: '',
      },
      token: null,

      login: ({ uid, email, username, avatarUrl }: { uid: string; email: string; username: string; avatarUrl?: string }, token: string) => {
        set({ user: { uid, email, username, avatarUrl }, token, isLoggedIn: true });
      },
      logout: () => 
        set({ isLoggedIn: false, user: null, token: null }),
    }),
    {
      name: "live-study-auth-storage",
    }
  )
)