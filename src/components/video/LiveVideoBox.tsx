import { useRoomContext } from '@livekit/components-react';
import {
  LocalParticipant,
  Participant,
  RoomEvent,
  Track,
  TrackPublication,
} from 'livekit-client';
import { useEffect, useRef } from 'react';

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
          .catch((err) => console.warn('비디오 자동 재생 실패:', err));
      }
    };

    const detachTrack = (track: Track) => {
      if (videoRef.current) {
        track.detach(videoRef.current);
      }
    };

    const unsubscribers: (() => void)[] = [];

    // 로컬
    if (participant instanceof LocalParticipant) {
      const cameraPub = participant.getTrackPublication(Track.Source.Camera);
      if (cameraPub?.track) attachTrack(cameraPub.track);

      const onLocalTrackPublished = (pub: TrackPublication) => {
        if (pub.source === Track.Source.Camera && pub.track) {
          attachTrack(pub.track);
        }
      };

      room.on(RoomEvent.LocalTrackPublished, onLocalTrackPublished);
      unsubscribers.push(() =>
        room.off(RoomEvent.LocalTrackPublished, onLocalTrackPublished),
      );

      if (cameraPub?.track) unsubscribers.push(() => detachTrack(cameraPub.track!));
    }

    // 원격
    const publications = participant.getTrackPublications();
    publications.forEach((pub) => {
      if (pub.track) {
        attachTrack(pub.track);
      } else {
        const handler = (track: Track) => {
          if (track.kind === Track.Kind.Video) attachTrack(track);
        };
        pub.on('subscribed', handler);
        unsubscribers.push(() => pub.off('subscribed', handler));
      }
    });

    const handleTrackSubscribed = (track: Track) => {
      if (track.kind === Track.Kind.Video) attachTrack(track);
    };
    participant.on('trackSubscribed', handleTrackSubscribed);
    unsubscribers.push(() =>
      participant.off('trackSubscribed', handleTrackSubscribed),
    );

    return () => {
      unsubscribers.forEach((u) => u());
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
