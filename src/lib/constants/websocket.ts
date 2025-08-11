// 임시 해결책: 타입을 직접 정의
interface WebSocketConnectionConfig {
  url: string;
  publishPath: string;
  subscribePath: string;
}

export const WEBSOCKET_CONFIG: WebSocketConnectionConfig = {
  url: import.meta.env.VITE_WS_URL ?? 'wss://api.live-study.com/ws',
  publishPath: import.meta.env.VITE_WS_PUB_PATH ?? '/pub/chat',
  subscribePath: import.meta.env.VITE_WS_SUB_PATH ?? '/topic/messages'
};