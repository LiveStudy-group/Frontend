import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers)

// 실제 백엔드와 연동 테스트를 위한 옵션들
export const workerOptions = {
  // 특정 요청을 실제 네트워크로 보내려면 onUnhandledRequest 설정
  onUnhandledRequest: 'bypass' as const, // 처리되지 않은 요청은 실제 네트워크로
}

