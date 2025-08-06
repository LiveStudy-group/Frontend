// 임시 해결책: 타입을 직접 정의
interface WebSocketConnectionConfig {
  url: string;
  publishPath: string;
  subscribePath: string;
}

export const WEBSOCKET_CONFIG: WebSocketConnectionConfig = {
  url: 'wss://api.live-study.com/ws',
  publishPath: '/pub/api/study-room/chat',
  subscribePath: '/topic/{roomId}'
}; 