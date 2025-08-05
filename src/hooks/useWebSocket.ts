import { Client, type Message } from '@stomp/stompjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { WebSocketChatMessage, WebSocketReceivedMessage } from '../types/Message';

// 임시 해결책: 타입을 직접 정의
interface WebSocketConnectionConfig {
  url: string;
  publishPath: string;
  subscribePath: string;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: WebSocketChatMessage) => void;
  messages: WebSocketReceivedMessage[];
  connect: () => void;
  disconnect: () => void;
}

const useWebSocket = (config: WebSocketConnectionConfig, roomId: string): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketReceivedMessage[]>([]);
  const clientRef = useRef<Client | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (clientRef.current?.connected) {
      return;
    }

    try {
      const client = new Client({
        brokerURL: config.url,
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
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
            const data: WebSocketReceivedMessage = JSON.parse(message.body);
            console.log('받은 메시지:', data);
            
            if (data.type === 'chat') {
              setMessages(prev => [...prev, data]);
            }
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

  const sendMessage = useCallback((message: WebSocketChatMessage) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: config.publishPath,
        body: JSON.stringify(message)
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