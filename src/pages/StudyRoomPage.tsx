import { LiveKitRoom, useRoomContext } from '@livekit/components-react';
import { Participant, Track, TrackPublication } from 'livekit-client';
import { useEffect, useRef, useState } from 'react';
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
  const requestedRef = useRef(false);

  // 사용자 인증 정보가 없거나 토큰이 없는 경우 경고
  useEffect(() => {
    if (!user || !accessToken || !roomId) return;
    if (requestedRef.current) return;
    requestedRef.current = true;

    (async () => {
      try {
        const generatedIdentity = user.uid;
        setIdentity(generatedIdentity);

        const res = await api.post(
          '/api/livekit/token',
          { roomName: roomId, identity: generatedIdentity },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setToken(res.data.token);
        console.log('[🔑 토큰]', res.data.token);
      } catch (err) {
        console.error('토큰 생성 실패:', err);
      }
    })();
  }, [user, accessToken, roomId]);



  // 디버깅 용 나중에 삭제 예정
  const RoomLogger = () => {
    const room = useRoomContext();
    useEffect(() => {
      const onCon = () => console.log('LiveKit 연결 성공');
      const onDis = () => console.warn('LiveKit 연결 종료됨');
      const onSub = (t: Track, p: TrackPublication, u: Participant) =>
        console.log(`${u.identity}의 ${t.kind} 구독됨`);
      const onUnsub = (t: Track, p: TrackPublication, u: Participant) =>
        console.log(`${u.identity}의 ${t.kind} 해제됨`);
      room.on('connected', onCon);
      room.on('disconnected', onDis);
      room.on('trackSubscribed', onSub);
      room.on('trackUnsubscribed', onUnsub);
      return () => {
        room.off('connected', onCon);
        room.off('disconnected', onDis);
        room.off('trackSubscribed', onSub);
        room.off('trackUnsubscribed', onUnsub);
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
  if (!token) return <div>스터디룸 입장 중입니다...</div>;


  return (
    <LiveKitRoom
      key={`${roomId}-${token.slice(0,12)}`}
      token={token}
      serverUrl="wss://api.live-study.com" 
      connect={!!token}                 
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
