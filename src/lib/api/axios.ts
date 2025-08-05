import axios from 'axios';

// 환경변수가 없으면 기본값 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080/api' 
    : 'https://api.live-study.com/api');

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