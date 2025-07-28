export interface MessageItemProps {
  senderId?: string;
  studyroomId?: number;
  username: string;
  profileImage: string;
  message: string;
  timestamp: string;
  isMyMessage: boolean;
}

export interface MessageModalProps {
  open: boolean;
  onClose: () => void;
}
