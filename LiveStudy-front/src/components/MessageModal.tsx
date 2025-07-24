import { useEffect, useRef, useState } from "react";
import { FiMail, FiSend, FiX } from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import MessageItem from "./MessageItem";
import { sendMessageToServer } from "../lib/api/messageApi";
import type { MessageItemProps, MessageModalProps } from "../types/Message";


export default function MessageModal({ open, onClose }: MessageModalProps) {
  const [messages, setMessage] = useState<MessageItemProps[]>([])
  const [input, setInput] = useState("")
  const messageEndRef = useRef<HTMLDivElement>(null);
  const userInfo = useAuthStore((state) => state.user)

  useEffect(() => {
    if(!open) return;
  }, [open])

  const handleSend = async () => {
    if(!input.trim()) return;

    // const message = input.trim()
    const newMessage: MessageItemProps = {
      id: String(Date.now()),
      username: String(userInfo?.username),
      profileImage: "https://picsum.photos/200/300",
      time: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      text: input.trim(),
    }

    try {
      await sendMessageToServer(newMessage);
      setMessage(prev => [...prev, newMessage])
      setInput('')
    } catch (error) {
      console.error('메시지 전송 실패:', error)
    }
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  if(!open) return null;

  return (
    <div className="fixed bottom-24 right-2 left-2 m-auto sm:mr-0 sm:bottom-24 sm:right-6 w-full max-w-[360px] h-3/4 sm:h-2/3 bg-white rounded-lg shadow-xl flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <h2 className="flex items-center gap-2 text-body1_M">
          <FiMail className="m-1 text-base" />
          <span>스터디룸 대화방</span>
        </h2>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100">
          <FiX />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 text-sm">
        {messages.map((msg) => (
            <MessageItem
            username={msg.username}
            profileImage={msg.profileImage}
            text={msg.text}
            time={msg.time}
            isMyMessage={true}
          />        
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-300 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-body1_R"
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={handleSend}
          className="basic-button-primary h-full text-white border border-gray-300 hover:bg-primary-600"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}