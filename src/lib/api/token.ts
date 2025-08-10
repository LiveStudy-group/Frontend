import api from './axios';

export function setAuthToken(token: string | null) {
  if (token) {
    // axios 기본 헤더에 설정
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // localStorage에도 저장 (인터셉터에서 사용)
    localStorage.setItem('authToken', token);
  } else {
    // axios 기본 헤더에서 제거
    delete api.defaults.headers.common['Authorization'];
    // localStorage에서도 제거
    localStorage.removeItem('authToken');
  }
}

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}