import {
  LocalParticipant,
  Participant,
  Track,
  TrackPublication,
  RoomEvent,
} from 'livekit-client';
import { useEffect, useRef } from 'react';
import { useRoomContext } from '@livekit/components-react';

interface Props {
  participant: Participant;
}

const LiveVideoBox = ({ participant }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const room = useRoomContext();

  useEffect(() => {
     const attachTrack = (track: Track) => {
      if (track.kind === Track.Kind.Video && videoRef.current) {
        track.attach(videoRef.current);
        videoRef.current
          .play()
          .then(() => console.log('비디오 자동 재생 성공'))
          .catch((err) => console.warn('비디오 자동 재생 실패:', err));
      }
    };

    const detachTrack = (track: Track) => {
      if (videoRef.current) {
        track.detach(videoRef.current);
      }
    };

    // 로컬 참가자인 경우
    if (participant instanceof LocalParticipant) {
      const cameraPub = participant.getTrackPublication(Track.Source.Camera);
      if (cameraPub?.track) {
        attachTrack(cameraPub.track);
      }

      const onLocalTrackPublished = (pub: TrackPublication) => {
        if (pub.source === Track.Source.Camera && pub.track) {
          attachTrack(pub.track);
        }
      };

      room.on(RoomEvent.LocalTrackPublished, onLocalTrackPublished);

      return () => {
        if (cameraPub?.track) detachTrack(cameraPub.track);
        room.off(RoomEvent.LocalTrackPublished, onLocalTrackPublished);
      };
    }

    // 원격 참가자 처리
    const publications = participant.getTrackPublications();
    publications.forEach((pub) => {
      if (pub.track) {
        attachTrack(pub.track);
      } else {
        const handler = (track: Track) => {
          if (track.kind === Track.Kind.Video) {
            attachTrack(track);
          }
        };
        pub.on('subscribed', handler);
        return () => pub.off('subscribed', handler);
      }
    });

     const handleTrackSubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Video) {
        attachTrack(track);
      }
    };

    participant.on('trackSubscribed', handleTrackSubscribed);

    return () => {
      participant.off('trackSubscribed', handleTrackSubscribed);
    };
  }, [participant, room]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={participant instanceof LocalParticipant}
      className="absolute inset-0 w-full h-full object-cover rounded-md"
    />
  );
};

export default LiveVideoBox;
