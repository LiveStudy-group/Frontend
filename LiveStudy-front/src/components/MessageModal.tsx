import { useEffect, useRef, useState } from "react";
import { FiMail, FiSend, FiX } from "react-icons/fi";
import { useAuthStore } from "../store/authStore";
import MessageItem from "./MessageItem";
import { sendMessageToServer } from "../lib/api/messageApi";
import { setupMockSocketServer } from "../mocks/mockSocket";
import type { MockMessageModalProps } from "../types/MockMessage";
import type { MessageItemProps } from "../types/Message";

function checkLocalBlocked(senderId: string): boolean {
  const blocked = JSON.parse(localStorage.getItem("blockedUsers") || "[]");
  return blocked.includes(senderId);
}

export default function MessageModal({ open, onClose, useMock = false }: MockMessageModalProps) {
  const [messages, setMessage] = useState<MessageItemProps[]>([]);
  const [input, setInput] = useState("");
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const userInfo = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!open || !useMock) return;

    setupMockSocketServer();

    const ws = new WebSocket("ws://localhost:1234");
    ws.onmessage = (event) => {
      const data: MessageItemProps = JSON.parse(event.data);
      setMessage((prev) => [...prev, data]);
    };

    setSocket(ws);

    return () => {
      ws.close();
      setSocket(null);
    };
  }, [open, useMock]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: MessageItemProps = {
      studyroomId: 1,
      senderId: userInfo?.uid ?? "",
      username: String(userInfo?.username),
      profileImage: userInfo?.profileImageUrl || "https://picsum.photos/200/300",
      timestamp: new Date().toISOString(),
      message: input.trim(),
      isMyMessage: true,
    };

    try {
      if (useMock && socket) {
        socket.send(JSON.stringify(newMessage));
      } else {
        await sendMessageToServer(newMessage);
        setMessage((prev) => [...prev, newMessage]);
      }
      setInput("");
    } catch (error) {
      console.error("메시지 전송 실패:", error);
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  function filterDuplicateBlockedMessages(messages: MessageItemProps[]) {
    const filtered: MessageItemProps[] = [];
    let last: { senderId: string; message: string } | null = null;

    for (const msg of messages) {
      const isBlocked = checkLocalBlocked(msg.senderId);
      const isSameBlocked = last?.senderId === msg.senderId &&
                            last?.message === msg.message &&
                            isBlocked;

      console.log(`[filter] senderId: ${msg.senderId}, isBlocked: ${isBlocked}, msg: "${msg.message}"`);
      if (isSameBlocked) {
        console.log("→ 중복 차단 메시지 (동일 내용), skip!");
        continue;
      }

      filtered.push(msg);
      last = { senderId: msg.senderId, message: msg.message };
    }

    return filtered;
  }

  if(!open) return null;

  const displayedMessages = filterDuplicateBlockedMessages(messages);

  const displayedMessagesWithContinuous = displayedMessages.map((msg, idx, arr) => {
    const prevMsg = arr[idx - 1];
    const isSameSender = prevMsg?.senderId === msg.senderId;
    const isSameMessage = prevMsg?.message === msg.message;
    const isBothBlocked = checkLocalBlocked(msg.senderId) && checkLocalBlocked(prevMsg?.senderId ?? "");
    const isContinuous = isSameSender && (msg.isMyMessage || !isBothBlocked || !isSameMessage);
    return { ...msg, isContinuous };
  });

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
        <>
          {displayedMessagesWithContinuous.map((msg, idx, arr) => {
            const prevMsg = arr[idx - 1];
            const isMyMessage = String(msg.senderId) === String(userInfo?.uid ?? "");
            const isBlockedUser = checkLocalBlocked(msg.senderId);
            return (
              <MessageItem
                key={`${msg.timestamp}-${msg.senderId}`}
                studyroomId={1}
                senderId={msg.senderId}
                username={msg.username}
                profileImage={msg.profileImage}
                message={msg.message}
                timestamp={msg.timestamp}
                isMyMessage={isMyMessage}
                isContinuous={msg.isContinuous}
                blocked={isBlockedUser}
                prevMessageSenderId={prevMsg?.senderId}
                prevMessageText={prevMsg?.message}
              />
            );
          })}
          <div ref={messageEndRef} />
        </>
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