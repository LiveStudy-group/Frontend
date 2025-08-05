import React, { useEffect, useRef, useState } from 'react';
import useWebSocket from '../hooks/useWebSocket';
import { WEBSOCKET_CONFIG } from '../lib/constants/websocket';
import MessageItem from './MessageItem';

// 임시 해결책: 타입을 직접 정의
interface WebSocketChatMessage {
  userId: string;
  roomId: string;
  nickname: string;
  message: string;
}

interface ChatRoomProps {
  roomId: string;
  userId: string;
  nickname: string;
  profileImage?: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({
  roomId,
  userId,
  nickname,
  profileImage = '/img/my-page-profile-image-1.jpg' // 기본 프로필 이미지
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    sendMessage,
    messages,
    connect,
    disconnect
  } = useWebSocket(WEBSOCKET_CONFIG, roomId);

  // 메시지 전송 핸들러
  const handleSendMessage = () => {
    if (!inputMessage.trim() || !isConnected) return;

    const message: WebSocketChatMessage = {
      userId,
      roomId,
      nickname,
      message: inputMessage.trim()
    };

    sendMessage(message);
    setInputMessage('');
  };

  // Enter 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // WebSocket 메시지를 MessageItem 형식으로 변환
  const convertedMessages = messages.map((wsMessage, index) => {
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const isContinuous = prevMessage?.payload.userId === wsMessage.payload.userId;
    
    return {
      senderId: wsMessage.payload.userId,
      studyroomId: parseInt(wsMessage.payload.roomId),
      nickname: wsMessage.payload.nickname,
      profileImage,
      message: wsMessage.payload.message,
      timestamp: wsMessage.timeStamp,
      isMyMessage: wsMessage.payload.userId === userId,
      isContinuous,
      prevMessageSenderId: prevMessage?.payload.userId,
      prevMessageText: prevMessage?.payload.message
    };
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold">채팅</h2>
          <div className={`ml-2 w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
        <div className="text-sm text-gray-500">
          {isConnected ? '연결됨' : '연결 중...'}
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {convertedMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>아직 메시지가 없습니다.</p>
            <p className="text-sm">첫 번째 메시지를 보내보세요!</p>
          </div>
        ) : (
          convertedMessages.map((message, index) => (
            <MessageItem
              key={`${message.senderId}-${message.timestamp}-${index}`}
              {...message}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "메시지를 입력하세요..." : "연결 중..."}
            disabled={!isConnected}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            전송
          </button>
        </div>
        
        {/* 연결 상태 표시 */}
        {!isConnected && (
          <div className="mt-2 text-sm text-red-500">
            연결이 끊어졌습니다. 재연결을 시도 중입니다...
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;