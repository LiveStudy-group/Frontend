import type { MessageItemProps } from "../types/Message";

const MessageItem: React.FC<MessageItemProps> = ({
  username,
  profileImage,
  text,
  time,
  isMyMessage,
}) => {
  return (
    <div className="flex flex-col">
      {isMyMessage && (
        <div className="flex-1 flex items-center mb-2">
          <img
            src={profileImage}
            alt={`${username}의 프로필`}
            className="w-8 h-8 rounded-full mr-2"
          />
          <p className="font-semibold mb-1">{username}</p>
        </div>
      )}

      {!isMyMessage && (
        <div className="flex items-center justify-end mb-2">
          <p className="font-semibold mb-1">{username}</p>
          <img 
            src={profileImage} 
            alt={`${username}님의 Profile`} 
            className="w-8 h-8 rounded-full ml-2" 
          />
        </div>
      )}

      <div
        className={`flex-1 inline-flex flex-row flex-wrap text-sm ${isMyMessage ? 'justify-start' : 'justify-end'}`}
      >
        <p className={`px-4 py-2 rounded-lg shadow ${isMyMessage ? 'bg-primary-100' : 'bg-gray-200'} whitespace-pre-wrap break-words`}>{text}</p>
        <p className={`w-full text-xs text-gray-500 mt-1 ${isMyMessage ? 'ml-2 text-left' : 'mr-2 text-right'}`}>{time}</p>
      </div>
    </div>
  )
}

export default MessageItem;