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

// JWT 토큰을 요청 헤더에 자동으로 추가하는 인터셉터
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;