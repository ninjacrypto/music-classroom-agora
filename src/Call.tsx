import React, { useEffect } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import useAgora from './hooks/useAgora';
import MediaPlayer from './components/MediaPlayer';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router';
import './call.css';
import { RootState } from './store/store';
import GridContainer from './components/grid/grid';
import { streamInterface, VideoState } from './slices/userVideoSlice';
import { find } from 'lodash';
import ActiveVideoElement from './components/ActiveVideoBlock/ActiveVideoBlock';

const client = AgoraRTC.createClient({ codec: 'h264', mode: 'rtc' });
const screenClient = AgoraRTC.createClient({ codec: 'vp8', mode: 'rtc' });
client.setLowStreamParameter({
  width: 160,
  height: 120,
  framerate: 15,
  bitrate: 20,
});

function Call(props: RouteComponentProps) {
  const appid = '4d5d68e2022f4acbbc091609970b93f9';
  const token = '0064d5d68e2022f4acbbc091609970b93f9IAAtJqPrUreFJSNOoKVeYj6cQSFxlWOqV95J+1kJRpTyQIVr5aIAAAAAEAAZP2Q5cxUDYQEAAQBzFQNh';

  const { channel } = useSelector((state: RootState) => state.meeting);
  const {
    stopScreenShare,
    handleRemoteRaiseHandClick,
    handleRemoteActiveVideoClick,
    screenJoin,
    leave,
    join,
    MuteAudio,
    MuteCamera,
    unMuteAudio,
    unMuteCamera,
    localVideoId,
  } = useAgora(client, screenClient, props);
  const { videos, screenStream } = useSelector((state: RootState) => state.meeting);
  console.log(' this is videos >>>>>>>>', videos);
  const getVideos = () => {
    if (videos.length !== 0) return videos.map((vi) => video(vi.stream, vi.v_id, isHost(vi.v_id)));
    return [];
  };

  const getScreenShareVideoFlag = () => {
    const video = screenStream;
    if (video) return true;
    return false;
  };

  const getScreenShareVideo = (): VideoState | null => {
    return screenStream;
  };

  const getActiveVideo = (): VideoState | null | undefined => {
    if (getScreenShareVideoFlag()) {
      return getScreenShareVideo();
    }
    const vid = find(videos, { active: true });
    if (vid) {
      return { ...(vid as any) };
    }
    return;
  };

  const isHost = (userId: any) => {
    return localVideoId === userId;
  };

  const ActiveVideoBlock = () => {
    const activeVideo = getActiveVideo();
    console.log('this is active video >>>>>>', activeVideo);
    return (
      activeVideo && (
        <ActiveVideoElement id={activeVideo.v_id} videoTrack={activeVideo.stream.video} audioTrack={activeVideo.stream.audio}></ActiveVideoElement>
      )
    );
  };

  const video = (stream: streamInterface, id: string | number, muted: Boolean) => {
    return (
      <MediaPlayer
        id={id}
        videoTrack={stream.video}
        audioTrack={stream.audio}
        muted={muted}
        // handleRemoteActiveVideoClick={handleRemoteActiveVideoClick}
      ></MediaPlayer>
    );
  };

  const inviteText = () => {
    if (process.env.NODE_ENV === 'development') {
      const url = `https://192.168.100.55:3000`;
      return `${url}/join?id=${channel}`;
    } else {
      const url = `https://${process.env.REACT_APP_HOST}`;
      return `Hi there,\n Jump into Stagetrack Studio - ${url}/join?id=${channel}`;
    }
  };

  useEffect(() => {
    if (!channel) {
      leave();
    } else {
      try {
        join(appid, channel, token);
      } catch (err) {
        leave();
      }
    }

    return () => {
      leave();
    };
  }, []);

  return (
    <div>
      <GridContainer
        values={videos.length}
        videos={getVideos()}
        meetingVideos={videos}
        activeVideo={ActiveVideoBlock()}
        canScreenShare={getScreenShareVideoFlag}
        handleScreenShareClick={() => screenJoin(appid, channel, token)}
        handleStopScreenShareClick={stopScreenShare}
        handleEndMeetingClick={leave}
        handleMuteClick={MuteAudio}
        handleUnMuteClick={unMuteAudio}
        handleMutevideoClick={MuteCamera}
        handleUnMutevideoClick={unMuteCamera}
        inviteText={inviteText()}
        handleRemoteRaiseHandClick={handleRemoteRaiseHandClick}
      />
    </div>
  );
}

export default Call;
