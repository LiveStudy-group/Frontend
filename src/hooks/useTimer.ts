import { useEffect, useRef, useState } from 'react';

export function useTimer(
  status: 'FOCUS' | 'AWAY' | 'IDLE',
  initialStudyTime: number,
  initialAwayTime: number,
  statusChangedAt: string
) {
  const [studyTime, setStudyTime] = useState(initialStudyTime);
  const [awayTime, setAwayTime] = useState(initialAwayTime);

  // 누적 기준값
  const lastStudyRef = useRef(initialStudyTime);
  const lastAwayRef = useRef(initialAwayTime);
  const lastStatusRef = useRef<'FOCUS' | 'AWAY' | 'IDLE'>('IDLE');
  const changedAtRef = useRef(new Date(statusChangedAt).getTime());

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    // 상태가 바뀔 때마다 기준값 업데이트
    if (lastStatusRef.current === 'FOCUS') {
      lastStudyRef.current = studyTime;
    } else if (lastStatusRef.current === 'AWAY') {
      lastAwayRef.current = awayTime;
    }
    changedAtRef.current = Date.now();
    lastStatusRef.current = status;

    if (status === 'FOCUS' || status === 'AWAY') {
      interval = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - changedAtRef.current) / 1000);

        if (status === 'FOCUS') {
          setStudyTime(lastStudyRef.current + diff);
        } else if (status === 'AWAY') {
          setAwayTime(lastAwayRef.current + diff);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  return { studyTime, awayTime };
}
