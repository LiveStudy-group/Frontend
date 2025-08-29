import { useTracks } from '@livekit/components-react';
import { LocalParticipant, Participant, RemoteParticipant, Track } from 'livekit-client';
import { useMemo, useState } from 'react';
import { MdReport, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import api from '../../lib/api/axios';
import { useAuthStore } from '../../store/authStore';
import type { FocusStatus } from '../../store/focusStatusStore';
import { useFocusStatusStore } from '../../store/focusStatusStore';
import LiveVideoBox from './LiveVideoBox';
import VideoReportModal from './VideoReportModal';
import { isAxiosError } from 'axios';


type ReportReason = '욕설' | '음란' | '방해' | '기타';
type ReportInfo = { id: string; name: string } | null;

const VideoGrid = ({ roomId }: { roomId: number }) => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportInfo, setReportInfo] = useState<ReportInfo>(null);
  const [selectedReason, setSelectedReason] = useState<ReportReason | ''>('');
  const [etcDescription, setEtcDescription] = useState<string>('');
  const [hiddenParticipants, setHiddenParticipants] = useState<Record<string, boolean>>({});

  const { user, token: accessToken } = useAuthStore();
  const loginUserUid = user?.uid || '';
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
    // 원격 참가자
    return p.identity || '';
  };

  // 상태 토글
  const toggleStatusColor = async (identity: string) => {
    const current = focusStatuses[identity] || 'idle';
    const next: FocusStatus = current === 'focus' ? 'pause' : 'focus';
    setStatus(identity, next);
    try {
      const url = next === 'focus' ? '/api/timer/start' : '/api/timer/pause';
      await api.post(url, { userId: loginUserUid, roomId }, { headers: { Authorization: `Bearer ${accessToken}` } });
    } catch (err) {
      console.error(`[상태 변경 실패] ${identity}:`, err);
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
  const mapReason = (r: ReportReason): 'OBSCENE_CONTENT' | 'ABUSE' | 'DISTURBANCE' => {
    switch (r) {
      case '욕설': return 'ABUSE';
      case '음란': return 'OBSCENE_CONTENT';
      case '방해':
      case '기타':
      default: return 'DISTURBANCE';
    }
  };

  // 동일 인물신고 시 에러 메시지 추출
  const getErrorMessage = (e: unknown) => {
    if (isAxiosError(e)) {
      const data = e.response?.data as any;
      if (data?.message) return data.message as string;
      if (data?.error) return String(data.error);
      if (e.response?.statusText) return e.response.statusText;
    }
      return '신고 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
  };

  const handleSubmit = async () => {
    if (!reportInfo) return alert('신고 대상을 식별할 수 없습니다.');
    if (!selectedReason) return alert('신고 사유를 선택해주세요.');
    if (!accessToken) return alert('로그인이 필요합니다.');

    const reportedId = Number(reportInfo.id);
    if (!Number.isFinite(reportedId)) return alert('신고 대상 ID가 올바르지 않습니다.');

    const payload = {
      roomId,
      reportedId,
      reason: mapReason(selectedReason as ReportReason),
      description: selectedReason === '기타' ? (etcDescription || '기타 사유') : undefined,
    };
    try {
      await api.post('/api/reports', payload, { headers: { Authorization: `Bearer ${accessToken}` } });
      alert('신고가 접수되었습니다.');
      closeReport();
    } catch (err) {
      console.error('[신고 실패]', err);
       alert(getErrorMessage(err));
    }
  };

  // 트랙
  const tracks = useTracks(
    useMemo(() => [{ source: Track.Source.Camera, withPlaceholder: true, onlySubscribed: false }] as const, []),
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
      {/* 신고 모달: 표시용 이름만 노출 */}
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
            <div
              key={`${key}-${idx}`}
              className="bg-gray-100 rounded shadow-sm overflow-hidden flex items-center justify-center aspect-[4/3] relative"
            >
              <div className="w-full h-full bg-gray-200 rounded-md relative">
                {/* 상태 점 */}
                <div
                  onClick={() => !isPlaceholder && toggleStatusColor(key)}
                  className={`absolute top-1 left-1 w-2 h-2 rounded-full z-50 ${
                    isPlaceholder ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
                  } ${focusStatuses[key] === 'focus' ? 'bg-green-500' : 'bg-red-500'}`}
                />
                <div className="absolute top-1 right-1 flex justify-center items-center gap-[0.2rem] mt-[0.1rem]">
                  <span className="text-caption2_M text-white bg-black/50 px-1 rounded">01:59:59</span>
                </div>

                {/* 영상 */}
                {hiddenParticipants[key] ? (
                  <div className="flex items-center justify-center w-full h-full bg-gray-300 text-sm text-gray-600 text-center px-2">
                    <p>
                      <span className="font-semibold text-black">{displayName}</span>님의 화면은 현재 가려졌습니다.
                    </p>
                  </div>
                ) : (
                  <LiveVideoBox participant={participant} />
                )}

                {/* 하단 바 */}
                <div className="absolute bottom-0 left-0 w-full px-2 py-1 bg-black/40 text-white text-xs flex items-center justify-center">
                  <button
                    disabled={isPlaceholder}
                    className={`absolute right-8 ${isPlaceholder ? 'opacity-40 cursor-not-allowed' : 'text-gray-300 hover:text-gray-500'}`}
                    onClick={() => !isPlaceholder && toggleHide(key)}
                  >
                    {hiddenParticipants[key] ? <MdVisibility size={16} /> : <MdVisibilityOff size={16} />}
                  </button>

                  <div className="flex items-center space-x-1">
                    <span className="text-sm">{(participant instanceof LocalParticipant || participant.isLocal) ? titleIcon : '🌱'}</span>
                    <span className="text-caption1_M text-lime-400 font-semibold">
                      {(participant instanceof LocalParticipant || participant.isLocal) ? titleName : '칭호'}
                    </span>
                    <span className="text-caption1_M font-semibold">{displayName}</span>
                  </div>

                  {/* 신고 버튼 */}
                  <button
                    disabled={isPlaceholder}
                    className={`absolute right-2 ${isPlaceholder ? 'opacity-40 cursor-not-allowed' : 'text-red-300 hover:text-red-500'}`}
                    onClick={() => !isPlaceholder && openReport(key, targetName)}
                    aria-label="신고하기"
                  >
                    <MdReport size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
};

export default VideoGrid;
