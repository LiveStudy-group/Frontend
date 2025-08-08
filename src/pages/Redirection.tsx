import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserProfile } from "../lib/api/auth";
import { setAuthToken } from "../lib/api/token";
import { useAuthStore } from "../store/authStore";

export default function Redirection() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const pathname = location.pathname;

    const provider = pathname.includes("google")
      ? "google"
      : pathname.includes("kakao")
      ? "kakao"
      : "naver";

    if (code) {
      (async () => {
        try {
          const res = await fetch(`/api/oauth/${provider}/callback?code=${code}${state ? `&state=${state}` : ''}`);
          const data = await res.json();
          const token = data?.token as string | undefined;
          if (token) {
            // 토큰 저장 (axios 기본헤더 + localStorage)
            setAuthToken(token);
            // 프로필 동기화 및 스토어 로그인 처리
            try {
              const profile = await getUserProfile();
              if (profile.success && profile.data) {
                const { email, nickname, profileImage } = profile.data;
                const login = useAuthStore.getState().login;
                login(
                  {
                    uid: email.split('@')[0],
                    email,
                    nickname,
                    profileImageUrl: profileImage || 'default.jpg',
                  },
                  token
                );
              }
            } catch {}
          }
          navigate("/main");
        } catch (e) {
          console.error('소셜 로그인 콜백 처리 실패', e);
          navigate('/login');
        }
      })();
    }
  }, [location]);

  return <div>로그인 처리 중...</div>;
}
