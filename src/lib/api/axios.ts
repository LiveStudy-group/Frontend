import axios from 'axios';

// Mock API 환경에서는 상대 경로 사용, 실제 환경에서는 절대 URL 사용
const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE_URL = useMock ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://api.live-study.com');

const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// JWT 토큰을 요청 헤더에 자동으로 추가하는 인터셉터 (인증이 필요한 API에만)
api.interceptors.request.use(
  (config) => {
    // 인증이 필요한 API 경로들
    const authRequiredPaths = [
      '/api/user/profile',
      '/api/user/stat',
      '/api/user/titles',
      '/api/titles',
      '/api/user/profile/nickname',
      '/api/user/profile/email',
      '/api/user/profile/password',
      '/api/user/profile/profileImage'
    ];
    
    // 현재 요청 URL이 인증이 필요한 API인지 확인
    const isAuthRequired = authRequiredPaths.some(path => 
      config.url?.includes(path)
    );
    
    // 인증이 필요한 API에만 토큰 추가
    if (isAuthRequired) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('�� 인증 토큰 추가:', config.url);
      } else {
        console.warn('⚠️ 토큰이 없습니다:', config.url);
      }
    } else {
      console.log('🔓 인증 불필요한 API:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;