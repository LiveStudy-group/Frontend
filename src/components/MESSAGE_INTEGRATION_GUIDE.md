# 메시지 기능 연동 가이드

## 📋 개요
메시지 기능은 완전히 독립적으로 개발되어 다른 컴포넌트와 쉽게 연동할 수 있습니다.

## 🔌 기본 사용법

### MessageModal 컴포넌트 사용

```tsx
import MessageModal from '../components/MessageModal';
import MessageButton from '../components/MessageButton';

function YourComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 메시지 버튼 */}
      <MessageButton onClick={() => setIsModalOpen(true)} />
      
      {/* 메시지 모달 */}
      <MessageModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        useMock={true}  // 개발용: true, 실서비스용: false
        roomId={123}    // 스터디룸 ID
      />
    </>
  );
}
```

## ⚙️ Props 설명

### MessageModal Props

| Props | Type | Default | 설명 |
|-------|------|---------|------|
| `open` | boolean | required | 모달 열림/닫힘 상태 |
| `onClose` | () => void | required | 모달 닫기 콜백 |
| `useMock` | boolean | false | Mock Socket 사용 여부 |
| `roomId` | number | 1 | 스터디룸 ID (채팅방 분리용) |

### MessageButton Props

| Props | Type | Default | 설명 |
|-------|------|---------|------|
| `onClick` | () => void | required | 버튼 클릭 콜백 |

## 🧪 테스트 방법

### 1. 독립 테스트 페이지
```
http://localhost:5173/message-test
```
- roomId, Mock/Real 모드를 자유롭게 변경 가능
- 다중 탭으로 실시간 채팅 테스트 가능

### 2. 실제 WebSocket 테스트
```
http://localhost:5173/chat-test
```
- STOMP 프로토콜을 사용한 실제 WebSocket 연결

## 🔄 개발 → 서비스 전환

### 개발 중 (Mock Socket)
```tsx
<MessageModal useMock={true} roomId={roomId} />
```
- 로컬 Mock Socket 서버 사용
- 백엔드 없이도 테스트 가능
- roomId별로 독립적인 채팅방

### 서비스 배포 (Real WebSocket)
```tsx
<MessageModal useMock={false} roomId={roomId} />
```
- 실제 STOMP WebSocket 연결
- 백엔드 서버와 실시간 통신

## 📁 관련 파일들

### 핵심 컴포넌트
- `src/components/MessageModal.tsx` - 메인 채팅 모달
- `src/components/MessageButton.tsx` - 채팅 열기 버튼
- `src/components/MessageItem.tsx` - 개별 메시지 컴포넌트

### 기능 모듈
- `src/hooks/useWebSocket.ts` - WebSocket 연결 훅
- `src/mocks/mockSocket.ts` - Mock Socket 서버
- `src/store/blockUserStore.ts` - 사용자 차단 상태 관리

### 타입 정의
- `src/types/Message.ts` - 메시지 관련 타입
- `src/types/MockMessage.ts` - Mock 관련 타입

## 🚀 스터디룸 연동 예시

### 기본 연동 방법

```tsx
// StudyRoomPage.tsx 등에서 사용할 때
function StudyRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  
  return (
    <div>
      {/* 기존 스터디룸 로직 */}
      
      {/* 🔄 [연동 포인트] 메시지 기능 추가 */}
      <MessageButton onClick={() => setIsMessageModalOpen(true)} />
      <MessageModal 
        open={isMessageModalOpen}
        onClose={() => setIsMessageModalOpen(false)}
        useMock={false}  // 🚀 실서비스에서는 false
        roomId={Number(roomId)}  // 🔑 URL에서 받은 roomId 전달
      />
    </div>
  );
}
```

### 단계별 연동 가이드

#### 1단계: Import 추가
```tsx
// StudyRoomPage.tsx 상단에 추가
import MessageButton from '../components/MessageButton';
import MessageModal from '../components/MessageModal';
```

#### 2단계: State 추가
```tsx
// useState 추가
const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
```

#### 3단계: JSX에 컴포넌트 추가
```tsx
{/* 기존 컴포넌트들 다음에 추가 */}
<MessageButton onClick={() => setIsMessageModalOpen(true)} />
<MessageModal 
  open={isMessageModalOpen}
  onClose={() => setIsMessageModalOpen(false)}
  useMock={false}  // 실서비스용
  roomId={Number(roomId)}  // useParams로 받은 roomId
/>
```

### 개발 단계별 설정

#### 개발 초기 (백엔드 준비 전)
```tsx
<MessageModal useMock={true} roomId={roomId} />
// ✅ Mock Socket으로 UI 테스트
```

#### 개발 중기 (백엔드 연동 테스트)
```tsx
<MessageModal useMock={false} roomId={roomId} />
// ✅ 실제 WebSocket 연결 테스트
```

#### 서비스 배포
```tsx
<MessageModal useMock={false} roomId={roomId} />
// ✅ 실제 서비스 환경
```

## ⚠️ 주의사항

1. **useMock 설정 확인**: 개발 시에는 `true`, 배포 시에는 `false`
2. **roomId 전달**: 스터디룸별 독립 채팅을 위해 반드시 전달
3. **로그인 상태**: 사용자 정보가 필요하므로 로그인 후 사용 권장

## 🔧 환경 변수

```env
# .env
VITE_USE_MOCK=true  # Mock API 사용 여부
```

## 📞 문의

메시지 기능 관련 문의사항이 있으시면 담당자에게 연락해주세요.