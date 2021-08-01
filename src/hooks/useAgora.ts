import { useState, useEffect, useRef } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  MicrophoneAudioTrackInitConfig,
  CameraVideoTrackInitConfig,
  IMicrophoneAudioTrack,
  ICameraVideoTrack,
  ILocalVideoTrack,
  ILocalAudioTrack,
  IRemoteAudioTrack,
  IRemoteVideoTrack,
} from 'agora-rtc-sdk-ng';
import { useDispatch, useSelector } from 'react-redux';
import {
  pullVideo,
  pushVideo,
  pushScreenStream,
  pullScreenShare,
  replaceRaiseHand,
  VideoState,
  replaceActiveVideo,
  replaceBorderColor,
  reset,
} from '../slices/userVideoSlice';
import { nanoid } from 'nanoid';
import { RootState, store } from '../store/store';
import { RouteComponentProps } from 'react-router-dom';
import { SHARE_ID } from '../utils/settings';
import socket from './Meeting.socket';
import useNotifacationService from '../hooks/notificationService';
import { useAlert } from 'react-alert';

export type VideoKind = 'screen' | 'media';
const createVideo = (
  connectionId: any,
  audio?: ILocalAudioTrack | IRemoteAudioTrack | undefined | any,
  video?: ILocalVideoTrack | IRemoteVideoTrack | undefined | any
) => {
  const initialVideo: VideoState = {
    v_id: connectionId,
    stream: {
      audio: audio,
      video: video,
    },
    muted: true,
    raisehand: false,
    borderColor: 'blue',
    active: false,
    renderId: nanoid(4),
  };
  return [initialVideo, connectionId];
};

export default function useAgora(
  client: IAgoraRTCClient | undefined,
  screenClient: IAgoraRTCClient | undefined,
  props: RouteComponentProps
): {
  localAudioTrack: ILocalAudioTrack | undefined;
  localVideoTrack: ILocalVideoTrack | undefined;
  joinState: boolean;
  screenShareMode: boolean;
  localVideoId: any;
  leave: Function;
  join: Function;
  remoteUsers: IAgoraRTCRemoteUser[];
  screenJoin: Function;
  stopScreenShare: Function;
  MuteCamera: Function;
  unMuteCamera: Function;
  MuteAudio: Function;
  unMuteAudio: Function;
  handleRemoteRaiseHandClick: Function;
  handleRemoteActiveVideoClick: (connectionId: any) => void;
  handleClickOnVideoBorderChange: Function;
} {
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);
  const [localVideoId, setLocalVideoId] = useState('');
  const [localScreenStreamTrack, setlocalScreenStreamTrack] = useState<any>(undefined);
  const [joinState, setJoinState] = useState(false);
  const [screenShareMode, setScreenShareMode] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const { channel: ChannelName, screenStream, videos } = useSelector((state: RootState) => state.meeting);
  const dispatch = useDispatch();
  const { playNotification } = useNotifacationService();
  const alert = useAlert();
  // const alert = useAlert();

  async function createLocalTracks(
    audioConfig?: MicrophoneAudioTrackInitConfig,
    videoConfig?: CameraVideoTrackInitConfig
  ): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, { optimizationMode: 'motion' });
    cameraTrack.setEncoderConfiguration('360p_1');
    setLocalAudioTrack(microphoneTrack);
    setLocalVideoTrack(cameraTrack);
    return [microphoneTrack, cameraTrack];
  }

  async function join(appid: string, channel: string, token?: string, uid?: string | number | null) {
    if (!client) return;
    const [microphoneTrack, cameraTrack] = await createLocalTracks();
    const [initialVideo, connectionId] = createVideo(nanoid(6), microphoneTrack, cameraTrack);
    setLocalVideoId(connectionId);
    dispatch(pushVideo(initialVideo));

    await client.join(appid, channel, token || null, connectionId);
    await client.publish([microphoneTrack, cameraTrack]);

    (window as any).client = client;
    (window as any).videoTrack = cameraTrack;

    setJoinState(true);
  }

  async function screenJoin(appid: string, channel: string, token?: string, uid?: string | number | null) {
    if (!screenClient) return;
    const screenVideo = await AgoraRTC.createScreenVideoTrack({ optimizationMode: 'motion' }, 'disable');
    screenVideo.getMediaStreamTrack().onended = (tracks) => {
      stopScreenShare();
    };
    // console.log('from screen join >>>>>>>>>>>', screenVideo);
    const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, screenVideo);
    dispatch(pushScreenStream(initialVideo));
    setlocalScreenStreamTrack(screenVideo);

    await screenClient.join(appid, channel, token || null, connectionId);
    await screenClient.publish(screenVideo);

    (window as any).screenClient = screenClient;
    (window as any).videoTrack = screenVideo;
    setScreenShareMode(true);
  }
  const MuteCamera = async () => {
    await localVideoTrack?.setMuted(true);
  };
  const unMuteCamera = async () => {
    await localVideoTrack?.setMuted(false);
  };
  const MuteAudio = async () => {
    await localAudioTrack?.setMuted(true);
  };
  const unMuteAudio = async () => {
    await localAudioTrack?.setMuted(false);
  };
  const handleRemoteRaiseHand = (meetingId: string) => {
    socket.raiseHand.subscribe(meetingId, (connectionId) => {
      dispatch(replaceRaiseHand({ id: connectionId, raisehand: true }));
      setTimeout(() => {
        dispatch(replaceRaiseHand({ id: connectionId, raisehand: false }));
      }, 15000);
    });
  };

  const handleRemoteRaiseHandClick = () => {
    socket.raiseHand.publish(ChannelName, localVideoId);
  };

  const handleRemoteActiveVideo = (meetingId: string) => {
    socket.replaceActiveVideoBlock.subscribe(meetingId, (connectionId) => {
      dispatch(replaceActiveVideo(connectionId));
    });
  };

  const handleRemoteActiveVideoClick = (connectionId: any) => {
    console.log(connectionId);
    socket.replaceActiveVideoBlock.publish(ChannelName, connectionId);
  };
  const handleMenuVideoBorderChange = (meetingId: string) => {
    socket.videoBorderChange.subscribe(meetingId, (payload) => {
      dispatch(replaceBorderColor(payload));
    });
  };
  const handleClickOnVideoBorderChange = (event: any) => {
    const { id: color } = event.target;
    const payload = {
      connectionId: localVideoId,
      borderColor: color,
    };
    socket.videoBorderChange.publish(ChannelName, payload);
  };

  async function leave() {
    if (localAudioTrack) {
      localAudioTrack.stop();
      localAudioTrack.close();
      await client?.unpublish(localAudioTrack);
    }
    if (localVideoTrack) {
      localVideoTrack.stop();
      localVideoTrack.close();
      await client?.unpublish(localVideoTrack);
    }
    if (localScreenStreamTrack) {
      stopScreenShare();
    }
    dispatch(reset());
    setJoinState(false);
    await client?.leave();
    props.history.push('/');
  }

  async function stopScreenShare() {
    if (localScreenStreamTrack) {
      localScreenStreamTrack.stop();
      localScreenStreamTrack.close();
    }
    await screenClient?.unpublish(localScreenStreamTrack);
    dispatch(pullScreenShare());
    setScreenShareMode(false);
    await screenClient?.leave();
  }

  useEffect(() => {
    if (!client) return;
    setRemoteUsers(client.remoteUsers);

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      const screenVideo = store.getState().meeting.screenStream;
      // console.log('inside the chuss >>>>>>>>>>>>>>>>', screenVideo);

      if (!screenStream) {
        await client.subscribe(user, mediaType);
        let videos = client.remoteUsers;
        videos.map((user) => {
          if (user.uid === SHARE_ID) {
            const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
            dispatch(pushScreenStream(initialVideo));
          } else {
            const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
            dispatch(pushVideo(initialVideo));
          }
        });
        // if (user.uid === SHARE_ID) {
        //   const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
        //   dispatch(pushScreenStream(initialVideo));
        // } else {
        //   const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
        //   dispatch(pushVideo(initialVideo));
        // }
      }
      // toggle rerender while state of remoteUsers changed.
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      dispatch(pullVideo(user.uid));
      console.log('this is the console for remote users from user published >>.', client?.remoteUsers);
      // const screenVideo = store.getState().meeting.screenStream;
      // if (user.uid === SHARE_ID) {
      //   // const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
      //   // dispatch(pushScreenStream(initialVideo));
      // } else {
      //   let videos = client.remoteUsers;
      //   videos.map((user) => {
      //     const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
      //     dispatch(pushVideo(initialVideo));
      //   });
      // }
      // playNotification();
      let videos = client.remoteUsers;
      videos.map((user) => {
        if (user.uid === SHARE_ID) {
          const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
          dispatch(pushScreenStream(initialVideo));
        } else {
          const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
          dispatch(pushVideo(initialVideo));
        }
      });
      console.log('>>>>>>>>>> user unpublished trigerred >>>>>>>>>>>>');
    };

    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      const screenVideo = store.getState().meeting.screenStream;
      if (!screenStream) {
        // if (user.uid === SHARE_ID) {
        //   // const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
        //   // dispatch(pushScreenStream(initialVideo));
        // } else {
        //   let videos = client.remoteUsers;
        //   videos.map((user) => {
        //     const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
        //     dispatch(pushVideo(initialVideo));
        //   });
        // }
        playNotification();
        let videos = client.remoteUsers;
        videos.map((user) => {
          if (user.uid === SHARE_ID) {
            const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
            dispatch(pushScreenStream(initialVideo));
          } else {
            const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
            dispatch(pushVideo(initialVideo));
          }
        });
        // console.log('>>>>>>>>>> user join trigerred >>>>>>>>>>>>');
      }
      console.log('videos from user joined');
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      dispatch(pullVideo(user.uid));
      // const screenVideo = store.getState().meeting.screenStream;

      // if (user.uid === SHARE_ID) {
      //   // const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
      //   // dispatch(pushScreenStream(initialVideo));
      // } else {
      //   let videos = client.remoteUsers;
      //   videos.map((user) => {
      //     const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
      //     dispatch(pushVideo(initialVideo));
      //   });
      // }
      // playNotification();
      let videos = client.remoteUsers;
      videos.map((user) => {
        if (user.uid === SHARE_ID) {
          const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
          dispatch(pushScreenStream(initialVideo));
        } else {
          const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
          dispatch(pushVideo(initialVideo));
        }
      });
      // console.log('>>>>>>>>>> user join trigerred >>>>>>>>>>>>');

      console.log('>>>>>>>>>> user left trigerred >>>>>>>>>>>>', user.uid);
    };

    const handleConnectionStateChange = (connectionState: any) => {
      if (connectionState === 'DISCONNECTED') {
        leave();
      }
    };

    const handleTokenPrivilegeDidExpire = () => {
      console.log('token is expiring in 15 mins');
    };

    const handleTokenPrivilegeWillExpire = () => {};

    handleRemoteRaiseHand(ChannelName);
    handleRemoteActiveVideo(ChannelName);
    handleMenuVideoBorderChange(ChannelName);
    client.on('token-privilege-did-expire', handleTokenPrivilegeDidExpire);
    client.on('token-privilege-will-expire', handleTokenPrivilegeWillExpire);

    client.on('error', (err: any) => {
      alert.show(err, { type: 'error' });
    });
    // client.on('token-privilege-did-expire', () => {});

    client.on('connection-state-change', handleConnectionStateChange);
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    return () => {
      client.off('connection-state-change', handleUserPublished);
      client.off('user-published', handleUserPublished);
      client.off('user-unpublished', handleUserUnpublished);
      client.off('user-joined', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [client, screenClient]);

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    screenShareMode,
    localVideoId,
    MuteCamera,
    unMuteCamera,
    MuteAudio,
    unMuteAudio,
    leave,
    join,
    remoteUsers,
    screenJoin,
    stopScreenShare,
    handleRemoteRaiseHandClick,
    handleRemoteActiveVideoClick,
    handleClickOnVideoBorderChange,
  };
}
