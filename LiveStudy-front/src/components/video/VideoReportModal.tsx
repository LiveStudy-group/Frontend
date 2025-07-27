interface Props {
  identity: string;
  selected: string;
  onChange: (reason: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  visible: boolean;
}

const REPORT_REASONS = ['욕설', '음란', '방해', '기타'];

const VideoReportModal = ({ identity, selected, onChange, onSubmit, onClose, visible }: Props) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-md p-6 w-80 shadow-md">
        <h2 className="text-lg font-semibold mb-4">{identity}님 신고하기</h2>
        <ul className="space-y-2 mb-4">
          {REPORT_REASONS.map((reason) => (
            <li key={reason} className="flex items-center gap-2">
              <input
                type="radio"
                id={`report-${reason}`}
                name="report"
                checked={selected === reason}
                onChange={() => onChange(reason)}
              />
              <label htmlFor={`report-${reason}`}>{reason}</label>
            </li>
          ))}
        </ul>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-sm px-3 py-1 bg-gray-300 rounded hover:bg-gray-400">
            닫기
          </button>
          <button onClick={onSubmit} className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoReportModal;
