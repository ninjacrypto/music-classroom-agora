import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IAgoraRTCRemoteUser, ILocalAudioTrack, ILocalVideoTrack, IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { cloneDeep, find, findIndex, map, pull, reject, some } from 'lodash';
import { VideoKind } from '../hooks/useAgora';

export interface streamInterface {
  audio: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  video: ILocalVideoTrack | IRemoteVideoTrack | undefined;
}

export interface VideoState {
  v_id: string | number;
  stream: streamInterface;
  muted: Boolean;
  raisehand: Boolean;
  active: Boolean;
  borderColor: string;
  renderId: string | number;
}

export interface MeetingStateInterface {
  app_Id: string;
  channel: string;
  token: string;
  videos: VideoState[];
  screenStream: VideoState | null;
  calls: [];
  whiteboardEnabled: Boolean;
}
export const meetingInitailState: MeetingStateInterface = {
  app_Id: '',
  channel: '',
  token: '',
  videos: [],
  screenStream: null,
  calls: [],
  whiteboardEnabled: false,
};

export const meetingSlice = createSlice({
  name: 'meeting',
  initialState: meetingInitailState,
  reducers: {
    pushVideo: (state, action: PayloadAction<VideoState>) => {
      const isExist = some(state.videos, { v_id: action.payload.v_id });
      if (!isExist) {
        state.videos.push(action.payload);
      } else {
        const indexOfVideo = findIndex(state.videos, (video) => video.v_id === action.payload.v_id);
        state.videos[indexOfVideo] = action.payload;
      }
    },
    pullVideo: (state, action: PayloadAction<any>) => {
      state.videos = reject(state.videos, { v_id: action.payload });
    },
    pushScreenStream: (state, action: PayloadAction<VideoState>) => {
      state.screenStream = action.payload;
    },
    replaceAllVideos: (state, action: PayloadAction<VideoState[]>) => {
      state.videos = action.payload;
    },
    replaceChannelName: (state, action: PayloadAction<string>) => {
      state.channel = action.payload;
    },
    replaceActiveVideo: (state, action: PayloadAction<string>) => {
      const video = find(state.videos, { v_id: action.payload });
      if (video) {
        video.active = !video.active;
      }
    },
    replaceRaiseHand: (state, action: PayloadAction<any>) => {
      const video = find(state.videos, { v_id: action.payload.id });
      if (video) {
        video.raisehand = action.payload.raisehand;
      }
      return;
    },
    pullScreenShare: (state) => {
      state.screenStream = null;
    },

    reset: (state) => {
      state.videos = [];
      state.channel = '';
    },
  },
});

export const { pushVideo, pullVideo, replaceAllVideos, pushScreenStream, pullScreenShare, replaceChannelName, replaceActiveVideo,replaceRaiseHand, reset } =
  meetingSlice.actions;
export default meetingSlice.reducer;
