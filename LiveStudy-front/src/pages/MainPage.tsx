import Header from '../components/common/Header';

const MainPage = () => {
  // 스터디룸 입장하기 버튼 클릭 시 스터디룸으로 이동
  const handleEnterStudyRoom = () => {
  };

  return (
    <div className="bg-gray-50 flex flex-col nodrag min-h-screen overflow-hidden">
      {/* 공통 헤더 컴포넌트 */}
      <Header />

      {/* 스터디룸 입장 버튼 */}
      <div className="fixed inset-0 z-20 flex items-center justify-center px-4 sm:px-6 md:px-8 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={handleEnterStudyRoom}
            className="px-6 py-3 text-lg md:text-xl bg-primary-500 text-white hover:bg-primary-400 
                       transition-colors duration-200 rounded-lg w-full max-w-[220px] md:w-auto 
                       text-center font-bold cursor-pointer z-10"
          >
            스터디룸 입장하기
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="relative w-full max-w-[1280px] m-auto px-4 sm:px-6 md:px-8">
        <div className="w-full h-full backdrop-blur-md bg-white/40 rounded-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full p-4">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded shadow-sm overflow-hidden flex items-center justify-center"
              >
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
