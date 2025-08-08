import { Server } from 'mock-socket';

// roomId별로 서버 인스턴스를 관리
const mockServers: Map<number, Server> = new Map();

export const setupMockSocketServer = (roomId: number = 1) => {
  // 이미 해당 roomId용 서버가 있으면 반환
  if (mockServers.has(roomId)) {
    return mockServers.get(roomId);
  }

  const serverUrl = `ws://localhost:${1234 + roomId}`; // roomId별로 다른 포트 사용
  const mockServer = new Server(serverUrl);

  mockServer.on('connection', (socket) => {
    console.log(`[MockSocket-Room${roomId}] 클라이언트 연결됨`);

    socket.on('message', (data) => {
      console.log(`[MockSocket-Room${roomId}]`, data);
      
      // 같은 룸의 모든 클라이언트에게 메시지 브로드캐스트
      mockServer.clients().forEach((client) => {
        if (client !== socket && client.readyState === 1) {
          client.send(data);
        }
      });
      
      // 자신에게도 메시지 전송 (에코)
      socket.send(data);
    });

    socket.on('close', () => {
      console.log(`[MockSocket-Room${roomId}] 연결종료`);
    });
  });
  
  mockServers.set(roomId, mockServer);
  return mockServer;
};

// 특정 roomId의 서버 URL 반환
export const getMockSocketUrl = (roomId: number = 1): string => {
  return `ws://localhost:${1234 + roomId}`;
};

// 모든 Mock 서버 정리
export const cleanupMockServers = () => {
  mockServers.forEach((server) => {
    server.stop();
  });
  mockServers.clear();
};