import {
  LocalParticipant,
  Participant,
  Track,
} from 'livekit-client';
import { useEffect, useRef } from 'react';

interface Props {
  participant: Participant;
}

const LiveVideoBox = ({ participant }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleTrackSubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
      }
    };

    participant.getTrackPublications().forEach(pub => {
      const track = pub.track;
      if (track && track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
      }
    });

    participant.on('trackSubscribed', handleTrackSubscribed);

    return () => {
      participant.off('trackSubscribed', handleTrackSubscribed);
    };
  }, [participant]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted={participant instanceof LocalParticipant}
      className="absolute inset-0 w-full h-full object-cover rounded-md"
    />
  );
};

export default LiveVideoBox;
