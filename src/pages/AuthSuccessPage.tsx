import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthToken } from "../lib/api/token";
import { useAuthStore } from "../store/authStore";
import { getUserProfile } from "../lib/api/auth";

export default function AuthSuccessPage() {
  const nav = useNavigate();
  const { search, hash } = useLocation();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const qs = search && search !== "" ? search : hash?.replace(/^#/, "") || "";
    const params = new URLSearchParams(qs.startsWith("?") ? qs : `?${qs}`);
    const token = params.get("token");
    const isNew = params.get("isNew") === "true";

    if (!token) {
      nav("/auth/failure?error=missing_token", { replace: true });
      return;
    }

    setAuthToken(token);
    
    // 토큰 존재
    localStorage.getItem('authToken')

    //서버 인증 확인
    fetch('https://api.live-study.com/api/user/profile', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).then(r => console.log('status:', r.status))

    getUserProfile()
      .then((res) => {
        const p = res?.data;
        login(
          {
            uid: p?.email?.split("@")[0] ?? p?.nickname ?? "user",
            email: p?.email ?? "",
            nickname: p?.nickname ?? "",
            profileImageUrl: p?.profileImage ?? "default.jpg",
          },
          token
        );
      })
      .catch(() => {
        login(
          { uid: "user", email: "", nickname: "", profileImageUrl: "default.jpg" },
          token
        );
      })
      .finally(() => {
        window.history.replaceState(null, "", "/auth/success");
        nav(isNew ? "/signup/extra-info" : "/", { replace: true });
      });
  }, [search, hash, nav, login]);

  return <div>로그인 처리 중입니다…</div>;
}
