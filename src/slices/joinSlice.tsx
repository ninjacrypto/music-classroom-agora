import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface joinStateInterface {
  displayUsername?: string;
  parentname?: string;
  childname?: string;
  guestname?: string;
  type?: string;
}

const initialState: joinStateInterface = {
  displayUsername: '',
  parentname: '',
  childname: '',
  guestname: '',
  type: '',
};

const joinSlice = createSlice({
  name: 'join',
  initialState,
  reducers: {
    replacedisplayUsername: (state, action: PayloadAction<joinStateInterface>) => {
      state.displayUsername = action.payload.displayUsername;
      state.type = action.payload.type;
    },
    replaceParentName: (state, action: PayloadAction<joinStateInterface>) => {
      state.parentname = action.payload.parentname;
      state.type = action.payload.type;
      state.childname = '';
      state.guestname = '';
    },
    replaceChildName: (state, action: PayloadAction<joinStateInterface>) => {
      state.childname = action.payload.childname;
      state.type = action.payload.type;
      state.parentname = '';
      state.guestname = '';
    },
    replaceGuestName: (state, action: PayloadAction<joinStateInterface>) => {
      state.guestname = action.payload.guestname;
      state.type = action.payload.type;
      state.parentname = '';
      state.childname = '';
    },
  },
});

export const { replacedisplayUsername, replaceParentName, replaceChildName, replaceGuestName } = joinSlice.actions;
export default joinSlice.reducer;
