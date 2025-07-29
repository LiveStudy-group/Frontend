import { LiveKitRoom, useRoomContext } from '@livekit/components-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import MessageButton from '../components/MessageButton';
import MessageModal from '../components/MessageModal';
import VideoGrid from '../components/video/VideoGrid';

const StudyRoomPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [identity, setIdentity] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);


  // 스터디룸 퇴장 처리
  const handleLeaveRoom = async () => {
    try {
      await axios.post(`/api/study-rooms/leave`, null, {
        params: {
          userId: identity, 
        },
      });

      navigate('/main');
    } catch (err) {
      console.error('퇴장 실패:', err);
      alert('스터디룸 퇴장 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    // 스터디룸 입장을 위한 토큰을 서버에서 요청
    const fetchToken = async () => {
      const generatedIdentity = 'user_' + Math.floor(Math.random() * 10000);
      setIdentity(generatedIdentity);

      try {
        const res = await fetch(
          `http://localhost:5001/token?roomName=studyroom1&identity=${generatedIdentity}`
        );
        const data = await res.json();
        setToken(data.token);
      } catch (err) {
        console.error('토큰 생성 실패:', err);
      }
    };

    fetchToken();
  }, []);

  // 토큰이 아직 생성되지 않은 경우 로딩 화면 출력
  // if (!token) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-lg">
  //       토큰 생성 중입니다. 브라우저 권한을 허용했는지 확인해주세요.
  //     </div>
  //   );
  // }

  // 디버깅 용 나중에 삭제 예정
  const RoomLogger = () => {
    const room = useRoomContext();

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

    return null;
  };


  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://livestudy-7t5xkn6m.livekit.cloud"
      connect
      video
      audio={false} 
    >
      {/* 디버깅용 컴포넌트 */}
      <RoomLogger />

      <div className="bg-gray-50 flex flex-col nodrag min-h-screen overflow-hidden">
        
      {/* 공통 헤더 컴포넌트 */}
        <Header />

      {/* 퇴장하기 버튼 */}
        <div className="w-full max-w-[1280px] mx-auto flex justify-end p-4">
          <button
            onClick={handleLeaveRoom}
            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
          >
            퇴장하기
          </button>
        </div>
        <main className="flex-1 w-full max-w-[1280px] mx-auto flex overflow-hidden">

          {/* 화상 공유 컴포넌트 */}
          <VideoGrid />

          {/* 메시지 버튼 및 모달 */}
          <MessageButton onClick={() => setIsModalOpen(true)} />
          <MessageModal open={isModalOpen} onClose={() => setIsModalOpen(false)} useMock={true} />
          {/* <MockMessageTest /> */}
        </main>
        
        {/* 공통 푸터 컴포넌트 */}
        <Footer />
      </div>
    </LiveKitRoom>
  );
};

export default StudyRoomPage;