import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setAuthToken } from "../lib/api/token";
import { useAuthStore } from "../store/authStore";

export default function AuthSuccessPage() {
  const nav = useNavigate();
  const { search, hash } = useLocation();
  const login = useAuthStore((state) => state.login);

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

    window.history.replaceState(null, "", "/auth/success");

    nav(isNew ? "/signup/extra-info" : "/", { replace: true });
  }, [search, hash, nav, login]);

  return <div>로그인 처리 중입니다…</div>;
}
