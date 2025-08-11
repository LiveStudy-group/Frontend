import { Client, type Message } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import type { WebSocketConnectionConfig, WsInboundMessage, WsOutboundMessage } from '../types/Message';

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: WsOutboundMessage) => void;
  messages: WsInboundMessage[];
  connect: () => void;
  disconnect: () => void;
}

const useWebSocket = (config: WebSocketConnectionConfig, roomId: string): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WsInboundMessage[]>([]);
  const clientRef = useRef<Client | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (clientRef.current?.connected) {
      return;
    }

    try {
      const authToken = useAuthStore.getState().token;
      // 핸드셰이크 단계에서 토큰을 쿼리로 전달 (브라우저는 커스텀 헤더 불가)
      const urlWithToken = authToken
        ? `${config.url}${config.url.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(authToken)}`
        : config.url;
      const client = new Client({
        brokerURL: urlWithToken,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        connectHeaders: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      client.onConnect = () => {
        console.log('STOMP 클라이언트 연결됨');
        setIsConnected(true);
        
        // 구독
        const subscribePath = config.subscribePath.replace('{roomId}', roomId);
         client.subscribe(subscribePath, (message: Message) => {
          try {
            const data: WsInboundMessage = JSON.parse(message.body);
            console.log('받은 메시지:', data);
            // 최근 500개까지만 보관하여 메모리 증가 방지
            setMessages(prev => {
              const next = [...prev, data];
              return next.length > 500 ? next.slice(next.length - 500) : next;
            });
          } catch (error) {
            console.error('메시지 파싱 오류:', error);
          }
        });
      };

      client.onStompError = (frame) => {
        console.error('STOMP 오류:', frame);
        setIsConnected(false);
      };

      client.onDisconnect = () => {
        console.log('STOMP 클라이언트 연결 종료');
        setIsConnected(false);
      };

      clientRef.current = client;
      client.activate();

    } catch (error) {
      console.error('STOMP 클라이언트 연결 실패:', error);
      setIsConnected(false);
    }
  }, [config.url, config.subscribePath, roomId]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: WsOutboundMessage) => {
    if (clientRef.current?.connected) {
      const destination = config.publishPath.replace('{roomId}', message.roomId);
      clientRef.current.publish({
        destination,
        headers: { Authorization: useAuthStore.getState().token ? `Bearer ${useAuthStore.getState().token}` : '' },
        body: JSON.stringify({
          senderId: message.senderId,
          roomId: message.roomId,
          content: message.content,
          timestamp: message.timestamp ?? new Date().toISOString(),
        })
      });
      console.log('메시지 전송:', message);
    } else {
      console.error('STOMP 클라이언트가 연결되지 않았습니다.');
    }
  }, [config.publishPath]);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    sendMessage,
    messages,
    connect,
    disconnect
  };
};

export default useWebSocket; 