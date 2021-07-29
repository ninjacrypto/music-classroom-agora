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
  reset,
} from '../slices/userVideoSlice';
// import { VideoState } from '../slices/userVideoSlice';
import { nanoid } from 'nanoid';
import { RootState, store } from '../store/store';
import { RouteComponentProps } from 'react-router-dom';
// import { find } from 'lodash';
import AgoraClient from './rtm-client';
import useAlertService from './AlertService';
import { SHARE_ID } from '../utils/settings';
import socket from './Meeting.socket';

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
} {
  const [localVideoTrack, setLocalVideoTrack] = useState<ILocalVideoTrack | undefined>(undefined);
  const [localAudioTrack, setLocalAudioTrack] = useState<ILocalAudioTrack | undefined>(undefined);
  const [localVideoId, setLocalVideoId] = useState('');
  const [localScreenStreamTrack, setlocalScreenStreamTrack] = useState<any>(undefined);
  const [joinState, setJoinState] = useState(false);
  const [screenShareMode, setScreenShareMode] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const { channel: ChannelName } = useSelector((state: RootState) => state.meeting);
  const dispatch = useDispatch();
  const rtm: any = new AgoraClient();
  const AlertService = useAlertService();
  const appId = '4d5d68e2022f4acbbc091609970b93f9';
  const accountName = 'testuser1';
  const rtmtoken = '0064d5d68e2022f4acbbc091609970b93f9IAB+9VUtHbGUcgYXF+Gc8kc1MCdx3Aqc6VdVCwuQoiu3oYHfDdQAAAAAEACTZ1E8BKwBYQEA6AMErAFh';

  async function createLocalTracks(
    audioConfig?: MicrophoneAudioTrackInitConfig,
    videoConfig?: CameraVideoTrackInitConfig
  ): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> {
    const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks(audioConfig, videoConfig);
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
    // await client.join(appid, channel, token || null, connectionId);
    // await client.publish([microphoneTrack, cameraTrack]);

    (window as any).client = client;
    (window as any).videoTrack = cameraTrack;

    setJoinState(true);
  }

  async function screenJoin(appid: string, channel: string, token?: string, uid?: string | number | null) {
    if (!screenClient) return;
    const screenVideo = await AgoraRTC.createScreenVideoTrack({ encoderConfig: '480p_2' });
    const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, screenVideo);
    dispatch(pushScreenStream(initialVideo));
    setlocalScreenStreamTrack(screenVideo);

    await screenClient.join(appid, channel, token || null, connectionId);
    await screenClient.publish(screenVideo);

    (window as any).screenClient = screenClient;
    (window as any).videoTrack = screenVideo;
    setScreenShareMode(true);
  }
  // TODO IMPLEMENT TO DUAL STREAM MODE
  const MuteCamera = async () => {
    await localVideoTrack?.setEnabled(false);
  };
  const unMuteCamera = async () => {
    await localVideoTrack?.setEnabled(true);
  };
  const MuteAudio = async () => {
    await localAudioTrack?.setEnabled(false);
  };
  const unMuteAudio = async () => {
    await localAudioTrack?.setEnabled(true);
  };
  const handleRemoteRaiseHand = (meetingId: string) => {
    socket.raiseHand.subscribe(meetingId, (connectionId) => {
      dispatch(replaceRaiseHand({ id: connectionId, raisehand: true }));
      // this.props.replaceVideoRaiseHand(connectionId, true);
      console.log('this is fucking id of user >>>>>>>>>>>>>', connectionId);
    });
  };

  const handleRemoteRaiseHandClick = () => {
    socket.raiseHand.publish(ChannelName, '21349123');
  };

  const handleRemoteActiveVideo = (meetingId: string) => {
    socket.replaceActiveVideoBlock.subscribe(meetingId, (connectionId) => {
      dispatch(replaceActiveVideo(connectionId));
      // console.log('this is fucking id of user for active block ', connectionId);
    });
  };

  const handleRemoteActiveVideoClick = (connectionId: any) => {
    console.log(connectionId);
    socket.replaceActiveVideoBlock.publish(ChannelName, connectionId);
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

    dispatch(reset());
    setJoinState(false);
    await client?.leave();
    props.history.push('/');
    if (!rtm._logined) {
      return;
    }
    rtm
      .logout()
      .then(() => {
        // console.log('logout');
      })
      .catch((err: any) => {
        // console.log(err);
      });
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
    try {
      rtm.init(appId);
      (window as any).rtm = rtm;
      rtm
        .login(accountName, rtmtoken)
        .then(() => {
          console.log('login');
          rtm._logined = true;
          AlertService.push('Rtm Login successful');
        })
        .catch((err: any) => {
          console.log(err);
        });
    } catch (err) {
      // Toast.error('Login failed, please open console see more details');
      // console.error(err);
    }
    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      const screenVideo = store.getState().meeting.screenStream;
      if (!screenVideo) {
        await client.subscribe(user, mediaType);
        // console.log('>>>>>>>>>> user published trigerred >>>>>>>>>>>>');
        // console.log('>>>>>>>>>>>>>track type>>>>>>>>>>>', user.videoTrack);
        if (user.uid === SHARE_ID) {
          const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
          dispatch(pushScreenStream(initialVideo));
        } else {
          const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
          dispatch(pushVideo(initialVideo));
        }
      }
      // toggle rerender while state of remoteUsers changed.
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      dispatch(pullVideo(user.uid));
      // console.log('>>>>>>>>>> user unpublished trigerred >>>>>>>>>>>>', user.uid);
    };

    const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
      const screenVideo = store.getState().meeting.screenStream;
      if (!screenVideo) {
        if (user.uid === SHARE_ID) {
          const [initialVideo, connectionId] = createVideo(SHARE_ID, undefined, user.videoTrack);
          dispatch(pushScreenStream(initialVideo));
        } else {
          const [initialVideo, connectionId] = createVideo(user.uid, user.audioTrack, user.videoTrack);
          dispatch(pushVideo(initialVideo));
        }
        // console.log('>>>>>>>>>> user join trigerred >>>>>>>>>>>>');
      }
    };

    const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
      dispatch(pullVideo(user.uid));
      // console.log('>>>>>>>>>> user left trigerred >>>>>>>>>>>>', user.uid);
    };

    const handleConnectionStateChange = (connectionState: any) => {
      if (connectionState === 'DISCONNECTED') {
        // leave();
      }
    };
    const RTMConnectionStateChanged = async (newState: any, reason: any) => {
      // console.log('reason', reason);

      if (newState === 'ABORTED') {
        if (reason === 'REMOTE_LOGIN') {
        }
      }
    };
    const RTMMemberLeft = async ({ channelName, args }: any) => {};
    const RTMMemberJoined = async ({ channelName, args }: any) => {};
    const RTMChannelMessage = async ({ channelName, args }: any) => {
      const [message, memberId] = args;
      if (message.messageType === 'IMAGE') {
      } else {
      }
    };
    const RTMMessageFromPeer = async (message: any, peerId: any) => {
      if (message.messageType === 'IMAGE') {
      } else {
        // console.log('message ' + message.text + ' peerId' + peerId);
      }
    };

    handleRemoteRaiseHand(ChannelName);
    handleRemoteActiveVideo(ChannelName);

    client.on('connection-state-change', handleConnectionStateChange);
    client.on('user-published', handleUserPublished);
    client.on('user-unpublished', handleUserUnpublished);
    client.on('user-joined', handleUserJoined);
    client.on('user-left', handleUserLeft);

    rtm.on('MessageFromPeer', RTMMessageFromPeer);
    rtm.on('ConnectionStateChanged', RTMConnectionStateChanged);
    rtm.on('MemberJoined', RTMMemberJoined);
    rtm.on('MemberLeft', RTMMemberLeft);
    rtm.on('ChannelMessage', RTMChannelMessage);

    return () => {
      rtm.off('MemberJoined', RTMMemberJoined);
      rtm.off('MemberLeft', RTMMemberLeft);
      rtm.off('ChannelMessage', RTMChannelMessage);
      rtm.off('ConnectionStateChanged', RTMConnectionStateChanged);
      rtm.off('MessageFromPeer', RTMMessageFromPeer);

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
  };
}
