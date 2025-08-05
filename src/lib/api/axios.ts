import axios from 'axios';

// 실제 백엔드 API 엔드포인트 설정
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.live-study.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

export default api;