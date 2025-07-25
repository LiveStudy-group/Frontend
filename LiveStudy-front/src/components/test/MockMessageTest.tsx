import { WebSocket } from "mock-socket";
import { useEffect, useState } from "react";
import { setupMockSocketServer } from "../../mocks/mockSocket";


const MockMessageTest = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    setupMockSocketServer();

    const ws = new WebSocket('ws:localhost:1234');
    setSocket(ws);

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      ws.close();
    }
  }, [])

  const handleSend = () => {
    if(socket && input.trim()) {
      socket.send(input);
      setInput('');
    }
  }

  return (
    <div className="p-4 border rounded max-w-md mx-auto">
      <h2 className="font-bold mb-2">💬 MockSocket 테스트</h2>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border px-2 py-1 flex-1"
          placeholder="메시지를 입력하세요"
        />
        <button onClick={handleSend} className="px-4 py-1 bg-blue-500 text-white rounded">
          전송
        </button>
      </div>
      <ul className="text-sm space-y-1">
        {messages.map((msg, i) => (
          <li key={i}>📩 {msg}</li>
        ))}
      </ul>
    </div>
  )
};

export default MockMessageTest;