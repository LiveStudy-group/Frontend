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
  ConnectionTestResult,
  GrantTitleRequest,
  GrantTitleResponse,
  LoginData,
  LoginResponse,
  LoginResult,
  LoginUser,
  ProfileApiResponse,
  ProfileImageApiResponse,
  SignUpData,
  SignUpResult,
  StatsApiResponse,
  TitlesApiResponse,
  TodayStudyTimeApiResponse,
  UpdateApiResponse,
  UpdateEmailRequest,
  UpdateNicknameRequest,
  UpdatePasswordRequest,
  UpdateProfileImageRequest,
  UpdateRepresentTitleResponse,
  UserActivity,
  UserStudyStat
} from '../../types/auth';
import api from './axios';
import { setAuthToken as setAuthTokenGlobal } from './token';
import { normalizeImageUrl, pickImageUrlFromResponse } from '../../utils/image';

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

// (중복 방지) 토큰 설정은 공용 모듈 사용
const setAuthToken = setAuthTokenGlobal;

// ============================================
// 개발/데모용 테스트 함수들 (상단 배치)
// ============================================

// 서버 연결 확인 (개발용)
export const testConnection = async (): Promise<ConnectionTestResult> => {
  try {
    await api.post('/api/auth/login', {
      email: "testuser@example.com",
      password: "test123456"
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
export const testLoginDemo = async (): Promise<{ message: string; user?: LoginUser; token?: string }> => {
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

// 마이페이지 API 테스트 함수들
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

export const testGetUserProfile = async (): Promise<{ message: string; details?: string }> => {
  try {
    const result = await getUserProfile();
    
    if (result.success && result.data) {
      return { 
        message: '✅ 프로필 조회 성공!', 
        details: JSON.stringify(result.data, null, 2)
      };
    } else {
      return { 
        message: '❌ 프로필 조회 실패', 
        details: '데이터가 없습니다.' 
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return { 
      message: '🚨 프로필 조회 API 에러', 
      details: errorMessage 
    };
  }
};

export const testGetUserTitles = async (): Promise<{ message: string; details?: string }> => {
  try {
    const result = await getUserTitles();
    
    if (result.success && result.data) {
      return { 
        message: '✅ 칭호 목록 조회 성공!', 
        details: JSON.stringify(result.data, null, 2)
      };
    } else {
      return { 
        message: '❌ 칭호 목록 조회 실패', 
        details: '데이터가 없습니다.' 
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return { 
      message: '🚨 칭호 목록 조회 API 에러', 
      details: errorMessage 
    };
  }
};

export const testUpdateRepresentTitle = async (): Promise<{ message: string; details?: string }> => {
  try {
    const result = await updateRepresentTitle(2); // titleId 2번으로 테스트
    
    if (result.success) {
      return { 
        message: '✅ 대표 칭호 변경 성공!', 
        details: JSON.stringify(result, null, 2)
      };
    } else {
      return { 
        message: '❌ 대표 칭호 변경 실패', 
        details: result.message 
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return { 
      message: '🚨 대표 칭호 변경 API 에러', 
      details: errorMessage 
    };
  }
};

export const testGetTodayStudyTime = async (): Promise<{ message: string; details?: string }> => {
  try {
    const result = await getTodayStudyTime();
    
    if (result.success && result.data) {
      return { 
        message: '✅ 오늘 공부 시간 조회 성공!', 
        details: JSON.stringify(result.data, null, 2)
      };
    } else {
      return { 
        message: '❌ 오늘 공부 시간 조회 실패', 
        details: '데이터가 없습니다.' 
      };
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
    return { 
      message: '🚨 오늘 공부 시간 조회 API 에러', 
      details: errorMessage 
    };
  }
};

// ============================================
// 실제 운영용 API 함수들 (배포 환경에서 사용) - 하단 배치
// ============================================

// 로그인 (실제 백엔드 연동)
export async function login({ email, password } : LoginData): Promise<LoginResponse> {
  console.log('🌐 login 함수 호출:', { email, password });
  
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

// 이메일 중복확인 (추후 백엔드 API 구현 예정)
export async function checkEmailDuplicate(email: string): Promise<{ isAvailable: boolean; message: string }> {
  // TODO: 추후 백엔드 API 구현 시 아래와 같이 변경
  // const response = await api.get(`/api/auth/check-email?email=${encodeURIComponent(email)}`);
  // return response.data;
  
  // 현재는 임시로 클라이언트 측 검증 + MSW Mock 사용
  
  try {
    // 개발환경에서 MSW를 사용하는 경우 Mock API 호출
    const useMock = import.meta.env.VITE_USE_MOCK === 'true';
    
    if (useMock) {
      // MSW Mock API 호출
      const response = await api.post('/api/auth/check-email', { email });
      return response.data;
    } else {
      // 실제 백엔드 API가 없는 상황에서의 임시 처리
      console.warn('⚠️ 이메일 중복확인 API가 아직 구현되지 않았습니다.');
      
      // 기본적인 클라이언트 측 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { isAvailable: false, message: '올바른 이메일 형식이 아닙니다.' };
      }
      
      // 임시로 항상 사용 가능으로 처리 (추후 실제 API 연동 필요)
      return { 
        isAvailable: true, 
        message: '클라이언트 검증 통과 (서버 검증은 회원가입 시 수행됩니다.)' 
      };
    }
  } catch (error) {
    console.error('이메일 중복확인 오류:', error);
    // 에러 발생 시 사용자가 회원가입을 시도할 수 있도록 허용
    return { 
      isAvailable: true, 
      message: '중복확인 실패. 회원가입 시도 시 서버에서 재확인됩니다.' 
    };
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



// ============================================
// authStore 연동 함수들 (상태 관리와 API 연결)
// ============================================

// authStore와 연결된 로그인 함수
export async function loginWithStore(email: string, password: string): Promise<LoginResult> {
  const { useAuthStore } = await import('../../store/authStore');
  
  console.log('🔐 loginWithStore 호출:', { email, password });
  
  try {
    const response = await login({ email, password });
    const token = response.token;

    // 토큰을 전역으로 저장 (axios 기본헤더 + localStorage)
    setAuthToken(token);

    // 실제 사용자 정보 조회
    try {
      const profileResult = await getUserProfile();
      if (profileResult.success && profileResult.data) {
        // authStore에서 기대하는 타입으로 변환
        const userData: LoginUser = {
          uid: email.split('@')[0], // TODO: 백엔드 토큰 payload에서 userId 추출하도록 개선
          email: profileResult.data.email,
          nickname: profileResult.data.nickname,
          profileImageUrl: profileResult.data.profileImage || 'default.jpg',
        };

        // authStore에 로그인 정보 저장
        useAuthStore.getState().login(userData, token);
        return { success: true, user: userData, token };
      }
    } catch (profileError) {
      console.warn('프로필 정보 조회 실패, 기본 정보 사용:', profileError);
    }

    // 프로필 조회 실패 시 기본 정보 사용
    const userData: LoginUser = {
      uid: email.split('@')[0], // 임시 UID (기존 호환성)
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
// (상단으로 이동)

// 로그인 테스트 (개발용) - 회원가입과 동일한 계정 사용
// (상단으로 이동)

// 회원가입 테스트 (개발용)
// (상단으로 이동)

// ============================================
// 마이페이지: 프로필/수정 API (정렬: 조회 → 이미지 → 닉네임 → 이메일 → 비밀번호)
// ============================================

// 프로필 조회
export async function getUserProfile(): Promise<ProfileApiResponse> {
  try {
    const response = await api.get('/api/user/profile');
    
    // 스토어 동기화: 프로필의 닉네임/이메일/이미지를 스토어에 반영
    const { useAuthStore } = await import('../../store/authStore');
    const { email, nickname } = response.data;
    const profileImage = normalizeImageUrl(response.data?.profileImage);
    useAuthStore.getState().updateUser({
      email,
      nickname,
      profileImageUrl: profileImage || 'default.jpg',
    });

    return { success: true, data: response.data };
  } catch (error: unknown) {
    handleAxiosError(error, '프로필 조회에 실패했습니다.');
    throw error;
  }
}

// 프로필 이미지 변경
export async function updateProfileImage(imageUrl: string): Promise<ProfileImageApiResponse> {
  try {
    const response = await api.patch('/api/user/profile/profileImage', {
      newProfileImage: imageUrl
    } as UpdateProfileImageRequest);
    
    const resultImageUrl = normalizeImageUrl(pickImageUrlFromResponse(response.data) || imageUrl);
    
    // authStore 업데이트
    const { useAuthStore } = await import('../../store/authStore');
    useAuthStore.getState().updateUser({ profileImageUrl: resultImageUrl });
    
    return { success: true, message: '프로필 이미지가 변경되었습니다.' };
  } catch (error: unknown) {
    handleAxiosError(error, '프로필 이미지 변경에 실패했습니다.');
    throw error;
  }
}

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

// ============================================
// 칭호 및 통계 API
// ============================================

// 사용자 통계 조회
export async function getUserStats(): Promise<StatsApiResponse> {
  try {
    const response = await api.get('/api/user/stat/normal');
    
    return { success: true, data: response.data };
  } catch (error: unknown) {
    handleAxiosError(error, '통계 조회에 실패했습니다.');
    throw error;
  }
}



// 칭호 목록 조회 (OpenAPI 실제 엔드포인트 사용)
export async function getUserTitles(userId?: number): Promise<TitlesApiResponse> {
  try {
    // 현재 로그인된 사용자의 ID를 가져오거나 매개변수로 받은 userId 사용
    let targetUserId = userId;
    if (!targetUserId) {
      // JWT payload에서 숫자형 id 추출 시도 → 실패 시 스토어 uid 사용
      try {
        const token = localStorage.getItem('authToken') || '';
        if (token) {
          const { payload } = (await import('../../utils/jwt')).parseJwt(token);
          const parsedId = Number(payload?.userId || payload?.id);
          if (!Number.isNaN(parsedId)) {
            targetUserId = parsedId;
          }
        }
      } catch {}
      if (!targetUserId) {
        const { useAuthStore } = await import('../../store/authStore');
        const uidStr = useAuthStore.getState().user?.uid || '0';
        const parsedFromUid = Number(uidStr);
        targetUserId = Number.isNaN(parsedFromUid) ? 0 : parsedFromUid;
      }
    }
    
    const response = await api.get(`/api/titles/${targetUserId}/list`);
    
    return { success: true, data: response.data };
  } catch (error: unknown) {
    handleAxiosError(error, '칭호 목록 조회에 실패했습니다.');
    return { success: false, data: [] };
  }
}

// 대표 칭호 변경 (OpenAPI 실제 엔드포인트 사용)
export async function updateRepresentTitle(titleId: number, userId?: number): Promise<UpdateRepresentTitleResponse> {
  try {
    // 현재 로그인된 사용자의 ID를 가져오거나 매개변수로 받은 userId 사용
    let targetUserId = userId;
    if (!targetUserId) {
      // JWT payload에서 숫자형 id 추출 시도 → 실패 시 스토어 uid 사용
      try {
        const token = localStorage.getItem('authToken') || '';
        if (token) {
          const { payload } = (await import('../../utils/jwt')).parseJwt(token);
          const parsedId = Number(payload?.userId || payload?.id);
          if (!Number.isNaN(parsedId)) {
            targetUserId = parsedId;
          }
        }
      } catch {}
      if (!targetUserId) {
        const { useAuthStore } = await import('../../store/authStore');
        const uidStr = useAuthStore.getState().user?.uid || '0';
        const parsedFromUid = Number(uidStr);
        targetUserId = Number.isNaN(parsedFromUid) ? 0 : parsedFromUid;
      }
    }
    
    // OpenAPI 문서 기준: POST /api/titles/{userId}/equip?titleId={titleId}
    const response = await api.post(`/api/titles/${targetUserId}/equip?titleId=${titleId}`);
    
    // authStore 업데이트 (응답 데이터로 업데이트)
    const { useAuthStore } = await import('../../store/authStore');
    if (response.data) {
      // OpenAPI 응답에서 받은 칭호 정보로 기존 호환성 유지를 위한 변환
      const selectedTitle = {
        key: `title-${response.data.titleId}`,
        name: response.data.name,
        description: response.data.description,
        icon: '🏆', // 기본 아이콘
        type: '성취',
        acquiredAt: new Date().toISOString().split('T')[0],
        isRepresent: true
      };
      useAuthStore.getState().updateUser({ title: selectedTitle });
    }
    
    return { 
      success: true, 
      message: '대표 칭호가 변경되었습니다.',
      data: response.data 
    };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '대표 칭호 변경에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 칭호 지급 평가 및 지급 (OpenAPI 실제 엔드포인트 사용)
export async function evaluateAndGrantTitles(
  userId: string, 
  activity: UserActivity, 
  stat: UserStudyStat
): Promise<{ success: boolean; data?: GrantTitleResponse; message: string }> {
  try {
    const requestData: GrantTitleRequest = {
      userId,
      activity,
      stat
    };
    
    const response = await api.post('/api/titles/evaluate', requestData);
    
    return { 
      success: true, 
      data: response.data,
      message: '칭호 평가가 완료되었습니다.' 
    };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '칭호 평가에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}

// 오늘 공부 시간 조회
export async function getTodayStudyTime(): Promise<TodayStudyTimeApiResponse> {
  try {
    const response = await api.get('/api/user/stat/today-study-time');
    
    return { success: true, data: response.data };
  } catch (error: unknown) {
    handleAxiosError(error, '오늘 공부 시간 조회에 실패했습니다.');
    throw error;
  }
}

// (테스트 함수 섹션은 상단으로 이동)

// 프로필 이미지 업로드 (마이페이지용)
export async function uploadProfileImage(imageFile: File): Promise<{ success: boolean; message: string; imageUrl?: string }> {
  try {
    const formData = new FormData();
    formData.append('imageFile', imageFile);
    
    const response = await api.post('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const imageUrl = normalizeImageUrl(pickImageUrlFromResponse(response.data));
    
    return { 
      success: true, 
      message: '프로필 이미지가 업로드되었습니다.',
      imageUrl
    };
  } catch (error: unknown) {
    const errorMessage = handleAxiosError(error, '이미지 업로드에 실패했습니다.');
    return { success: false, message: errorMessage };
  }
}