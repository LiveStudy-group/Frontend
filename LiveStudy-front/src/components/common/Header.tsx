import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev)
  }

  const handleLogout = () => {
    logout()
    alert('로그아웃이 완료되었습니다. 로그인 페이지로 이동합니다.')
    navigate('/login')
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="w-full border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-headline3_B text-primary-500">
          <Link to={'/'}>LiveStudy</Link>
        </h1>
        {/* 로그인 여부에 따라 표시 */}
        {/* 추후 Zustand 등 상태관리로 로그인 사용자 정보 연동 */}
        <div className="flex items-center space-x-4">
          {isLoggedIn && (
            <div className="text-sm text-right">
            <div>
              환영합니다. <strong>{user?.username}님 !</strong>
            </div>
            <div className="text-xs">
              오늘 집중 시간 : <strong>02:03:56</strong>
            </div>
          </div>
          )}
          <div className="relative" ref={menuRef}>
            <div onClick={toggleMenu} className="w-10 h-10 rounded-full bg-gray-300 cursor-pointer" />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md text-sm z-10">
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">마이페이지</li>
                  <li className="px-4 py-2 text-gray-300">통계</li>
                  <li className="px-4 py-2 text-gray-300">고객센터</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>로그아웃</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
