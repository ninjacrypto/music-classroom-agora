import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type BannerState = 'normal' | 'SOR';

export interface banner {
  banner: BannerState;
}

const initialState: banner = {
  banner: 'normal',
};

const bannerSlice = createSlice({
  name: 'banner',
  initialState: initialState,
  reducers: {
    replaceBanner: (state, action: PayloadAction<BannerState>) => {
      if (state.banner !== action.payload) {
        state.banner = action.payload;
      }
    },
  },
});

export const { replaceBanner } = bannerSlice.actions;
export default bannerSlice.reducer;
