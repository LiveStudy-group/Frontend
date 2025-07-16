import { useEffect, useRef, useState } from "react";
import { FiMail, FiSend, FiX } from "react-icons/fi";

interface MessageModalProps {
  open: boolean;
  onClose: () => void;
}

export default function MessageModal({ open, onClose }: MessageModalProps) {
  const [messages, setMessage] = useState<string[]>([])
  const [input, setInput] = useState("")
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if(!open) return;
  }, [open])

  const handleSend = () => {
    if(!input.trim()) return;

    const message = input.trim()

    setMessage(prev => [...prev, message])
    setInput('')
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  if(!open) return null;

  return (
    <div className="fixed bottom-32 right-6 w-[360px] h-2/3 bg-white rounded-lg shadow-xl flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-300">
        <h2 className="flex items-center gap-2 text-body1_M">
          <FiMail className="m-1 text-[16px]" />
          <span>스터디룸 대화방</span>
        </h2>
        <button onClick={onClose} className="p-1 rounded-sm hover:text-primary-400 hover:bg-gray-100">
          <FiX />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 text-sm">
        {messages.map((msg, i) => (
          <div key={i} className="bg-gray-100 p-2 rounded">
            {msg}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-300 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-body1_R"
          placeholder="메시지를 입력하세요"
        />
        <button
          onClick={handleSend}
          className="basic-button-primary h-full text-white border border-gray-300 hover:bg-white hover:text-primary-400"
        >
          <FiSend />
        </button>
      </div>
    </div>
  );
}