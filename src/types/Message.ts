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

// WebSocket 메시지 타입(백엔드 스키마 기준)
export interface WsOutboundMessage {
  senderId: string;
  roomId: string;
  content: string;
  timestamp?: string; // 서버에서 생성 가능
}

export interface WsInboundMessage {
  senderId: string;
  roomId: string;
  content: string;
  timestamp: string;
}

export interface WebSocketConnectionConfig {
  url: string;
  publishPath: string;
  subscribePath: string;
}
