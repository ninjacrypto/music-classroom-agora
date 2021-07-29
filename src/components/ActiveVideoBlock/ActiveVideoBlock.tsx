import { ILocalVideoTrack, IRemoteVideoTrack, ILocalAudioTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { useRef, useEffect } from 'react';

export interface VideoPlayerProps {
  videoTrack: ILocalVideoTrack | IRemoteVideoTrack | undefined;
  audioTrack: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  id: string | number;
}

const ActiveVideoBlock = (props: VideoPlayerProps) => {
  // const container = useRef<HTMLDivElement>(null);
  //   console.log('>>>>>>>>>>>>>>>>>>', props.videoTrack);
  useEffect(() => {
    // if (!container.current) return;
    props.videoTrack?.play(`active-player-${props.id}`);
    return () => {
      props.videoTrack?.stop();
    };
  }, [container, props.videoTrack]);
  //   useEffect(() => {
  //     !props.muted && props.audioTrack?.play();
  //     return () => {
  //       props.audioTrack?.stop();
  //     };
  //   }, [props.audioTrack]);
  return <div id={`container-player-${props.id}`} className='video-player' style={{ width: '100%', height: '100%' }}></div>;
};

export default ActiveVideoBlock;
