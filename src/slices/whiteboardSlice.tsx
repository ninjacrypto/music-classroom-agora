import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type WhiteboardActiveMenu = 'color' | 'size' | null;
export interface WhiteboardState {
  activeMenu: WhiteboardActiveMenu;
  brushSize: string;
  brushColor: string;
}

const initialState: WhiteboardState = {
  activeMenu: null,
  brushSize: '1',
  brushColor: '#000000',
};

const whiteboard = createSlice({
  name: 'whiteboard',
  initialState,
  reducers: {
    replaceActiveMenu: (state, action: PayloadAction<WhiteboardActiveMenu>) => {
      state.activeMenu = action.payload;
    },
    replaceSize: (state, action: PayloadAction<string>) => {
      state.brushSize = action.payload;
    },
    replaceColor: (state, action: PayloadAction<string>) => {
      state.brushColor = action.payload;
    },
  },
});

export const { replaceActiveMenu, replaceColor, replaceSize } = whiteboard.actions;
export default whiteboard.reducer;
