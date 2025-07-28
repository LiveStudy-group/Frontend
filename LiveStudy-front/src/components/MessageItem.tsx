import type { MessageItemProps } from "../types/Message";

const MessageItem: React.FC<MessageItemProps> = ({
  username,
  profileImage,
  message,
  timestamp,
  isMyMessage,
}) => {
  return (
    <div className="flex flex-col">
      {!isMyMessage && (
        <div className="flex-1 flex items-center mb-2">
          <img
            src={profileImage}
            alt={`${username}의 프로필`}
            className="w-8 h-8 rounded-full mr-2"
          />
          <p className="font-semibold mb-1">{username}</p>
        </div>
      )}

      {isMyMessage && (
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
        className={`flex-1 inline-flex flex-row flex-wrap text-sm ${isMyMessage ?  'justify-end' : 'justify-start'}`}
      >
        <p className={`px-4 py-2 rounded-lg shadow ${isMyMessage ? 'bg-primary-100' : 'bg-gray-200'} whitespace-pre-wrap break-words`}>{message}</p>
        <p className={`w-full text-xs text-gray-500 mt-1 ${isMyMessage ? 'mr-2 text-right' : 'ml-2 text-left' }`}>
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

export default MessageItem;