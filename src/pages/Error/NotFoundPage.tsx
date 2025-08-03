import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-4 md:p-6 lg:p-8">
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-4">404</h1>
      <p className="text-base md:text-xl lg:text-2xl font-light text-center mb-6">
        페이지를 찾을 수 없습니다.
      </p>
      <Link to="/" className="px-6 py-3 text-sm md:text-base bg-primary-500 text-white hover:bg-primary-400 transition-colors duration-200 rounded-lg w-full max-w-[200px] md:w-auto text-center">
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFoundPage;
