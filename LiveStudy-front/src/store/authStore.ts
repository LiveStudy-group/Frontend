import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  user: {
    uid: string;
    email: string;
    username: string;
    profileImageUrl?: string;
    title?: string;
  } | null
  token: string | null;

  updateUser: (updates: Partial<AuthState["user"]>) => void;
  login: (user: { uid: string; email: string; username: string; profileImageUrl?: string }, token: string) => void;
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
        profileImageUrl: '',
        title: '',
      },
      token: null,

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      login: ({ uid, email, username, profileImageUrl, title }: { uid: string; email: string; username: string; profileImageUrl?: string, title?: string }, token: string) => {
        set({ user: { uid, email, username, profileImageUrl, title }, token, isLoggedIn: true });
      },
      logout: () => 
        set({ isLoggedIn: false, user: null, token: null }),
    }),
    {
      name: "live-study-auth-storage",
    }
  )
)