import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="w-full border-b border-gray-100">
      <div className="max-w-[1280px] mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-headline3_B text-primary-500">
          <Link to={'/'}>LiveStudy</Link>
        </h1>
        <Link to={'/login'} className="text-caption1_R text-gray-500 hover:text-primary-400">로그인</Link>
      </div>
    </header>
  );
};

export default Header;
