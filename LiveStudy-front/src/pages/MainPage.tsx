import axios, { AxiosError } from 'axios';
import { createLocalTracks } from 'livekit-client';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';


const MainPage = () => {
  const navigate = useNavigate();

  // 스터디룸 입장하기 버튼 클릭 시 스터디룸으로 이동
  const handleEnterStudyRoom = async () => {
    const AudioContextClass =
      typeof window.AudioContext !== 'undefined'
        ? window.AudioContext
        : (window as any).webkitAudioContext;

    const audioContext = new AudioContextClass();

    try {
      await audioContext.resume();
    } catch (err) {
      console.warn('AudioContext resume 실패:', err);
    }

    try {
      const tracks = await createLocalTracks({ video: true, audio: true });
      console.log('getUserMedia 성공', tracks);
      tracks.forEach((t) => t.stop());
    } catch (err) {
      console.error('getUserMedia 실패:', err);
      alert('카메라 권한이 없거나 장치가 연결되지 않았습니다!');
      return;
    }

    try {
      const response = await axios.post('/api/study-room/enter', {
        userId: 'test-user-id',
        roomId: 'study-room-123',
      });

      const { roomId } = response.data;
      navigate(`/studyroom/${roomId}`);
      
    }catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;
      alert(err.response?.data?.message ?? '오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col nodrag min-h-screen overflow-hidden">
      
      {/* 공통 헤더 컴포넌트 */}
      <Header />
      <div className="fixed inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        
        {/* 스터디룸 입장 버튼 */}
        <div className="pointer-events-auto">
          <button
            onClick={handleEnterStudyRoom}
            className="middle-button-primary md:max-round-button-primary border-primary-400 text-white text-body1_M sm:text-headline4_B hover:bg-primary-600"
          >
            스터디룸 입장하기
          </button>
        </div>
      </div>

        {/* 메인 콘텐츠 영역 */}
        <main className="relative w-full max-w-[1280px] m-auto px-4">
        <div className="w-full h-full backdrop-blur-md bg-white/40 rounded-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded shadow-sm flex items-center justify-center"
              >
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* 공통 푸터 컴포넌트 */}
      <Footer />
      </div>
  );
};

export default MainPage;