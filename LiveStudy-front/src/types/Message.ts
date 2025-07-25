export interface MessageItemProps {
  id?: string;
  username: string;
  profileImage: string;
  text: string;
  time: string;
  isMyMessage?: boolean;
}

export interface MessageModalProps {
  open: boolean;
  onClose: () => void;
}
