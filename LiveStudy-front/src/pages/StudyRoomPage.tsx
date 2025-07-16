import { LiveKitRoom } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import VideoGrid from '../components/video/VideoGrid';

const StudyRoomPage = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchToken = async () => {
      const identity = 'user_' + Math.floor(Math.random() * 10000);
      const roomName = 'studyroom1';

      const res = await fetch(`http://localhost:5001/token?roomName=${roomName}&identity=${identity}`);
      const data = await res.json();
      setToken(data.token);
    };

    fetchToken();
  }, []);

  if (!token) return <div>토큰 생성 중...</div>;

  return (
    <LiveKitRoom
      token={token}
      serverUrl="wss://livestudy-7t5xkn6m.livekit.cloud"
      connect
      video
      audio
    >
      <div className="bg-gray-50 flex flex-col nodrag min-h-screen overflow-hidden">
        
      {/* 공통 헤더 컴포넌트 */}
        <Header />

        <main className="flex-1 w-full max-w-[1280px] mx-auto flex overflow-hidden">

          {/* 화상 공유 컴포넌트 */}
          <VideoGrid />

          {/* 단체 메제지 */}
          <aside className="w-[60px] flex-shrink-0 border-l bg-white flex flex-col justify-between" />
        </main>
      </div>
    </LiveKitRoom>
  );
};

export default StudyRoomPage;
