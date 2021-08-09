import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { useRef, useEffect } from 'react';
import RaiseHand from './RaiseHand/RaiseHand';
export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  id: string | number;
  muted: Boolean;
  raiseHandvisibility: Boolean;
  handleRemoteActiveVideoClick?: (connectionId: any) => void;
}

const MediaPlayer = (props: VideoPlayerProps) => {
  // const container = useRef<HTMLDivElement>(null);
  //   console.log('>>>>>>>>>>>>>>>>>>', props.videoTrack);
  useEffect(() => {
    // if (!container.current) return;
    props.videoTrack?.play(`container-player-${props.id}`);
    return () => {
      props.videoTrack?.stop();
    };
  }, [container, props.videoTrack]);
  useEffect(() => {
    !props.muted && props.audioTrack?.play();
    return () => {
      props.audioTrack?.stop();
    };
  }, [props.audioTrack]);
  return props.muted ? (
    <div
      id={`container-player-${props.id}`}
      className='video-player'
      onClick={() => {
        props.handleRemoteActiveVideoClick?.(props.id);
      }}
      style={{ width: '100%', height: '100%', position: 'relative' }}>
      <RaiseHand visibility={props.raiseHandvisibility} />
    </div>
  ) : (
    <div
      id={`container-player-${props.id}`}
      className='video-player'
      onClick={() => {
        props.handleRemoteActiveVideoClick?.(props.id);
      }}
      style={{ width: '100%', height: '100%', transform: 'rotateY(180deg)' }}>
      <RaiseHand visibility={props.raiseHandvisibility} />
    </div>
  );
};

export default MediaPlayer;
