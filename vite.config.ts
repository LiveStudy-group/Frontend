import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // 백엔드 CORS 설정에 맞춰 포트 고정
    proxy: {
      '/api': {
        target: 'http://api.live-study.com', // 실제 백엔드 서버 주소
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '/api'), // /api 유지
      },
    },
  },
});
