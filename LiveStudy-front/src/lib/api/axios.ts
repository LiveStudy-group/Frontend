import axios from 'axios';

const api = axios.create({
  baseURL: 'https://live-study.com/', // 실제 배포 서버 (CORS 설정 요청 중)
  // withCredentials: true, // JWT 토큰 사용 시 필요할 수 있음
  timeout: 10000, // 10초 타임아웃
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

export default api;