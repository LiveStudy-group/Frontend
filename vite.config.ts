import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // 백엔드 CORS 설정에 맞춰 포트 고정
    // 실제 배포 환경과 동일 - 프록시 제거
    // CORS 해결되면 바로 동작
  }
})
