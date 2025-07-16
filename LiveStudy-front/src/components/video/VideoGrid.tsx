import { useTracks } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { MdReport } from 'react-icons/md';
import LiveVideoBox from './LiveVideoBox';

const VideoGrid = () => {
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }]);

  return (
    <section className="flex-1 p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 overflow-y-auto">
      {tracks.map(({ participant,  }, idx) => (
        <div
          key={participant.identity + idx}
          className="bg-gray-100 rounded shadow-sm overflow-hidden flex items-center justify-center aspect-[4/3] relative"
        >
          {/* 상태 */}
          <div className="w-full h-full bg-gray-200 rounded-md relative">
            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-green-500" />
            <div className="absolute top-1 right-1 flex justify-center items-center gap-[0.2rem] mt-[0.1rem]">

              {/* 타이머 */}
              <span className="text-caption2_M text-white bg-black/50 px-1 rounded">01:59:59</span>
            </div>

             {/* 화상 스트림 */}
            <LiveVideoBox participant={participant} />
            <div className="absolute bottom-0 left-0 w-full px-2 py-1 bg-black/40 text-white text-xs flex items-center justify-center">
              <div className="flex items-center space-x-1">
                 {/* 유저 정보 */}
                <span className="text-sm">🌱</span>
                <span className="text-caption1_M text-lime-400 font-semibold">칭호</span>
                <span className="text-caption1_M font-semibold">{participant.identity}</span>
              </div>
              {/* 신고 버튼 */}
              <button className="absolute right-2 text-red-300 hover:text-red-500">
                <MdReport size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default VideoGrid;
