# Mock API (개발/테스트 환경용)

## 📝 개요
이 폴더의 파일들은 **개발 및 테스트 환경에서만 사용**되는 Mock API입니다.
실제 배포에서는 사용되지 않으며, 백엔드가 준비되지 않은 기능들을 테스트할 때 사용합니다.

## 🎯 사용 목적
- **백엔드 개발 대기**: 백엔드 API가 완성되기 전 프론트엔드 개발
- **오프라인 개발**: 네트워크 없이 개발 환경 구성
- **테스트 환경**: 일관된 테스트 데이터로 기능 검증

## 🔧 사용 방법

### Mock API 활성화
```bash
# .env.local 파일에 다음 추가
VITE_USE_MOCK=true
```

### 실제 백엔드 사용 (기본값)
```bash
# .env.local 파일에서 제거하거나
VITE_USE_MOCK=false
```

## 📁 파일 구조
- `handlers.ts`: API 엔드포인트 Mock 핸들러
- `browser.ts`: MSW (Mock Service Worker) 설정
- `mockSocket.ts`: WebSocket Mock 설정

## ⚠️ 주의사항
- **배포 시 자동 비활성화**: `NODE_ENV=production`에서는 자동으로 비활성화됨
- **실제 API 우선**: 실제 백엔드 API가 준비되면 Mock 대신 실제 API 사용
- **개발용 전용**: 실제 서비스에서는 절대 사용하지 않음

## 📊 현재 상태 (2024-01)
### ✅ 배포 환경에서 작동하는 API들:
- 로그인/회원가입 (일부)
- 마이페이지 프로필 변경
- 칭호 관련 로직

### 🧪 테스트 환경에서만 사용:
- MSW Mock API로 모든 API 테스트 가능
- 콘솔 경고는 최소화되도록 설정됨

### 🔄 전환 방법:
```bash
# 테스트 모드
VITE_USE_MOCK=true

# 배포 모드 
VITE_USE_MOCK=false
```