import type { MessageItemProps } from "../../types/Message";

// 메시지를 REST API를 통해 서버로 전송
export async function sendMessageToServer(message: MessageItemProps) {
  const response = await fetch(`/api/study-room/${message.studyroomId}/chat/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content: message.message,       // 백엔드 명세에 맞게 key를 'content'로 수정
      senderId: Number(message.senderId), // senderId가 string이면 number로 변환
      timestamp: message.timestamp,
    }),
  });

  if (!response.ok) {
    throw new Error('메시지 전송이 실패했습니다.');
  }

  return response.json();
}

/*
  향후 WebSocket 사용 시 아래와 같은 형태로 메시지 전송이 가능
  const socket = new WebSocket("wss://your-api-domain/ws");

  socket.send(JSON.stringify({
    studyroomId: message.studyroomId,
    senderId: message.senderId,
    content: message.message,
    timestamp: message.timestamp,
  }));
*/
