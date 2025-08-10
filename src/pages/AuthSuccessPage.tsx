import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthToken } from "../lib/api/token";
import { useAuthStore } from "../store/authStore";
import api from '../lib/api/axios';

export default function AuthSuccessPage() {
  const nav = useNavigate();
  const { search, hash } = useLocation();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const run = async () => {
      const qs = search && search !== "" ? search : hash?.replace(/^#/, "") || "";
      const params = new URLSearchParams(qs.startsWith("?") ? qs : `?${qs}`);
      const token = params.get("token");
      const isNew = params.get("isNew") === "true";

      if (!token) {
        nav("/auth/failure?error=missing_token", { replace: true });
        return;
      }

      // 토큰 저장 + api 기본 Authorization 헤더 설정
      setAuthToken(token);

      // 환경에서 프로필 호출 체크 
      if (import.meta.env.DEV) {
        try {
          const res = await api.get("/api/user/profile");
          console.log("[auth] profile status:", res.status);
        } catch (e) {
          console.warn("[auth] profile check failed:", e);
        }
      }

      // 실제 프로필 조회
      try {
        const res = await api.get("/api/user/profile");
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
      } catch {
        // 실패 시 기본값으로 로그인 처리
        login({ uid: "user", email: "", nickname: "", profileImageUrl: "default.jpg" }, token);
      } finally {
        // 쿼리스트링 정리 후 라우팅
        window.history.replaceState(null, "", "/auth/success");
        nav(isNew ? "/signup/extra-info" : "/", { replace: true });
      }
    };

    void run();
  }, [search, hash, nav, login]);

  return <div>로그인 처리 중입니다…</div>;
}
