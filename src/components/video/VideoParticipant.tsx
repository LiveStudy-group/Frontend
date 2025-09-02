import { LocalParticipant, Participant } from 'livekit-client';
import { MdReport, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useTimer } from '../../hooks/useTimer';
import type { FocusStatus } from '../../store/focusStatusStore';
import { formatTime } from '../../utils/time';
import LiveVideoBox from './LiveVideoBox';
interface Props {
  participant: Participant;
  identityKey: string;
  idx: number;
  displayName: string;
  targetName: string;
  isPlaceholder: boolean;
  hidden: boolean;
  focusStatus: FocusStatus;
  titleIcon: string;
  titleName: string;
  totalStudyTime: number;
  totalAwayTime: number;
  statusChangedAt: string;
  toggleHide: () => void;
  toggleStatusColor: (identity: string) => void;
  openReport: (id: string, name: string) => void;
}

const VideoParticipant = ({
  participant,
  identityKey,
  idx,
  displayName,
  targetName,
  isPlaceholder,
  hidden,
  focusStatus,
  titleIcon,
  titleName,
  totalStudyTime,
  totalAwayTime,
  statusChangedAt,
  toggleHide,
  toggleStatusColor,
  openReport,
}: Props) => {
  const timerStatus: 'FOCUS' | 'AWAY' | 'IDLE' =
    focusStatus === 'focus'
      ? 'FOCUS'
      : focusStatus === 'pause'
      ? 'AWAY'
      : 'IDLE';

  const { studyTime } = useTimer(timerStatus, totalStudyTime, totalAwayTime, statusChangedAt);

  const dotColor =
    focusStatus === 'focus'
      ? 'bg-green-500'
      : focusStatus === 'pause'
      ? 'bg-yellow-500'
      : focusStatus === 'ended'
      ? 'bg-red-500'
      : 'bg-gray-400';

  return (
    <div
      key={`${identityKey}-${idx}`}
      className="bg-gray-100 rounded shadow-sm overflow-hidden flex items-center justify-center aspect-[4/3] relative"
    >
      <div className="w-full h-full bg-gray-200 rounded-md relative">
        {/* 상태 점 */}
        <div
          onClick={() => {
            if (isPlaceholder) return;
            if (!(participant instanceof LocalParticipant) && !participant.isLocal) return;
            toggleStatusColor(identityKey);
          }}
          className={`absolute top-1 left-1 w-2 h-2 rounded-full z-50 ${
            isPlaceholder ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
          } ${dotColor}`}
        />

        {/* 타이머 */}
        <div className="absolute top-1 right-1 flex justify-center items-center gap-[0.2rem] mt-[0.1rem]">
          <span className="text-caption2_M text-white bg-black/50 px-1 rounded">
            {formatTime(studyTime)}
          </span>
        </div>

        {/* 영상 */}
        {hidden ? (
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
          {/* 숨기기 버튼 */}
          <button
            disabled={isPlaceholder}
            className={`absolute right-8 ${
              isPlaceholder ? 'opacity-40 cursor-not-allowed' : 'text-gray-300 hover:text-gray-500'
            }`}
            onClick={() => !isPlaceholder && toggleHide()}
          >
            {hidden ? <MdVisibility size={16} /> : <MdVisibilityOff size={16} />}
          </button>

          {/* 칭호 + 닉네임 */}
          <div className="flex items-center space-x-1">
            <span className="text-sm">
              {participant instanceof LocalParticipant || participant.isLocal ? titleIcon : '🌱'}
            </span>
            <span className="text-caption1_M text-lime-400 font-semibold">
              {participant instanceof LocalParticipant || participant.isLocal ? titleName : '칭호'}
            </span>
            <span className="text-caption1_M font-semibold">{displayName}</span>
          </div>

          {/* 신고 버튼 */}
          <button
            disabled={isPlaceholder}
            className={`absolute right-2 ${
              isPlaceholder ? 'opacity-40 cursor-not-allowed' : 'text-red-300 hover:text-red-500'
            }`}
            onClick={() => !isPlaceholder && openReport(identityKey, targetName)}
            aria-label="신고하기"
          >
            <MdReport size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoParticipant;
