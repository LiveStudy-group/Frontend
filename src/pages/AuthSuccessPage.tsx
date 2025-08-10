import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthSuccessPage() {
  const nav = useNavigate();
  const { search, hash } = useLocation();

  const getParams = () => {
    const qs = search && search !== "" ? search : hash?.replace(/^#/, "") || "";
    return new URLSearchParams(qs.startsWith("?") ? qs : `?${qs}`);
  };

  useEffect(() => {
    const params = getParams();
    const token = params.get("token");
    const isNew = params.get("isNew");

    if (token) {
      localStorage.setItem("accessToken", token);
    }

    if (isNew === "true") {
      nav("/signup/extra-info", { replace: true });
    } else {
      nav("/", { replace: true });
    }
  }, [search, hash, nav]);

  return <div>로그인 처리 중입니다…</div>;
}
