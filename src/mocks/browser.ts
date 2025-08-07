import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers)

// 실제 백엔드와 연동 테스트를 위한 옵션들
export const workerOptions = {
  // 처리되지 않은 요청에 대한 경고를 조용히 처리
  onUnhandledRequest: 'bypass' as const, // 'warn' -> 'bypass'로 변경하여 경고 제거
  // 개발환경에서만 로깅
  quiet: false
}

