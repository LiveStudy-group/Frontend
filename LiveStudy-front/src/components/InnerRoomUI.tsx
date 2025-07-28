import { useRoomContext } from '@livekit/components-react';
import { useEffect } from 'react';
import Footer from './common/Footer';
import Header from './common/Header';
import MessageButton from './MessageButton';
import MessageModal from './MessageModal';
import VideoGrid from './video/VideoGrid';

interface InnerRoomUIProps {
  onLeave: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const InnerRoomUI = ({ onLeave, isModalOpen, setIsModalOpen }: InnerRoomUIProps) => {
  const room = useRoomContext();

  const handleLeaveRoom = async () => {
    try {
      await room.disconnect();
      onLeave();
    } catch (err) {
      console.error('방 나가기 실패:', err);
    }
  };

  useEffect(() => {
    if (room.state === 'connected') {
      const local = room.localParticipant;
      const videoTrack = local
        .getTrackPublications()
        .find((pub) => pub.track?.kind === 'video')?.track;

      if (!videoTrack) {
        console.warn('비디오 트랙이 없습니다.');
      }
    }
  }, [room]);

  return (
    <div className="bg-gray-50 flex flex-col nodrag min-h-screen overflow-hidden">
      {/* 공통 헤더 컴포넌트 */}
      <Header />
      {/* 나가기 버튼 */}
      <div className="w-full max-w-[1280px] mx-auto text-right">
        <button
          onClick={handleLeaveRoom}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow m-4"
        >
          나가기
        </button>
      </div>

      <main className="flex-1 w-full max-w-[1280px] mx-auto flex overflow-hidden">
        {/* 비디오 그리드 */}
        <VideoGrid />

        {/* 메시지 버튼 */}
        <MessageButton onClick={() => setIsModalOpen(true)} />

        {/* 메시지 모달 */}
        <MessageModal open={isModalOpen} onClose={() => setIsModalOpen(false)} useMock={true} />
      </main>

      {/* 공통 푸터 컴포넌트 */}
      <Footer />
    </div>
  );
};

export default InnerRoomUI;
