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

// 사용자 데이터 타입
export interface UserData {
  uid: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

// 로그인 결과 타입
export interface LoginResult {
  success: boolean;
  user?: UserData;
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
// 마이페이지 관련 타입 정의
// ============================================

// 프로필 관련 타입 (API 명세서 기준)
export interface UserProfileResponse {
  profileImage: string;
  nickname: string;
  email: string;
  selectedTitle: string;
  totalStudyTime: number;
}

// 통계 관련 타입 (API 명세서 기준)
export interface UserStudyStatsResponse {
  userId: number;
  nickname: string;
  totalStudyTime: number;
  totalAwayTime: number;
  totalAttendanceDays: number;
  continueAttendanceDays: number;
  lastAttendanceDate: string;
}

// 일별 기록 응답 타입
export interface DailyRecordResponse {
  recordDate: string;
  dailyStudyTime: number;
  dailyAwayTime: number;
  focusRatio: number;
}

// 평균 집중률 응답 타입
export interface AverageFocusRatioResponse {
  startDate: string;
  endDate: string;
  averageFocusRatio: number;
}

// 마이페이지 수정 요청 타입 (API 명세서 기준)
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
// API 응답 타입들
// ============================================

// 프로필 API 응답 타입
export interface ProfileApiResponse {
  success: boolean;
  profile?: UserProfileResponse;
  message: string;
}

// 통계 API 응답 타입
export interface StatsApiResponse {
  success: boolean;
  stats?: UserStudyStatsResponse;
  message: string;
}

// 일별 집중도 API 응답 타입
export interface DailyFocusApiResponse {
  success: boolean;
  dailyFocus?: DailyRecordResponse[];
  message: string;
}

// 평균 집중률 API 응답 타입
export interface AverageFocusRatioApiResponse {
  success: boolean;
  averageFocusRatio?: AverageFocusRatioResponse;
  message: string;
}

// 수정 API 응답 타입
export interface UpdateApiResponse {
  success: boolean;
  message: string;
}

// 프로필 이미지 API 응답 타입
export interface ProfileImageApiResponse {
  success: boolean;
  imageUrl?: string;
  message: string;
}

// ============================================
// 칭호 관련 타입 (추후 구현 예정)
// ============================================

// 칭호 응답 타입 (API 명세서 기준) - 추후 칭호 API 구현 시 사용
export interface UserTitleResponse {
  titleId: number;
  name: string;
  description: string;
  representative: boolean;
  isRepresentative: boolean;
}

// ============================================
// 칭호 관련 타입 정의 (새로 추가)
// ============================================

// 칭호 정보 타입
export interface Title {
  key: string;
  name: string;
  description: string;
  icon: string;
  type: string;
  acquiredAt: string;
  isRepresent: boolean;
}

// 칭호 목록 조회 응답 타입
export interface TitlesApiResponse {
  success: boolean;
  titles?: Title[];
  message: string;
}

// 대표 칭호 변경 요청 타입
export interface UpdateRepresentTitleRequest {
  titleKey: string;
}

// 대표 칭호 변경 응답 타입
export interface UpdateRepresentTitleResponse {
  success: boolean;
  title?: Title;
  message: string;
} 