// ============================================
// 인증 관련 타입 정의
// ============================================

// 회원가입 요청 타입
export interface SignUpData {
  email: string;
  password: string;
  nickname: string;
  introduction?: string;
  profileImage?: string;
  socialProvider?: 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';
}

// 로그인 요청 타입
export interface LoginData {
  email: string;
  password: string;
}

// 로그인 응답 타입
export interface LoginResponse {
  token: string; // JWT Access Token
}

// 사용자 데이터 타입 (OpenAPI 최신 문서 기준)
export interface UserData {
  id: number;
  email: string;
  nickname: string;
  profileImage?: string;
  introduction?: string;
  socialProvider: 'LOCAL' | 'GOOGLE' | 'KAKAO' | 'NAVER';
  userStatus: 'NORMAL' | 'TEMPORARY_BAN' | 'PERMANENT_BAN';
  equippedBadge: string;
  newUser: boolean;
}

// 로그인된 사용자 정보 타입 (기존 호환성 유지)
export interface LoginUser {
  uid: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

// 로그인 결과 타입
export interface LoginResult {
  success: boolean;
  user?: LoginUser;
  token?: string;
  error?: string;
}

// 회원가입 결과 타입
export interface SignUpResult {
  success: boolean;
  message?: string;
  error?: string;
}

// 연결 테스트 결과 타입
export interface ConnectionTestResult {
  message: string;
  status?: number;
  data?: unknown;
  error?: string | null;
}

// ============================================
// 마이페이지 관련 타입 정의 (OpenAPI 최신 문서 기준)
// ============================================

// 프로필 관련 타입
export interface UserProfileResponse {
  profileImage: string;
  nickname: string;
  email: string;
  selectedTitle: string;
  totalStudyTime: number;
  totalAttendanceDays: number;
  continueAttendanceDays: number;
}

// 통계 관련 타입
export interface UserStudyStatsResponse {
  userId: number;
  nickname: string;
  totalStudyTime: number;
  totalAwayTime: number;
  totalAttendanceDays: number;
  continueAttendanceDays: number;
  lastAttendanceDate: string;
}

// 오늘 공부 시간 응답 타입
export interface TodayStudyTimeResponse {
  todayStudyTime: number;
}



// 마이페이지 수정 요청 타입
export interface UpdateNicknameRequest {
  newNickname: string;
}

export interface UpdateEmailRequest {
  newEmail: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateProfileImageRequest {
  newProfileImage: string;
}

// ============================================
// API 응답 타입들 (OpenAPI 최신 문서 기준)
// ============================================

// 프로필 API 응답 타입
export interface ProfileApiResponse {
  success: boolean;
  data: UserProfileResponse;
}

// 통계 API 응답 타입
export interface StatsApiResponse {
  success: boolean;
  data: UserStudyStatsResponse;
}

// 오늘 공부 시간 API 응답 타입
export interface TodayStudyTimeApiResponse {
  success: boolean;
  data: TodayStudyTimeResponse;
}



// 수정 API 응답 타입
export interface UpdateApiResponse {
  success: boolean;
  message: string;
}

// 프로필 이미지 API 응답 타입
export interface ProfileImageApiResponse {
  success: boolean;
  message: string;
}

// ============================================
// 칭호 관련 타입 (OpenAPI 최신 문서 기준)
// ============================================

// 칭호 응답 타입 (OpenAPI 문서와 정확히 일치)
export interface UserTitleResponse {
  titleId: number;
  name: string;
  description: string;
  representative: boolean;
  isRepresentative: boolean;
}

// 칭호 목록 조회 응답 타입
export interface TitlesApiResponse {
  success: boolean;
  data: UserTitleResponse[];
}

// 대표 칭호 변경 응답 타입
export interface UpdateRepresentTitleResponse {
  success: boolean;
  message: string;
  data?: UserTitleResponse;
}

// 칭호 지급 요청 타입
export interface GrantTitleRequest {
  userId: string;
  activity: UserActivity;
  stat: UserStudyStat;
}

// 사용자 활동 타입
export interface UserActivity {
  consecutiveFocusDays: number;
  oneHourFocusStreak: number;
  totalChatCount: number;
  enteredFirstRoom: boolean;
  reportCount: number;
  lastLoginTime: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  earnedTitleCount: number;
  loggedInAt9AmToday: boolean;
  consecutiveFocusDaysOverHour: number;
}

// 사용자 통계 타입
export interface UserStudyStat {
  id: number;
  totalAttendanceDays: number;
  continueAttendanceDays: number;
  lastAttendanceDate: string;
  totalStudyTime: number;
  totalAwayTime: number;
  consecutiveFocusDaysOverHour: number;
  titleCount: number;
}

// 칭호 지급 응답 타입
export interface GrantTitleResponse {
  grantedTitleNames: string[];
}

// ============================================
// 기존 호환성을 위한 타입들 (점진적 제거 예정)
// ============================================

// 칭호 정보 타입 (기존 호환성)
export interface Title {
  key: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  acquiredAt: string;
  isRepresent: boolean;
} 