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
