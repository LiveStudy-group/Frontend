/*
 * ============================================
 * LiveStudy 백엔드 API 연동 모듈
 * ============================================
 * 
 * 이 파일은 실제 백엔드 API와 연동되는 함수들을 포함합니다.
 * OpenAPI 스펙 기준으로 구현되었으며, 배포 환경에서 사용됩니다.
 * 
 * 구조:
 * 1. 실제 운영용 API 함수들 (login, signup 등)
 * 2. authStore 연동 함수들 (로그인 상태 관리)
 * 3. 개발/데모용 테스트 함수들 (개발 환경에서만 사용)
 */

import api from './axios';
import axios from 'axios';

// ============================================
// 타입 정의 (실제 백엔드 API 스펙 기준)
// ============================================
interface SignUpData {
  email: string;
  password: string;
  nickname: string;
  introduction?: string;
  profileImage?: string;
  socialProvider?: 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';
}

interface LoginData {
  email: string;
  password: string;
}

// 실제 백엔드 응답 형식 (OpenAPI 스펙 기준)
interface LoginResponse {
  token: string; // JWT Access Token
}

// 함수 반환 타입들
interface UserData {
  uid: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

interface LoginResult {
  success: boolean;
  user?: UserData;
  token?: string;
  error?: string;
}

interface SignUpResult {
  success: boolean;
  message?: string;
  error?: string;
}

interface ConnectionTestResult {
  message: string;
  status?: number;
  data?: unknown;
  error?: string | null;
}

// ============================================
// 에러 처리 및 유틸리티 함수들
// ============================================

export function handleAxiosError(error: unknown, defaultMessage: string) {
  if(axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data;
    
    // 상태코드별 에러 메시지
    switch(status) {
      case 400:
        throw new Error(message || '요청값이 유효하지 않습니다.');
      case 401:
        throw new Error(message || '인증에 실패했습니다.');
      case 409:
        throw new Error(message || '이미 존재하는 정보입니다.');
      case 500:
        throw new Error('서버 내부 오류가 발생했습니다.');
      default:
        throw new Error(message || defaultMessage);
    }
  }
  throw new Error('네트워크 오류가 발생했습니다.')
}

// JWT 토큰을 axios 인터셉터에 설정
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

// ============================================
// 실제 운영용 API 함수들 (배포 환경에서 사용)
// ============================================

// 로그인 (실제 백엔드 연동)
export async function login({ email, password } : LoginData): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    });

    // JWT 토큰을 axios 헤더에 설정
    const token = response.data.token;
    setAuthToken(token);
    
    return response.data; // { token: "eyJhbGciOiJIUzI1..." }
  } catch (error) {
    handleAxiosError(error, '로그인에 실패했습니다.');
    throw error;
  }
}

// 회원가입 (실제 백엔드 연동)
export async function signUp({ email, password, nickname, introduction, profileImage, socialProvider }: SignUpData): Promise<unknown> {
  try {
    const response = await api.post('/api/auth/signup', {
      email,
      password,
      nickname,
      introduction: introduction || '안녕하세요!',
      profileImage: profileImage || 'default.jpg',
      socialProvider: socialProvider || 'LOCAL'
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, '회원가입에 실패했습니다.');
    throw error;
  }
}

// 스터디룸 입장
export async function enterStudyRoom(userId: string): Promise<unknown> {
  try {
    const response = await api.post('/api/study-rooms/enter', null, {
      params: { userId }
    });
    return response.data; // 방 ID 반환
  } catch (error) {
    handleAxiosError(error, '스터디룸 입장에 실패했습니다.');
    throw error;
  }
}

// ============================================
// authStore 연동 함수들 (상태 관리와 API 연결)
// ============================================

// authStore와 연결된 로그인 함수
export async function loginWithStore(email: string, password: string): Promise<LoginResult> {
  const { useAuthStore } = await import('../../store/authStore');
  
  try {
    const response = await login({ email, password });
    const token = response.token;

    // JWT에서 사용자 정보 추출 (임시로 기본값 사용)
    // 실제로는 JWT 디코딩하거나 별도 API로 사용자 정보 조회
    const userData = {
      uid: email.split('@')[0], // 임시 UID
      email,
      nickname: email.split('@')[0], // 임시 닉네임
      profileImageUrl: 'default.jpg',
    };

    // authStore에 로그인 정보 저장
    useAuthStore.getState().login(userData, token);

    return { success: true, user: userData, token };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '로그인 처리 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

// authStore와 연결된 회원가입 함수  
export async function signUpWithStore(userData: {
  email: string;
  password: string;
  nickname: string;
  introduction?: string;
}): Promise<SignUpResult> {
  try {
    await signUp({
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname,
      introduction: userData.introduction,
      profileImage: 'default.jpg',
      socialProvider: 'LOCAL'
    });

    return { success: true, message: '회원가입이 완료되었습니다.' };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '회원가입 처리 중 오류가 발생했습니다.';
    return { success: false, error: errorMessage };
  }
}

// authStore와 연결된 로그아웃 함수
export async function logoutWithStore(): Promise<{ success: boolean; message: string }> {
  const { useAuthStore } = await import('../../store/authStore');
  
  // JWT 토큰 제거
  setAuthToken(null);
  
  // authStore에서 로그아웃
  useAuthStore.getState().logout();
  
  return { success: true, message: '로그아웃되었습니다.' };
}

// ============================================
// 개발/데모용 테스트 함수들
// ============================================
// 주의: 이 함수들은 개발 환경에서만 사용됩니다.
// 실제 배포에서는 위의 운영용 함수들을 직접 사용하세요.

// 서버 연결 확인 (개발용)
export const testConnection = async (): Promise<ConnectionTestResult> => {
  try {
    await api.post('/api/auth/login', {
      email: "connection-test@test.com",
      password: "test"
    });
    return { message: "서버 연결 성공 (인증 실패는 정상)", error: null };
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return { 
        message: "서버 연결 성공", 
        status: error.response.status,
        data: error.response.data 
      };
    } else {
      throw error;
    }
  }
};

// 로그인 테스트 (개발용)
export const testLoginDemo = async (): Promise<{ message: string; user?: UserData; token?: string }> => {
  const result = await loginWithStore("test@example.com", "test123");
  
  if (result.success) {
    return { 
      message: '✅ 로그인 성공!', 
      user: result.user,
      token: result.token?.substring(0, 20) + '...'
    };
  } else {
    throw new Error(result.error);
  }
};

// 회원가입 테스트 (개발용)
export const testSignupDemo = async (): Promise<{ message: string; email?: string }> => {
  const randomId = Math.floor(Math.random() * 1000);
  const result = await signUpWithStore({
    email: `testuser${randomId}@example.com`,
    password: "test123456",
    nickname: `테스트유저${randomId}`,
    introduction: "백엔드 연동 테스트입니다!"
  });
  
  if (result.success) {
    return { 
      message: '✅ 회원가입 성공!',
      email: `testuser${randomId}@example.com`
    };
  } else {
    throw new Error(result.error);
  }
};