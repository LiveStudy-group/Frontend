import { LiveKitRoom, useRoomContext } from '@livekit/components-react';
import { Participant, Track, TrackPublication } from 'livekit-client';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import MessageButton from '../components/MessageButton';
import MessageModal from '../components/MessageModal';
import VideoGrid from '../components/video/VideoGrid';
import api from '../lib/api/axios';
import { useAuthStore } from '../store/authStore';

const StudyRoomPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [identity, setIdentity] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, token: accessToken } = useAuthStore();
  const { roomId } = useParams<{ roomId: string }>();
  const numericRoomId = Number(roomId);

  // 사용자 인증 정보가 없거나 토큰이 없는 경우 경고
  useEffect(() => {
    if (!user || !accessToken) {
      console.warn('사용자 인증 정보 없음');
      return;
    }

    const fetchToken = async () => {
      const generatedIdentity = user!.uid; // user는 위에서 체크했으므로 non-null 단언
      setIdentity(generatedIdentity);

      try {
        const res = await api.post(
          '/api/livekit/token',
          {
            roomName: roomId,
            identity: user.uid,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setToken(res.data.token);
    console.log('[🔑 토큰]', res.data.token);

      } catch (err) {
        console.error('토큰 생성 실패:', err);
      }
    };

    fetchToken();
    
  }, [user, accessToken]);


  // 디버깅 용 나중에 삭제 예정
 const RoomLogger = () => {
  const room = useRoomContext();

  useEffect(() => {
    console.log('[🧩 ROOM STATE]', room.state);

    const handleConnected = () => {
      console.log('✅ LiveKit 연결 성공');
    };

    const handleDisconnected = () => {
      console.warn('❌ LiveKit 연결 종료됨');
    };

    const handleTrackSubscribed = (
      track: Track,
      publication: TrackPublication,
      participant: Participant
    ) => {
      console.log(`🎥 ${participant.identity}의 ${track.kind} 트랙 구독됨`);
    };

    const handleTrackUnsubscribed = (
      track: Track,
      publication: TrackPublication,
      participant: Participant
    ) => {
      console.log(`🛑 ${participant.identity}의 ${track.kind} 트랙 해제됨`);
    };

    room.on('connected', handleConnected);
    room.on('disconnected', handleDisconnected);
    room.on('trackSubscribed', handleTrackSubscribed);
    room.on('trackUnsubscribed', handleTrackUnsubscribed);

    return () => {
      room.off('connected', handleConnected);
      room.off('disconnected', handleDisconnected);
      room.off('trackSubscribed', handleTrackSubscribed);
      room.off('trackUnsubscribed', handleTrackUnsubscribed);
    };
  }, [room]);

  return null;
};


  // 스터디룸 퇴장 처리
  const handleLeaveRoom = async () => {
    if (!user) {
      alert('사용자 정보가 없습니다.');
      return;
    }

    try {
      await api.post(`/api/study-rooms/leave`, null, {
        params: {
          userId: user.uid, 
        },
        headers: {
          Authorization: `Bearer ${accessToken}`, 
        },
      });

      navigate('/main');
    } catch (err) {
      console.error('퇴장 실패:', err);
      alert('스터디룸 퇴장 중 오류가 발생했습니다.');
    }
  };

  // 토큰 없으면 렌더링하지 않음
  // if (!token) return <div>스터디룸 입장 중입니다...</div>;


  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://api.live-study.com/ws"
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
          <VideoGrid roomId={numericRoomId} />

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
