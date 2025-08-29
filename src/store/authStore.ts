import { jwtDecode } from "jwt-decode";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken } from "../lib/api/token";

/** JWT Payload 타입 정의 */
interface TokenPayload {
  sub: string;     // 이메일
  userId: number;  // 서버 발급 유저 PK
  iat: number;
  exp: number;
}

/** 칭호 타입 */
interface UserTitle {
  key: string;
  name: string;
  description: string;
  icon: string;
  isRepresent: boolean;
}

/** 유저 타입 */
export interface AuthUser {
  userId: number; // ✅ 서버가 쓰는 PK
  uid: string;    // 외부 로그인용 ID
  email: string;
  nickname: string;
  profileImageUrl?: string;
  title?: UserTitle;
}

/** zustand 상태 타입 */
interface AuthState {
  isLoggedIn: boolean;
  user: AuthUser | null;
  token: string | null;
  titleList?: UserTitle[];

  setToken: (token: string) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
  login: (user: Omit<AuthUser, "userId">, token: string) => void;
  logout: () => void;

  fetchTitleList?: () => void;
  initializeAuth?: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      titleList: [],

      setToken: (token: string) => {
        set({ token });
        setAuthToken(token);
      },

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      login: ({ uid, email, nickname, profileImageUrl, title }, token) => {
        let decodedUserId = 0;
        try {
          const decoded = jwtDecode<TokenPayload>(token);
          // userId는 숫자 보장
          decodedUserId = Number(decoded.userId) || 0;
        } catch (err) {
          console.error("[authStore] JWT decode 실패:", err);
        }

        const defaultTitle: UserTitle = {
          key: "no-title",
          name: "대표 칭호를 설정해주세요!",
          description: "마이페이지에서 대표 칭호를 선택해주세요.",
          icon: "🙏",
          isRepresent: true,
        };

        set({
          user: {
            userId: decodedUserId,
            uid,
            email,
            nickname,
            profileImageUrl,
            title: title || defaultTitle,
          },
          token,
          isLoggedIn: true,
        });
        setAuthToken(token);
      },

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          token: null,
        }),

      fetchTitleList: async () => {
        try {
          const res = await fetch("/api/titles");
          const data: UserTitle[] = await res.json();
          set({ titleList: data });
        } catch (err) {
          console.error("[authStore] 칭호 목록 불러오기 실패:", err);
        }
      },

      initializeAuth: () => {
        const state = get();
        if (state.token && state.isLoggedIn) {
          setAuthToken(state.token);
        }
      },
    }),
    {
      name: "live-study-auth-storage",
    }
  )
);
