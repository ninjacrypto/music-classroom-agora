import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { useRef, useEffect } from 'react';
import { nanoid } from 'nanoid';

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  id: string | number;
  muted: Boolean;
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
  return (
    <div
      id={`container-player-${props.id}`}
      className='video-player'
      onClick={() => {
        props.handleRemoteActiveVideoClick?.(props.id);
      }}
      style={{ width: '100%', height: '100%' }}></div>
  );
};

export default MediaPlayer;
