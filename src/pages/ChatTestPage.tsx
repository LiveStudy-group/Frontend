import React, { useState } from 'react';
import ChatRoom from '../components/ChatRoom';

const ChatTestPage: React.FC = () => {
  const [roomId, setRoomId] = useState('test-room-1');
  const [userId, setUserId] = useState('user-1');
  const [nickname, setNickname] = useState('테스트유저1');

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-4">채팅 테스트 페이지</h1>
            
            {/* 설정 패널 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  방 ID
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  사용자 ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  닉네임
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="text-sm text-gray-600">
              <p><strong>웹소켓 주소:</strong> wss://api.live-study.com/ws</p>
              <p><strong>송신 경로:</strong> /pub/api/study-room/chat</p>
              <p><strong>수신 경로:</strong> /topic/{roomId}</p>
            </div>
          </div>

          {/* 채팅룸 */}
          <div className="h-96">
            <ChatRoom
              roomId={roomId}
              userId={userId}
              nickname={nickname}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatTestPage; 