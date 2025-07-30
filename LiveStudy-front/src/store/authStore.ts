import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  user: {
    uid: string;
    email: string;
    username: string;
    profileImageUrl?: string;
    title?: {
      key: string;
      name: string;
      description: string;
      icon: string;
      isRepresent: boolean;
    };
  } | null;
  token: string | null;

  titleList?: {
    key: string;
    name: string;
    description: string;
    icon: string;
    isRepresent: boolean;
  }[];
  fetchTitleList?: () => void;

  updateUser: (updates: Partial<AuthState["user"]>) => void;
  login: (
    user: {
      uid: string;
      email: string;
      username: string;
      profileImageUrl?: string;
      title?: {
        key: string;
        name: string;
        description: string;
        icon: string;
        isRepresent: boolean;
      };
    },
    token: string
  ) => void;
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
      },
      token: null,
      titleList: [],

      updateUser: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...updates,
                title: updates?.title
                  ? { ...state.user.title, ...updates.title }
                  : state.user.title,
              }
            : null,
        })),

      login: (
        { uid, email, username, profileImageUrl, title }: {
          uid: string;
          email: string;
          username: string;
          profileImageUrl?: string;
          title?: {
            key: string;
            name: string;
            description: string;
            icon: string;
            isRepresent: boolean;
          };
        },
        token: string
      ) => {
        const defaultTitle = {
          key: "no-title",
          name: "대표 칭호를 설정해주세요!",
          description: "마이페이지에서 대표 칭호를 선택해주세요.",
          icon: "🙏",
          isRepresent: true,
        };

        set({
          user: {
            uid,
            email,
            username,
            profileImageUrl,
            title: title || defaultTitle,
          },
          token,
          isLoggedIn: true,
        });
      },
      logout: () => 
        set({ isLoggedIn: false, user: null, token: null }),

      fetchTitleList: async () => {
        const res = await fetch("/api/titles");
        const data = await res.json();
        set({ titleList: data });
      },
    }),
    {
      name: "live-study-auth-storage",
    }
  )
)