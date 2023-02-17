import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';

export interface stickersInterface {
  emojis: [];
  instruments: [];
}

export interface userProfileInterface {
  userUuid: string;
  borderColor: any;
  stickers: stickersInterface;
}

export interface teacherProfileInterface extends userProfileInterface {}

export interface initialStateInterface {
  usersProfile: userProfileInterface[];
  teacherProfile: teacherProfileInterface;
}

const initialState: any = [];

export const userProfile = createSlice({
  initialState,
  name: 'userProfile',
  reducers: {
    updateRoomId: (state: any, action: any) => {
      state.roomId = action.payload.roomId;
    },
    updateInitialState: (state: any, action: any) => {
      return [...action.payload];
    },

    addUserProfile: (state: any, action: any) => {
      let isExistIndex = state.students?.findIndex(
        (record: any) => record?.userUuid === action.payload?.userProfile?.userUuid,
      );
      if (isExistIndex !== -1) {
        state.students[isExistIndex] = action.payload.userProfile;
        return;
      }
      state.students.push(action.payload?.userProfile);
    },

    addTeacherProfile: (state: any, action: any) => {
      let isExistIndex = state.teachers?.findIndex(
        (record: any) => record?.userUuid === action.payload?.teacherProfile?.userUuid,
      );
      if (isExistIndex !== -1) {
        state.teachers[isExistIndex] = action.payload.teacherProfile;
        return;
      }
      state.teachers.push(action.payload?.teacherProfile);
    },

    addOrRemoveUserEmoji: (state: any, action: any) => {
      let isExistIndex = state.usersProfile?.findIndex(
        (record: any) => record?.userUuid === action.payload?.userProfile?.userUuid,
      );
      if (
        isExistIndex !== -1 &&
        !state.usersProfile[isExistIndex].stickers.emojis.includes(action.payload.emoji)
      ) {
        state.usersProfile[isExistIndex].stickers.emojis = [action.payload.emoji];
      } else if (
        isExistIndex !== -1 &&
        state.usersProfile[isExistIndex].stickers.emojis.includes(action.payload.emoji)
      ) {
        state.usersProfile[isExistIndex].stickers.emojis = state.usersProfile[
          isExistIndex
        ].stickers.emojis.filter((item: any) => item !== action.payload.emoji);
      }
    },

    addOrRemoveUserInstrument: (state: any, action: any) => {
      let isExistIndex = state.usersProfile?.findIndex(
        (record: any) => record?.userUuid === action.payload?.userProfile?.userUuid,
      );
      if (
        isExistIndex !== -1 &&
        !state.usersProfile[isExistIndex].stickers.instruments.includes(action.payload.instrument)
      ) {
        state.usersProfile[isExistIndex].stickers.instruments = [
          // ...state.usersProfile[isExistIndex].stickers.instruments,
          action.payload.instrument,
        ];
      } else if (
        isExistIndex !== -1 &&
        state.usersProfile[isExistIndex].stickers.instruments.includes(action.payload.instrument)
      ) {
        state.usersProfile[isExistIndex].stickers.instruments = state.usersProfile[
          isExistIndex
        ].stickers.instruments.filter((item: any) => item !== action.payload.instrument);
      }
    },

    addOrRemoveTeacherEmoji: (state: any, action: any) => {
      let isExistIndex = state.teacherProfile.stickers.emojis.findIndex(
        (item: any) => item === action.payload.emoji,
      );
      if (isExistIndex !== -1) {
        state.teacherProfile.stickers.emojis.splice(isExistIndex, 1);
        return;
      }
      state.teacherProfile.stickers.emojis = [action.payload.emoji];
    },

    addOrRemoveTeacherInstruments: (state: any, action: any) => {
      if (!state.teacherProfile.stickers.instruments.includes(action.payload.instrument)) {
        state.teacherProfile.stickers.instruments = [action.payload.instrument];
        return;
      }
      state.teacherProfile.stickers.instruments = state.teacherProfile.stickers.instruments.filter(
        (item: any) => item !== action.payload.instrument,
      );
    },
    addOrRemoveTeacherAssignedSticker: (state: any, action: any) => {
      let isExistIndex = state.usersProfile?.findIndex(
        (record: any) => record?.userUuid === action.payload?.userUuid,
      );
      console.log(isExistIndex, action.payload);
      if (
        isExistIndex !== -1 &&
        !state.usersProfile[isExistIndex].stickers.teacherAssignedEmojis.includes(
          action.payload.sticker,
        )
      ) {
        state.usersProfile[isExistIndex].stickers.teacherAssignedEmojis = [
          ...state.usersProfile[isExistIndex].stickers.teacherAssignedEmojis,
          action.payload.sticker,
        ];
      } else if (
        isExistIndex !== -1 &&
        state.usersProfile[isExistIndex].stickers.teacherAssignedEmojis.includes(
          action.payload.sticker,
        )
      ) {
        state.usersProfile[isExistIndex].stickers.teacherAssignedEmojis = state.usersProfile[
          isExistIndex
        ].stickers.teacherAssignedEmojis.filter((item: any) => item !== action.payload.sticker);
      }
    },
    addOrRemoveTeacherAssignedInstrumentSticker: (state: any, action: any) => {
      let isExistIndex = state.usersProfile?.findIndex(
        (record: any) => record?.userUuid === action.payload?.userUuid,
      );
      if (
        isExistIndex !== -1 &&
        !state.usersProfile[isExistIndex].stickers.teacherAssignedInstrument.includes(
          action.payload.sticker,
        )
      ) {
        state.usersProfile[isExistIndex].stickers.teacherAssignedInstrument = [
          ...state.usersProfile[isExistIndex].stickers.teacherAssignedInstrument,
          action.payload.sticker,
        ];
      } else if (
        isExistIndex !== -1 &&
        state.usersProfile[isExistIndex].stickers.teacherAssignedInstrument.includes(
          action.payload.sticker,
        )
      ) {
        state.usersProfile[isExistIndex].stickers.teacherAssignedInstrument = state.usersProfile[
          isExistIndex
        ].stickers.teacherAssignedInstrument.filter((item: any) => item !== action.payload.sticker);
      }
    },
    toggleChatPanelState: (state: any, action: any) => {
      state.chatPanelToggle = action.payload.toggleState;
    },

    updateActiveVideoCapture: (state: any, action: any) => {
      state.activeVideoCaptureId = action.payload.activeVideoCaptureId;
    },

    replaceAllUsersProfile: (state: any, action: any) => {
      state.usersProfile = action.payload.usersProfile;
    },
  },
});

export const {
  updateRoomId,
  toggleChatPanelState,
  addUserProfile,
  addTeacherProfile,
  addOrRemoveUserEmoji,
  addOrRemoveUserInstrument,
  addOrRemoveTeacherEmoji,
  addOrRemoveTeacherInstruments,
  addOrRemoveTeacherAssignedSticker,
  addOrRemoveTeacherAssignedInstrumentSticker,
  replaceAllUsersProfile,
  updateActiveVideoCapture,
  updateInitialState,
} = userProfile.actions;

export default userProfile.reducer;
