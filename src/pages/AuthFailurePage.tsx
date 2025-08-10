import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AuthFailurePage() {
  const { search } = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const error = params.get("error") || "로그인에 실패했습니다.";
    console.error("소셜 로그인 실패:", error);
  }, [search]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4 md:p-6 lg:p-8">
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4">
        로그인 실패
      </h1>
      <p className="text-base md:text-xl lg:text-2xl font-light text-center mb-6">
        소셜 로그인 중 오류가 발생했습니다. <br />
        다시 시도해 주세요.
      </p>
      <button
        onClick={() => nav("/login")}
        className="px-6 py-3 text-sm md:text-base bg-primary-500 text-white hover:bg-primary-400 transition-colors duration-200 rounded-lg w-full max-w-[240px] md:w-auto text-center"
      >
        로그인 페이지로 돌아가기
      </button>
    </div>
  );
}
