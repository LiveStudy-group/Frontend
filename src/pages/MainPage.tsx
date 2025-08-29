import { AxiosError } from 'axios';
import { createLocalTracks } from 'livekit-client';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import api from '../lib/api/axios';
import { useAuthStore } from '../store/authStore';

interface ErrorBody {
  message?: string;
}

const MainPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  // 스터디룸 입장하기 버튼 클릭 시 스터디룸으로 이동
  const handleEnterStudyRoom = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    if (!Number.isFinite(user.userId)) {
      alert('유효한 사용자 ID가 없습니다. 다시 로그인 해주세요.');
      return;
    }

    // 브라우저 권한 요청(마이크/카메라)
    const AudioContextClass =
      typeof window.AudioContext !== 'undefined'
        ? window.AudioContext
        : window.webkitAudioContext!;

    const audioContext = new AudioContextClass();
    try {
      await audioContext.resume();
    } catch (err) {
      console.warn('AudioContext resume 실패:', err);
    }

    try {
      const tracks = await createLocalTracks({ video: true, audio: true });
      tracks.forEach((t) => t.stop());
    } catch {
      alert('카메라 권한이 없거나 장치가 연결되지 않았습니다!');
      return;
    }

    try {
      const resp = await api.post('/api/study-rooms/enter', null, {
        params: { userId: user.userId }, 
      });

      const data = resp.data as unknown;
      const roomId =
        typeof data === 'string' || typeof data === 'number'
          ? String(data)
          : (data as { roomId?: string | number })?.roomId
          ? String((data as { roomId?: string | number }).roomId)
          : '';

      if (!roomId) {
        throw new Error('roomId가 응답에 없습니다.');
      }

      navigate(`/studyroom/${roomId}`);
    } catch (error: unknown) {
      const err = error as AxiosError<ErrorBody>;
      alert(err.response?.data?.message ?? '스터디룸 입장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col nodrag min-h-screen overflow-hidden">
      <Header />
      <div className="fixed inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
        <div className="pointer-events-auto">
          <button
            onClick={handleEnterStudyRoom}
            className="middle-button-primary md:max-round-button-primary border-primary-400 text-white text-body1_M sm:text-headline4_B hover:bg-primary-600"
          >
            스터디룸 입장하기
          </button>
        </div>
      </div>

      <main className="relative w-full max-w-[1280px] m-auto px-4">
        <div className="w-full h-full backdrop-blur-md bg-white/40 rounded-md">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div key={idx} className="bg-gray-100 rounded shadow-sm flex items-center justify-center">
                <div className="w-full aspect-[4/3] bg-gray-200 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
