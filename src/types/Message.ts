export interface MessageItemProps {
  senderId: string;
  studyroomId?: number;
  nickname: string;
  profileImage: string;
  message: string;
  timestamp: string;
  isMyMessage: boolean;
  isContinuous?: boolean;
  blocked?: boolean;
  prevMessageSenderId?: string;
  prevMessageText?: string;
}

export interface MessageModalProps {
  open: boolean;
  onClose: () => void;
}

// 웹소켓 메시지 타입 정의
export interface WebSocketChatMessage {
  userId: string;
  roomId: string;
  nickname: string;
  message: string;
}

export interface WebSocketReceivedMessage {
  type: string;
  payload: {
    userId: string;
    roomId: string;
    nickname: string;
    message: string;
  };
  timeStamp: string;
}

export interface WebSocketConnectionConfig {
  url: string;
  publishPath: string;
  subscribePath: string;
}
