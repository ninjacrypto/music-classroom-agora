import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StartState {
  username: string;
  password: string;
  clicked: boolean;
}

const start: StartState = {
  username: '',
  password: '',
  clicked: false,
};

const startSlice = createSlice({
  name: 'start',
  initialState: start,
  reducers: {
    replaceUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    replacePassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    replaceApploginScreen: (state) => {
      state.clicked = !state.clicked;
    },

  },
});

export const { replaceUsername, replacePassword, replaceApploginScreen } = startSlice.actions;
export default startSlice.reducer