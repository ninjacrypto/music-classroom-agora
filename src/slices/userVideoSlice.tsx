import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILocalAudioTrack, ILocalVideoTrack, IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { find, findIndex, map, reject, some } from 'lodash';
// import { VideoKind } from '../hooks/useAgora';
import { fabric } from 'fabric';

export interface streamInterface {
  audio: ILocalAudioTrack | IRemoteAudioTrack | undefined;
  video: ILocalVideoTrack | IRemoteVideoTrack | undefined;
}

export interface streamStateInteface {
  audio: Boolean;
  video: Boolean;
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

export type MeetingWhiteboardDrawingState = fabric.Object;
export type MeetingWhiteboardDrawingsState = MeetingWhiteboardDrawingState[];
export type MeetingMode = 'whiteboard' | 'screenshare' | 'image' | 'video' | 'pdf';

export interface MeetingStateInterface {
  app_Id: string;
  channel: string;
  token: string;
  videos: VideoState[];
  screenStream: VideoState | null;
  calls: [];
  whiteboardEnabled: Boolean;
  whiteboardDrawings: MeetingWhiteboardDrawingsState;
  mode: MeetingMode;
  image: any;
}
export const meetingInitailState: MeetingStateInterface = {
  app_Id: '',
  channel: '',
  token: '',
  videos: [],
  screenStream: null,
  calls: [],
  whiteboardDrawings: [],
  whiteboardEnabled: true,
  mode: 'whiteboard',
  image: null,
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
    },

    replaceBorderColor: (state, action: PayloadAction<any>) => {
      const video = find(state.videos, { v_id: action.payload.connectionId });
      if (video) {
        video.borderColor = action.payload.borderColor;
      }
    },

    replaceWhiteboardDrawings: (state, action) => {
      state.whiteboardDrawings = action.payload;
    },

    replaceWhiteboardEnabled: (state, action: PayloadAction<boolean>) => {
      state.whiteboardEnabled = action.payload;
    },

    replaceMeetingMode: (state, action: PayloadAction<MeetingMode>) => {
      if (state.mode !== action.payload) state.mode = action.payload;
    },

    replaceMeetingImage: (state, action: PayloadAction<any>) => {
      state.image = action.payload;
    },
    pushWhiteboardDrawing: (state, action: PayloadAction<MeetingWhiteboardDrawingState>) => {
      const stringifyDrawing = (drawing: MeetingWhiteboardDrawingState) => JSON.stringify(drawing);
      const { payload } = action;
      const drawings = map(state.whiteboardDrawings, stringifyDrawing);
      const existingIndex = findIndex(drawings, (drawing) => {
        //@ts-ignore
        return drawing === JSON.stringify(payload);
      });
      const isExists = existingIndex >= 0;
      //@ts-ignore
      if (!isExists) state.whiteboardDrawings.push(payload);
    },

    pullScreenShare: (state) => {
      state.screenStream = null;
    },

    reset: (state) => {
      state.videos = [];
      state.channel = '';
      state.calls = [];
      state.screenStream = null;
      state.token = '';
      state.whiteboardDrawings = [];
      state.whiteboardEnabled = true;
      state.image = null;
      state.mode = 'whiteboard';
    },
  },
});

export const {
  pushVideo,
  pullVideo,
  replaceAllVideos,
  pushScreenStream,
  pullScreenShare,
  pushWhiteboardDrawing,
  replaceWhiteboardDrawings,
  replaceChannelName,
  replaceActiveVideo,
  replaceMeetingImage,
  replaceRaiseHand,
  replaceWhiteboardEnabled,
  replaceMeetingMode,
  replaceBorderColor,
  reset,
} = meetingSlice.actions;
export default meetingSlice.reducer;
