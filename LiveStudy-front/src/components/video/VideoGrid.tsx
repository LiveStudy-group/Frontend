import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { useState } from 'react';
import { MdReport, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import LiveVideoBox from './LiveVideoBox';
import VideoReportModal from './VideoReportModal';

const VideoGrid = () => {
  const [reportTarget, setReportTarget] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [statusColors, setStatusColors] = useState<Record<string, boolean>>({});
  const [hiddenParticipants, setHiddenParticipants] = useState<Record<string, boolean>>({});



  // 신고 제출 처리
  const openModal = (identity: string) => {
    setReportTarget(identity);
    setSelectedReason('');
  };

  const closeModal = () => {
    setReportTarget(null);
    setSelectedReason('');
  };

  const handleSubmit = () => {
    if (!selectedReason) {
      alert('신고 사유를 선택해주세요.');
      return;
    }
    console.log(`[신고 접수] ${reportTarget}:`, selectedReason);
    alert('신고가 접수되었습니다.');
    closeModal();
  };

  // 집중, 휴식 상태 처리
  const toggleStatusColor = (identity: string) => {
    setStatusColors((prev) => ({
      ...prev,
      [identity]: !prev[identity],
    }));
  };

  // 현재 참여 중인 트랙을 가져옴
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true, onlySubscribed: false },
  ]);
  
  // 유저 화면 가리기
  const toggleHide = (identity: string) => {
    setHiddenParticipants((prev) => ({
      ...prev,
      [identity]: !prev[identity],
    }));
  };

  return (
    <>
      {/* 신고 모달 */}
      <VideoReportModal
        identity={reportTarget ?? ''}
        selected={selectedReason}
        visible={!!reportTarget}
        onChange={(reason) => setSelectedReason(reason)}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />

    <section className="flex-1 px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto">
      {tracks.map(({ participant }, idx) => {
        const identity = participant.identity;

        return (
          <div
            key={identity + idx}
            className="bg-gray-100 rounded shadow-sm overflow-hidden flex items-center justify-center aspect-[4/3] relative"
          >
            {/* 비디오 영역 */}
            <div className="w-full h-full bg-gray-200 rounded-md relative">
              {/* 상태 표시 */}
              <div
                onClick={() => toggleStatusColor(identity)}
                className={`absolute top-1 left-1 w-2 h-2 rounded-full cursor-pointer z-50 ${
                  statusColors[identity] ? 'bg-red-500' : 'bg-green-500'
                }`}
              />
              <div className="absolute top-1 right-1 flex justify-center items-center gap-[0.2rem] mt-[0.1rem]">
                <span className="text-caption2_M text-white bg-black/50 px-1 rounded">01:59:59</span>
              </div>

              {/* 화상 스트림 */}
              {hiddenParticipants[identity] ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-300 text-sm text-gray-600 text-center px-2">
                  <p>
                    <span className="font-semibold text-black">{identity}</span>님의 화면은 현재 가려졌습니다.
                  </p>
                </div>
              ) : (
                <LiveVideoBox participant={participant} />
              )}


              {/* 하단 정보 영역 */}
              <div className="absolute bottom-0 left-0 w-full px-2 py-1 bg-black/40 text-white text-xs flex items-center justify-center">
               <button
                className="absolute right-8 text-gray-300 hover:text-gray-500"
                onClick={() => toggleHide(identity)}
              >
                {hiddenParticipants[identity] ? (
                  <MdVisibility size={16} />
                ) : (
                  <MdVisibilityOff size={16} />
                )}
              </button>

                <div className="flex items-center space-x-1">
                  <span className="text-sm">🌱</span>
                  <span className="text-caption1_M text-lime-400 font-semibold">칭호</span>
                  <span className="text-caption1_M font-semibold">{identity}</span>
                </div>

                {/* 신고 버튼 */}
                <button
                    className="absolute right-2 text-red-300 hover:text-red-500"
                    onClick={() => openModal(identity)}
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
