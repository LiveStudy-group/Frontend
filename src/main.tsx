import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './styles/global.css';

(async () => {
  // ========================================
  // Mock API 제어 (개발/테스트 환경용)
  // ========================================
  // 환경변수: VITE_USE_MOCK=true 설정 시만 Mock 사용
  // 실제 배포에서는 사용되지 않음
  
  // Mock API 활성화 (개발/테스트 환경용)
  const useMock = import.meta.env.VITE_USE_MOCK === 'true'; // 환경변수로 제어
  
  if (useMock) {
    const { worker, workerOptions } = await import('./mocks/browser.ts')
    console.log('🔧 MSW worker 시작 중...');
    await worker.start(workerOptions)
    console.log('🎭 개발모드: Mock API 활성화됨');
    
    // 디버깅: 등록된 핸들러 확인
    worker.listHandlers().forEach(handler => {
      console.log('📍 등록된 핸들러:', handler.info.header);
    });
  } else {
    console.log('🚀 운영모드: 실제 백엔드 API 사용 중');
  }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)})()
