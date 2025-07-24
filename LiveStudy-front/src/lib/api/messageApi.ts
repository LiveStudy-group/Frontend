import type { MessageItemProps } from "../../types/Message";

export async function sendMessageToServer(message: MessageItemProps) {
  const response = await fetch('/api/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });


  if(!response.ok) {
    throw new Error('메시지 전송이 실패했습니다.');
  }

  return response.json();
}
