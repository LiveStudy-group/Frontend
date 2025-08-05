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

import axios from 'axios';
import type {
  AverageFocusRatioApiResponse,
  ConnectionTestResult,
  DailyFocusApiResponse,
  LoginData,
  LoginResponse,
  LoginResult,
  ProfileApiResponse,
  ProfileImageApiResponse,
  SignUpData,
  SignUpResult,
  StatsApiResponse,
  TitlesApiResponse,
  UpdateApiResponse,
  UpdateEmailRequest,
  UpdateNicknameRequest,
  UpdatePasswordRequest,
  UpdateProfileImageRequest,
  UpdateRepresentTitleRequest,
  UpdateRepresentTitleResponse,
  UserData
} from '../../types/auth';
import api from './axios';

// ============================================
// 에러 처리 및 유틸리티 함수들
// ============================================

export function handleAxiosError(error: unknown, defaultMessage: string): string {
  if(axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data;
    
    // 상태코드별 에러 메시지
    switch(status) {
      case 400:
        return message || '요청값이 유효하지 않습니다.';
      case 401:
        return message || '인증에 실패했습니다.';
      case 409:
        return message || '이미 존재하는 정보입니다.';
      case 500:
        return '서버 내부 오류가 발생했습니다.';
      default:
        return message || defaultMessage;
    }
  }
  return '네트워크 오류가 발생했습니다.';
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

// 이메일 중복확인 (실제 백엔드 연동)
export async function checkEmailDuplicate(email: string): Promise<{ isAvailable: boolean; message: string }> {
  try {
    const response = await api.get(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
    return { isAvailable: true, message: '사용 가능한 이메일입니다.' };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      return { isAvailable: false, message: '이미 사용 중인 이메일입니다.' };
    }
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

// 로그인 테스트 (개발용) - 회원가입과 동일한 계정 사용
export const testLoginDemo = async (): Promise<{ message: string; user?: UserData; token?: string }> => {
  // 먼저 회원가입된 계정이 있는지 확인하고, 없으면 고정 테스트 계정 사용
  const result = await loginWithStore("testuser@example.com", "test123456");
  
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
  // 랜덤 계정으로 회원가입 시도하여 중복 문제 방지
  const randomId = Math.floor(Math.random() * 10000);
  const testEmail = `testuser${randomId}@example.com`;
  
  const result = await signUpWithStore({
    email: testEmail,
    password: "test123456",
    nickname: `신규유저${randomId}`,
    introduction: "백엔드 연동 테스트입니다!"
  });
  
  if (result.success) {
    return { 
      message: '✅ 회원가입 성공!',
      email: testEmail
    };
  } else {
    // 500 에러도 처리 (서버 내부 문제일 수 있음)
    if (result.error?.includes('이미 존재') || result.error?.includes('409') || result.error?.includes('500')) {
      return {
        message: `⚠️ 회원가입 오류: ${result.error}`,
        email: testEmail
      };
    }
    throw new Error(result.error);
  }
};

// ============================================
// 마이페이지 사용자 정보 수정 API 함수들
// ============================================

// 닉네임 변경
export async function updateNickname(nickname: string): Promise<UpdateApiResponse> {
  try {
    await api.patch('/api/user/profile/nickname', {
      newNickname: nickname
    } as UpdateNicknameRequest);
    
    // authStore 업데이트
    const { useAuthStore } = await import('../../store/authStore');
    useAuthStore.getState().updateUser({ nickname });
    
    return { success: true, message: '닉네임이 변경되었습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '닉네임 변경에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 이메일 변경
export async function updateEmail(email: string): Promise<UpdateApiResponse> {
  try {
    await api.patch('/api/user/profile/email', {
      newEmail: email
    } as UpdateEmailRequest);
    
    // authStore 업데이트
    const { useAuthStore } = await import('../../store/authStore');
    useAuthStore.getState().updateUser({ email });
    
    return { success: true, message: '이메일이 변경되었습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '이메일 변경에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 비밀번호 변경
export async function updatePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<UpdateApiResponse> {
  try {
    await api.patch('/api/user/profile/password', {
      currentPassword,
      newPassword,
      confirmNewPassword
    } as UpdatePasswordRequest);
    
    return { success: true, message: '비밀번호가 변경되었습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '비밀번호 변경에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 프로필 이미지 변경
export async function updateProfileImage(imageUrl: string): Promise<ProfileImageApiResponse> {
  try {
    const response = await api.patch('/api/user/profile/profileImage', {
      newProfileImage: imageUrl
    } as UpdateProfileImageRequest);
    
    const resultImageUrl = response.data.imageUrl || imageUrl;
    
    // authStore 업데이트
    const { useAuthStore } = await import('../../store/authStore');
    useAuthStore.getState().updateUser({ profileImageUrl: resultImageUrl });
    
    return { success: true, imageUrl: resultImageUrl, message: '프로필 이미지가 변경되었습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '프로필 이미지 변경에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 프로필 조회
export async function getUserProfile(): Promise<ProfileApiResponse> {
  try {
    const response = await api.get('/api/user/profile');
    
    return { success: true, profile: response.data, message: '프로필을 불러왔습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '프로필 조회에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 사용자 통계 조회
export async function getUserStats(): Promise<StatsApiResponse> {
  try {
    const response = await api.get('/api/user/stat/normal');
    
    return { success: true, stats: response.data, message: '통계를 불러왔습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '통계 조회에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 일별 집중도 추이 조회
export async function getDailyFocus(startDate?: string, endDate?: string): Promise<DailyFocusApiResponse> {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/api/user/stat/daily-focus?${params.toString()}`);
    
    return { success: true, dailyFocus: response.data, message: '일별 집중도를 불러왔습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '일별 집중도 조회에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 평균 집중률 조회
export async function getAverageFocusRatio(startDate?: string, endDate?: string): Promise<AverageFocusRatioApiResponse> {
  try {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const response = await api.get(`/api/user/stat/average-focus-ratio?${params.toString()}`);
    
    return { success: true, averageFocusRatio: response.data, message: '평균 집중률을 불러왔습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '평균 집중률 조회에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 칭호 목록 조회
export async function getUserTitles(): Promise<TitlesApiResponse> {
  try {
    const response = await api.get('/api/user/titles');
    
    return { success: true, titles: response.data.titles, message: '칭호 목록을 불러왔습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '칭호 목록 조회에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 대표 칭호 변경
export async function updateRepresentTitle(titleKey: string): Promise<UpdateRepresentTitleResponse> {
  try {
    const response = await api.patch('/api/user/titles/represent', {
      titleKey
    } as UpdateRepresentTitleRequest);
    
    const title = response.data.title;
    
    // authStore 업데이트
    const { useAuthStore } = await import('../../store/authStore');
    useAuthStore.getState().updateUser({ title });
    
    return { success: true, title, message: '대표 칭호가 변경되었습니다.' };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '대표 칭호 변경에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// ============================================
// 마이페이지 API 테스트 함수들 (개발용)
// ============================================

// 닉네임 변경 테스트
export const testUpdateNickname = async (): Promise<{ message: string; details?: string }> => {
  try {
    const testNickname = `테스트유저${Math.floor(Math.random() * 1000)}`;
    const result = await updateNickname(testNickname);
    
    if (result.success) {
      return { 
        message: '✅ 닉네임 변경 성공!', 
        details: `새 닉네임: ${testNickname}`
      };
    } else {
      return { 
        message: '❌ 닉네임 변경 실패', 
        details: result.message 
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return { 
      message: '🚨 닉네임 변경 API 에러', 
      details: errorMessage 
    };
  }
};

// 이메일 변경 테스트  
export const testUpdateEmail = async (): Promise<{ message: string; details?: string }> => {
  try {
    const testEmail = `test${Math.floor(Math.random() * 1000)}@example.com`;
    const result = await updateEmail(testEmail);
    
    if (result.success) {
      return { 
        message: '✅ 이메일 변경 성공!', 
        details: `새 이메일: ${testEmail}`
      };
    } else {
      return { 
        message: '❌ 이메일 변경 실패', 
        details: result.message 
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return { 
      message: '🚨 이메일 변경 API 에러', 
      details: errorMessage 
    };
  }
};

// 비밀번호 변경 테스트
export const testUpdatePassword = async (): Promise<{ message: string; details?: string }> => {
  try {
    const currentPassword = "test123456"; // 테스트 계정의 현재 비밀번호
    const newPassword = "newtest123456";
    const confirmNewPassword = "newtest123456";
    
    const result = await updatePassword(currentPassword, newPassword, confirmNewPassword);
    
    if (result.success) {
      return { 
        message: '✅ 비밀번호 변경 성공!', 
        details: '비밀번호가 성공적으로 변경되었습니다'
      };
    } else {
      return { 
        message: '❌ 비밀번호 변경 실패', 
        details: result.message 
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return { 
      message: '🚨 비밀번호 변경 API 에러', 
      details: errorMessage 
    };
  }
};

// 프로필 이미지 변경 테스트
export const testUpdateProfileImage = async (): Promise<{ message: string; details?: string }> => {
  try {
    const testImageUrl = `https://example.com/test-image-${Math.floor(Math.random() * 1000)}.jpg`;
    const result = await updateProfileImage(testImageUrl);
    
    if (result.success) {
      return { 
        message: '✅ 프로필 이미지 변경 성공!', 
        details: `새 이미지 URL: ${testImageUrl}`
      };
    } else {
      return { 
        message: '❌ 프로필 이미지 변경 실패', 
        details: result.message 
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return { 
      message: '🚨 프로필 이미지 변경 API 에러', 
      details: errorMessage 
    };
  }
};