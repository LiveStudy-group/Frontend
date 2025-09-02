import { useTracks } from '@livekit/components-react';
import { isAxiosError } from 'axios';
import { LocalParticipant, Participant, RemoteParticipant, Track } from 'livekit-client';
import { useMemo, useState } from 'react';
import api from '../../lib/api/axios';
import { useAuthStore } from '../../store/authStore';
import type { FocusStatus } from '../../store/focusStatusStore';
import { useFocusStatusStore } from '../../store/focusStatusStore';
import VideoParticipant from './VideoParticipant';
import VideoReportModal from './VideoReportModal';

type ReportReason = '욕설' | '음란' | '방해' | '기타';
type ReportInfo = { id: string; name: string } | null;

// API 타입들
type ServerReportReason = 'OBSCENE_CONTENT' | 'ABUSE' | 'DISTURBANCE';

interface ReportPayload {
  roomId: number;
  reportedId: number;
  reason: ServerReportReason;
  description?: string;
}

interface ApiErrorBody {
  errorCode?: string;
  message?: string;
  error?: string;
}

// 런타임 타입가드
const isApiErrorBody = (v: unknown): v is ApiErrorBody => {
  if (typeof v !== 'object' || v === null) return false;
  const o = v as Record<string, unknown>;
  const hasMsg = !('message' in o) || typeof o.message === 'string';
  const hasErr = !('error' in o) || typeof o.error === 'string';
  const hasCode = !('errorCode' in o) || typeof o.errorCode === 'string';
  return hasMsg && hasErr && hasCode;
};

const VideoGrid = ({ roomId }: { roomId: number }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportInfo, setReportInfo] = useState<ReportInfo>(null);
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
  const [etcDescription, setEtcDescription] = useState<string>('');
  const [hiddenParticipants, setHiddenParticipants] = useState<Record<string, boolean>>({});

  const { user } = useAuthStore();
  const loginUserNickname = user?.nickname || '';
  const titleIcon = user?.title?.icon ?? '🌱';
  const titleName = user?.title?.key && user.title.key !== 'no-title' ? user.title.name : '';

  const focusStatuses = useFocusStatusStore((s) => s.focusStatuses);
  const setStatus = useFocusStatusStore((s) => s.setStatus);

  // 표시용 이름
  const getDisplayName = (p: Participant): string => {
    if (p instanceof LocalParticipant || p.isLocal) {
      return loginUserNickname || p.identity || '나';
    }
    return p.identity || '연결 중…';
  };

  // 모달 표시용 이름
  const makeTargetName = (p: Participant): string => {
    if (p instanceof LocalParticipant || p.isLocal) {
      const chips: string[] = [];
      if (titleIcon) chips.push(titleIcon);
      if (titleName) chips.push(titleName);
      chips.push(loginUserNickname || (p.identity ?? '나'));
      return chips.join(' ');
    }
    return p.identity || '';
  };

  // 에러 메시지 안전 추출
  const getErrorMessage = (e: unknown): string => {
    if (isAxiosError(e)) {
      const data = e.response?.data;
      if (isApiErrorBody(data)) {
        if (data.message) return data.message;
        if (typeof data.error === 'string') return data.error;
      }
      if (typeof e.response?.statusText === 'string') return e.response.statusText;
    }
    return '처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  };

  // 상태 토글
  const toggleStatusColor = async (identity: string) => {
    const current: FocusStatus = focusStatuses[identity] ?? 'idle';
    let next: FocusStatus;
    let url: string;

    const numericUserId = user?.userId;
    if (!Number.isFinite(numericUserId ?? NaN)) {
      alert('유효한 사용자 ID가 없습니다. 다시 로그인 해주세요.');
      return;
    }

     if (current === 'idle') {
      next = 'focus';
      url = '/api/timer/start';
    } else if (current === 'focus') {
      next = 'pause';
      url = '/api/timer/pause';
    } else if (current === 'pause') {
      next = 'focus';
      url = '/api/timer/resume';
    } else {
      return;
    }

    setStatus(identity, next);

    try {
      const body = { userId: numericUserId, roomId };
      await api.post<void>(url, body);
    } catch (err: unknown) {
      console.error(`[상태 변경 실패] ${identity}:`, err);
      setStatus(identity, current); 

      if (isAxiosError(err) && isApiErrorBody(err.response?.data)) {
        if (err.response?.data.errorCode === 'U001') {
          console.warn('[Timer] U001 감지: 서버 사용자 조회 실패');
        }
      }
      alert(getErrorMessage(err));
    }
  };

  // 신고 모달 열기/닫기
  const openReport = (id: string, name: string) => {
    setReportInfo({ id, name });
    setSelectedReason('');
    setEtcDescription('');
    setIsReportOpen(true);
  };
  const closeReport = () => {
    setIsReportOpen(false);
    setReportInfo(null);
    setSelectedReason('');
    setEtcDescription('');
  };

  // 신고 제출
  const mapReason = (r: ReportReason): ServerReportReason => {
    switch (r) {
      case '욕설':
        return 'ABUSE';
      case '음란':
        return 'OBSCENE_CONTENT';
      case '방해':
      case '기타':
      default:
        return 'DISTURBANCE';
    }
  };

  const handleSubmit = async () => {
    if (!reportInfo) return alert('신고 대상을 식별할 수 없습니다.');
    if (!selectedReason) return alert('신고 사유를 선택해주세요.');

    const reportedId = Number(reportInfo.id);
    if (!Number.isFinite(reportedId)) {
      alert('신고 대상의 내부 ID를 찾을 수 없어요. (identity→userId 매핑 필요)');
      return;
    }
    const payload: ReportPayload = {
      roomId,
      reportedId,
      reason: mapReason(selectedReason as ReportReason),
      description: selectedReason === '기타' ? etcDescription || '기타 사유' : undefined,
    };

    try {
      await api.post<void>('/api/reports', payload);
      alert('신고가 접수되었습니다.');
      closeReport();
    } catch (err: unknown) {
      console.error('[신고 실패]', err);
      alert(getErrorMessage(err));
    }
  };

  // 트랙
  const tracks = useTracks(
    useMemo(
      () => [{ source: Track.Source.Camera, withPlaceholder: true, onlySubscribed: false }] as const,
      []
    )
  );

  const toggleHide = (identity: string) => {
    setHiddenParticipants((prev) => ({ ...prev, [identity]: !prev[identity] }));
  };

  // 안정 키
  const getIdentityKey = (p: Participant, idx: number): string => {
    if (p.identity) return p.identity;
    if (p instanceof RemoteParticipant) return p.sid;
    return `p-${idx}`;
  };

    return (
    <>
      <VideoReportModal
        targetName={reportInfo?.name ?? ''}
        selected={selectedReason}
        visible={isReportOpen}
        onChange={(r) => setSelectedReason(r as ReportReason)}
        onSubmit={handleSubmit}
        onClose={closeReport}
        etcDescription={etcDescription}
        onChangeEtcDescription={setEtcDescription}
      />

      <section className="flex-1 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto">
        {tracks.map(({ participant }, idx) => {
          const key = getIdentityKey(participant, idx);
          const displayName = getDisplayName(participant);
          const targetName = makeTargetName(participant);
          const isPlaceholder = displayName === '연결 중…';

          return (
            <VideoParticipant
              key={`${key}-${idx}`}
              participant={participant}
              identityKey={key}
              idx={idx}
              displayName={displayName}
              targetName={targetName}
              isPlaceholder={isPlaceholder}
              hidden={hiddenParticipants[key] ?? false}
              focusStatus={focusStatuses[key] ?? 'idle'}
              titleIcon={titleIcon}
              titleName={titleName}
              totalStudyTime={0}
              totalAwayTime={0}
              statusChangedAt={new Date().toISOString()}
              toggleHide={() => toggleHide(key)}
              toggleStatusColor={toggleStatusColor}
              openReport={openReport}
            />
          );
        })}
      </section>
    </>
  );
};

export default VideoGrid;
