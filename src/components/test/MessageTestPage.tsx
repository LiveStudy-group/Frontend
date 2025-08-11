import React, { useState } from 'react';
import MessageButton from '../../components/MessageButton';
import MessageModal from '../../components/MessageModal';

const MessageTestPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roomId, setRoomId] = useState(1);
  const [useMock, setUseMock] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold mb-4">메시지 기능 테스트 페이지</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
                <input
                  type="number"
                  value={roomId}
                  onChange={(e) => setRoomId(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">모드 선택</label>
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
          </div>
        </div>
      </div>

      <MessageButton onClick={() => setIsModalOpen(true)} />
      <MessageModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        useMock={useMock}
        roomId={roomId}
      />
    </div>
  );
};

export default MessageTestPage;


