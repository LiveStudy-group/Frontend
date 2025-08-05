import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user)
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const logout = useAuthStore((state) => {
    console.log('[Header] user 정보:', user);
    return state.logout;
  })
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

  console.log('현재 로그인한 유저 정보: ',user)
  console.log('현재 로그인한 유저 칭호', user?.title?.name)

  return (
    <header className="w-full border-b border-gray-100 z-50">
      <div className="max-w-[1280px] mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-headline4_B sm:text-headline3_B text-primary-500">
          <Link to={'/main'}>LiveStudy</Link>
        </h1>
        {/* 로그인 여부에 따라 표시 */}
        {/* 추후 Zustand 등 상태관리로 로그인 사용자 정보 연동 */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <div className="text-sm text-right">
              <div>
                <span className="text-caption1_M">환영합니다 !</span>
                {user?.title?.key && user?.title?.key !== 'no-title' && user?.title?.name && user?.title?.name !== '대표 칭호를 설정해주세요!' ? (
                  <span className="text-primary-400 mx-1 font-medium">{user?.title?.icon} {user?.title?.name}</span>
                ) : (
                  <span className="text-gray-300 mx-1">대표 칭호를 선택해주세요.</span>
                )}
                <span className="font-medium">{user?.nickname}님 !</span>
              </div>
              <div className="text-xs">
                오늘 집중 시간 : <strong>02:03:56</strong>
              </div>
            </div>
          ) : (
            <div className="text-caption1_R text-gray-500 hover:text-primary-400 transition">
              <Link to={'/login'}>로그인</Link>
            </div>
          )}
          <div className="relative z-50" ref={menuRef}>
            { isLoggedIn && <div onClick={toggleMenu} className="w-10 h-10 rounded-full bg-gray-300 cursor-pointer" />}
            { menuOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md text-sm z-10">
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-2 hover:bg-gray-200 rounded-tl-[4px] rounded-tr-[4px] cursor-pointer">
                    <Link to={'/mypage'}>마이페이지</Link>
                  </li>
                  <li className="px-4 py-2 text-gray-300">통계</li>
                  <li className="px-4 py-2 text-gray-300">고객센터</li>
                  <li className="px-4 py-2 hover:bg-gray-200 rounded-bl-[4px] rounded-br-[4px] cursor-pointer" onClick={handleLogout}>로그아웃</li>
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
