import { setupWorker } from "msw";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers)

// Mock API 전용 옵션들
export const workerOptions = {
  // 처리되지 않은 요청에 대한 경고 표시 (Mock에서 누락된 API 감지용)
  onUnhandledRequest: 'warn' as const, // Mock API 사용 시 경고 표시
  // 개발환경에서만 로깅
  quiet: false
}

