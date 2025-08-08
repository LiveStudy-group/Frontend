import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
      fetch(`/api/oauth/${provider}/callback?code=${code}${state ? `&state=${state}` : ''}`)
        .then((res) => res.json())
        .then((data) => {
          navigate("/main");
        });
    }
  }, [location]);

  return <div>로그인 처리 중...</div>;
}
