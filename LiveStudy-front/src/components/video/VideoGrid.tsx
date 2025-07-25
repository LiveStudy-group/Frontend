import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useState } from 'react';
import { MdReport } from 'react-icons/md';
import LiveVideoBox from './LiveVideoBox';

const VideoGrid = () => {
  const [showForms, setShowForms] = useState<Record<string, boolean>>({});
  const [selectedReason, setSelectedReason] = useState<Record<string, string>>({});
  const REPORT_REASONS = ['욕설', '음란', '방해', '기타'];

  // 신고 버튼 클릭 시 해당 참가자의 폼을 토글
  const handleReportClick = (identity: string) => {
    setShowForms((prev) => ({
      ...prev,
      [identity]: !prev[identity],
    }));
  };

  // 라디오 버튼으로 신고 사유 선택
  const handleReasonChange = (identity: string, reason: string) => {
    setSelectedReason((prev) => ({ ...prev, [identity]: reason }));
  };

  // 신고 제출 처리
  const handleSubmit = (e: React.FormEvent, identity: string) => {
    e.preventDefault();
    const reason = selectedReason[identity];

    if (!reason) {
      alert('신고 사유를 선택해주세요.');
      return;
    }

    console.log(`[신고 접수] ${identity}:`, reason);
    alert('신고가 접수되었습니다.');

    setShowForms((prev) => ({ ...prev, [identity]: false }));
    setSelectedReason((prev) => ({ ...prev, [identity]: '' }));
  };

  // 현재 참여 중인 트랙을 가져옴
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true, onlySubscribed: false },
  ]);

  return (
    <section className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto">
      {tracks.map(({ participant }, idx) => {
        const identity = participant.identity;
        const showForm = showForms[identity];
        const selected = selectedReason[identity];

        return (
          <div
            key={identity + idx}
            className="bg-gray-100 rounded shadow-sm overflow-hidden flex items-center justify-center aspect-[4/3] relative"
          >
            {/* 신고 폼 */}
            {showForm && (
              <form
                onSubmit={(e) => handleSubmit(e, identity)}
                className="absolute z-50 bg-white/80 border border-black p-4 flex flex-col items-center justify-center
                           w-[60%] h-[70%] left-[20%] top-[10%]"
              >
                <div className="mb-3 w-full">
                  <p className="text-sm font-semibold mb-4">신고 사유를 선택해주세요:</p>
                  <ul className="space-y-2">
                    {REPORT_REASONS.map((reason) => (
                      <li key={reason} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`${identity}-report-${reason}`}
                          name={`report-${identity}`} 
                          className="w-5 h-5 text-red-500 border-gray-300 focus:ring-red-400"
                          checked={selected === reason}
                          onChange={() => handleReasonChange(identity, reason)}
                        />
                        <label htmlFor={`${identity}-report-${reason}`} className="text-sm text-gray-800">
                          {reason}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="basic-button-primary bg-red-500 hover:bg-red-600 text-white">
                  신고하기
                </button>
              </form>
            )}

            {/* 비디오 영역 */}
            <div className="w-full h-full bg-gray-200 rounded-md relative">
              {/* 상태 표시 */}
              <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-green-500" />
              <div className="absolute top-1 right-1 flex justify-center items-center gap-[0.2rem] mt-[0.1rem]">
                <span className="text-caption2_M text-white bg-black/50 px-1 rounded">01:59:59</span>
              </div>

              {/* 화상 스트림 */}
              <LiveVideoBox participant={participant} />

              {/* 하단 정보 영역 */}
              <div className="absolute bottom-0 left-0 w-full px-2 py-1 bg-black/40 text-white text-xs flex items-center justify-center">
                <div className="flex items-center space-x-1">
                  <span className="text-sm">🌱</span>
                  <span className="text-caption1_M text-lime-400 font-semibold">칭호</span>
                  <span className="text-caption1_M font-semibold">{identity}</span>
                </div>

                {/* 신고 버튼 */}
                <button
                  className="absolute right-2 text-red-300 hover:text-red-500"
                  onClick={() => handleReportClick(identity)}
                >
                  <MdReport size={16} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default VideoGrid;
