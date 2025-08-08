import React, { useState } from 'react';
import MessageButton from '../components/MessageButton';
import MessageModal from '../components/MessageModal';

const MessageTestPage: React.FC = () => {
  // 🧪 [독립 테스트용] 현재는 독립적으로 테스트하지만,
  // 추후 StudyRoomPage에서는 useParams로 roomId를 받아서 사용할 예정
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomId, setRoomId] = useState(1);  // 🔄 실제 연동 시: Number(useParams().roomId)
  const [useMock, setUseMock] = useState(true);  // 🔄 실제 연동 시: false

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-4">메시지 기능 테스트 페이지</h1>
            
            {/* 설정 패널 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room ID
                </label>
                <input
                  type="number"
                  value={roomId}
                  onChange={(e) => setRoomId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  모드 선택
                </label>
                <select
                  value={useMock ? 'mock' : 'real'}
                  onChange={(e) => setUseMock(e.target.value === 'mock')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="mock">Mock Socket (개발용)</option>
                  <option value="real">Real WebSocket (실제 서비스)</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <p><strong>현재 설정:</strong></p>
              <p>• Room ID: {roomId}</p>
              <p>• 모드: {useMock ? 'Mock Socket' : 'Real WebSocket'}</p>
              <p>• Socket URL: {useMock ? `ws://localhost:${1234 + roomId}` : 'wss://api.live-study.com/ws'}</p>
            </div>
          </div>

          {/* 테스트 영역 */}
          <div className="p-4">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h2 className="text-lg font-semibold mb-4">메시지 기능 테스트</h2>
              <p className="text-gray-600 mb-4">
                오른쪽 하단의 메시지 버튼을 클릭하여 채팅을 시작하세요
              </p>
              
              {/* 다중 탭 테스트 안내 */}
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">🧪 다중 탭 테스트 방법</h3>
                <p className="text-sm text-yellow-700">
                  같은 Room ID로 여러 탭을 열어서 실시간 채팅을 테스트해보세요!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔄 [연동 가이드] StudyRoom 연동 시 이 부분을 참고하세요 */}
      <MessageButton onClick={() => setIsModalOpen(true)} />
      <MessageModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        useMock={useMock}  // 🔄 StudyRoom 연동 시: false
        roomId={roomId}    // 🔄 StudyRoom 연동 시: Number(useParams().roomId)
      />
    </div>
  );
};

export default MessageTestPage;