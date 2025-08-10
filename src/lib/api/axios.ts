import axios from 'axios';
import { getAuthToken } from './token';

const useMock = import.meta.env.VITE_USE_MOCK === 'true';
const API_BASE_URL =
  useMock ? '' : (import.meta.env.VITE_API_BASE_URL || 'https://api.live-study.com');

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// 모든 요청에 토큰이 있으면 Authorization 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 공통 응답 에러 처리 (401)
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        // TODO: 토큰 만료 처리(스토어 logout, /login 이동 등)
      }
      return Promise.reject(err);
    },
  );

export default api;
