import { useEffect, useRef } from 'react';

interface Props {
  targetName: string;                
  selected: string;
  onChange: (reason: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  visible: boolean;
  etcDescription?: string;
  onChangeEtcDescription?: (v: string) => void;
  submitting?: boolean;
}

const REPORT_REASONS = ['욕설', '음란', '방해', '기타'];

const VideoReportModal = ({
  targetName,
  selected,
  onChange,
  onSubmit,
  onClose,
  visible,
  etcDescription = '',
  onChangeEtcDescription = () => {},
  submitting = false,
}: Props) => {
  const firstRadioRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) setTimeout(() => firstRadioRef.current?.focus(), 0);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" role="dialog" aria-modal="true">
      <div className="bg-white rounded-md p-6 w-80 shadow-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4">[{targetName}] 이용자 신고</h2>

        <ul className="space-y-2 mb-2">
          {REPORT_REASONS.map((reason, i) => (
            <li key={reason} className="flex items-center gap-2">
              <input
                ref={i === 0 ? firstRadioRef : undefined}
                type="radio"
                id={`report-${reason}`}
                name="report-reason"
                checked={selected === reason}
                onChange={() => onChange(reason)}
                className="cursor-pointer"
              />
              <label htmlFor={`report-${reason}`} className="cursor-pointer">{reason}</label>
            </li>
          ))}
        </ul>

        {selected === '기타' && (
          <textarea
            className="w-full border rounded p-2 text-sm mb-3"
            placeholder="상세 내용을 입력하세요"
            value={etcDescription}
            onChange={(e) => onChangeEtcDescription(e.target.value)}
            rows={3}
            maxLength={500}
          />
        )}

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="text-sm px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" disabled={submitting}>
            닫기
          </button>
          <button onClick={onSubmit} className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" disabled={submitting}>
            {submitting ? '전송 중…' : '신고하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoReportModal;
