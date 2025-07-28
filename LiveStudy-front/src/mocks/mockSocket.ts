import { Server } from 'mock-socket';

let mockServer: Server | null = null;

export const setupMockSocketServer = () => {
  if(mockServer) return;

  mockServer = new Server('ws://localhost:1234');

  mockServer.on('connection', (socket) => {
    console.log('[MockSocket] 클라이언트 연결됨');

    socket.on('message', (data) => {
      console.log('[MockSocket]', data);

      socket.send(data);
    })

    socket.on('close', () => {
      console.log('[MockSocket] 연결종료')
    })
  })
  
  return mockServer;
}