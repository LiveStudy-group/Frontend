import { MdReport } from 'react-icons/md';
import Header from '../components/common/Header';

const StudyRoomPage = () => {
  return (
    <div className="bg-gray-50 flex flex-col nodrag min-h-screen overflow-hidden">
      {/* 공통 헤더 컴포넌트 */}
      <Header />

      <main className="flex-1 w-full max-w-[1280px] mx-auto flex overflow-hidden">
        <section className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto">
          {Array.from({ length: 20 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-100 rounded shadow-sm overflow-hidden flex items-center justify-center aspect-[4/3] relative"
            >
              <div className="w-full h-full bg-gray-200 rounded-md relative">
                {/* 상태 */}
                <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-green-500" />

                {/* 타이머 */}
                <div className="absolute top-1 right-1 flex justify-center items-center gap-[0.2rem] mt-[0.1rem]">
                  <span className="text-caption2_M text-white bg-black/50 px-1 rounded">01:59:59</span>
                </div>

                {/* 유저 정보 + 신고 */}
                <div className="absolute bottom-0 left-0 w-full px-2 py-1 bg-black/40 text-white text-xs flex items-center justify-center">
                  {/* 유저 정보 */}
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">🌱</span>
                    <span className="text-caption1_M text-lime-400 font-semibold">꾸준함의 씨앗</span>
                    <span className="text-caption1_M font-semibold">홍길동</span>
                  </div>

                  {/* 신고 버튼 */}
                  <button className="absolute right-2 text-red-300 hover:text-red-500">
                    <MdReport size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default StudyRoomPage;
