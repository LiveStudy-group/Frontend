# LiveStudy Frontend

**LiveStudy**는 사용자 간의 실시간 소통을 중심으로 한 스터디 플랫폼의 프론트엔드 애플리케이션입니다.
단순한 영상 통화 기능을 넘어서, 사용자는 온라인 스터디룸에 입장하여 다음과 같은 다양한 기능을 활용할 수 있습니다:
 - LiveKit 기반의 고품질 영상/음성 통화로 실시간 소통
 - WebSocket을 통한 실시간 메시지 교환, 상태 표시, 타이머 공유 등 협업 중심 기능
 - 스터디룸 내 화면 가리기, 신고하기, 닉네임 및 프로필 관리, 칭호 설정 등 사용자 커스터마이징 기능
 - JWT 기반 인증 시스템으로 안전하고 간편한 로그인/회원가입
 - 구글, 카카오, 네이버 소셜 로그인 연동으로 접근성 향상
 - Zustand를 활용한 상태 관리로 페이지 간 일관된 사용자 경험 제공

---

## 🛠️ 기술 스택

- **React 18** + **TypeScript**
- **Vite** – 빠른 개발 환경
- **Tailwind CSS** – 유틸리티 기반 스타일링
- **Zustand** – 전역 상태 관리
- **Axios** – HTTP 클라이언트
- **React Router** – 라우팅 관리
- **LiveKit** – 실시간 비디오 통신
- **WebSocket** – 실시간 메시징

---

## ⚙️ 개발 환경 설정

### 1. 의존성 설치
npm install

### 2. 개발 서버 실행
npm run dev

### 3. 빌드
npm run build

---

## 🔐 환경 변수

.env 파일을 프로젝트 루트에 생성하고 다음 값을 설정하세요:

VITE_API_BASE_URL=https://api.live-study.com  
VITE_USE_MOCK=false

---

## ✅ 주요 기능

### 완료된 기능

- 인증 시스템
  - 로그인 / 회원가입
  - 이메일 중복 확인
  - JWT 토큰 기반 인증
- 마이페이지
  - 닉네임, 비밀번호, 이메일 변경
  - 대표 칭호 등록

### 진행 중인 기능

- 실시간 통신
  - WebSocket 연결
  - 실시간 메시징
- 비디오 통화
  - LiveKit 연동
  - 화면 공유
- 스터디룸
  - 타이머 기능
  - 상태 표시 기능
  - 화면 가리기
  - 신고하기
  - livekit 기능
- 메인페이지
  - livekit 기능
- 소셜 로그인
  - 구글, 카카오, 네이버 연동

### 문제 있는 기능

- 프로필 이미지 업로드: 400 에러 발생 (API 필요)
- 이메일 2회 변경 시: 500 에러 (백엔드 오류)
- 칭호 목록 조회: API 미구현

---

## 🧪 테스트

### API 테스트

/test 경로에서 전체 API 기능 테스트 가능

### Mock API 사용

main.tsx에서 설정:
const useMock = true;

---

## 🚀 배포

### Vercel 자동 배포

main 브랜치 푸시 시 Vercel로 자동 배포

### 환경 변수 설정 (Vercel)

- VITE_API_BASE_URL
- VITE_USE_MOCK

---

## 🤝 기여하기

1. Fork 저장소
2. 브랜치 생성: git checkout -b feature/AmazingFeature
3. 커밋: git commit -m 'Add AmazingFeature'
4. 브랜치 푸시: git push origin feature/AmazingFeature
5. Pull Request 생성

---

## 📜 커밋 메시지 규칙 (Conventional Commits)

형식:
<타입>(<영역>): 한 줄 요약

예시:
feat(login): 로그인 폼 UI 구현  
fix(register): 비밀번호 확인 오류 수정  
style(home): 버튼 마진 조정

커밋 타입 목록:
- feat: 기능 추가
- fix: 버그 수정
- style: UI / CSS 수정
- refactor: 리팩토링
- chore: 설정 및 기타 작업
- docs: 문서 수정
- test: 테스트 코드
- perf: 성능 개선

---

## 🌿 Git 브랜치 네이밍 규칙

형식:
<타입>/<이름>-<기능>

예시:
feature/jiho-login  
fix/min-register-error  
refactor/jiho-chat-socket  
design/min-home-style

브랜치 타입 목록:
- feature: 신규 기능
- fix: 버그 수정
- refactor: 리팩토링
- design: 스타일/UI
- docs: 문서
- hotfix: 긴급 수정

---

## 👥 팀원

- 프론트엔드: [팀원명]
