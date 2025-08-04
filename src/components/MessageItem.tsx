import { useState } from "react";
import type { MessageItemProps } from "../types/Message";
import { useBlockUserStore } from "../store/blockUserStore";

const MessageItem: React.FC<MessageItemProps> = ({
  senderId = '',
  nickname,
  profileImage,
  message,
  timestamp,
  isMyMessage,
  isContinuous = false,
  prevMessageSenderId,
  prevMessageText,
}) => {
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const { isBlocked, blockUser } = useBlockUserStore();
  const blocked = senderId ? isBlocked(senderId) : false;

  const isDuplicateBlockedMessage =
    blocked &&
    prevMessageSenderId === senderId &&
    prevMessageText === "(차단한 유저의 메시지입니다.)";

  console.log("[Block Check]", {
    senderId,
    blocked,
    prevMessageSenderId,
    prevMessageText,
    isDuplicateBlockedMessage
  });

  if (isDuplicateBlockedMessage) {
    return null;
  }

  console.log("[MessageItem]", {
    senderId,
    isBlocked: blocked,
    isContinuous,
    isMyMessage,
    message,
    isDuplicateBlockedMessage
  });

  const toggleMenu = () => {
    setOpenUserInfo((prev) => !prev);
  };

  const handleBlock = () => {
    if (blocked) {
      // 차단 해제
      useBlockUserStore.getState().unblockUser(senderId);
    } else {
      // 차단
      blockUser(senderId);
    }
    setOpenUserInfo(false);
  };

  return (
    <div className="flex flex-col">
      {!isMyMessage && !isContinuous && (
        <div className="relative">
          <div className="flex-1 flex items-center mb-2 cursor-pointer" onClick={toggleMenu}>
            <img
              src={profileImage}
              alt={`${nickname}의 프로필`}
              className="w-8 h-8 rounded-full mr-2"
            />
            <p className="font-semibold mb-1">{nickname}</p>
          </div>
          {openUserInfo && (
            <div className="absolute top-6 left-8 mt-2 px-4 py-2 text-xs bg-white border border-gray-100 rounded-md shadow-md hover:bg-gray-100 cursor-pointer z-10">
              <ul>
                <li onClick={handleBlock}>{blocked ? "차단 해지하기" : "차단하기"}</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {isMyMessage && !isContinuous && (
        <div className="flex items-center justify-end mb-2">
          <p className="font-semibold mb-1">{nickname}</p>
          <img 
            src={profileImage} 
            alt={`${nickname}님의 Profile`} 
            className="w-8 h-8 rounded-full ml-2" 
          />
        </div>
      )}

      <div
        className={`flex-1 inline-flex flex-row flex-wrap text-sm ${isMyMessage ?  'justify-end' : 'justify-start'}`}
      >
        <p className={`px-4 py-2 rounded-lg shadow ${isMyMessage ? 'bg-primary-100' : 'bg-gray-200'} whitespace-pre-wrap break-words`}>
          {blocked ? "(차단한 유저의 메시지입니다.)" : message}
        </p>
        <p className={`w-full text-xs text-gray-500 mt-1 ${isMyMessage ? 'mr-2 text-right' : 'ml-2 text-left' }`}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export default MessageItem;