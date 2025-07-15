import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white w-full">
      <div className="max-w-[1280px] mx-auto px-4 py-4 flex justify-between items-center">
        {/* 좌측: 로고 */}
        <div className="text-headline3_B text-gray-500">
          <Link to={'/'}>LiveStudy</Link>
        </div>

        <div className="flex flex-col items-center text-sm text-gray-500">
          {/* 우측: 링크 */}
          <div className="flex gap-4">
            <Link to="/about" className="hover:text-primary-400 transition">서비스 소개</Link>
            <Link to="/terms" className="hover:text-primary-400 transition">이용약관</Link>
            <Link to="/privacy" className="hover:text-primary-400 transition">개인정보처리방침</Link>
          </div>

          {/* 하단 카피라이트 */}
          <div className="w-full text-right text-xs text-gray-300 mt-4">
            &copy; 2025 LiveStudy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}