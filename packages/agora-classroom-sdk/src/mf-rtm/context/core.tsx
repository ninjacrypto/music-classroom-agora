import React, { useState, ReactChild, useContext } from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { Provider as MusicFunRtmContext } from 'react-redux';
import StickerSlice from '../slices/StickerSlice';

export const store = configureStore({
  reducer: { StickerSlice },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const MusicFunRtmContextProvider = ({ children }: { children: ReactChild }) => {
  //@ts-ignore
  window.globalStore = store;
  //@ts-ignore
  return <MusicFunRtmContext store={store}>{children}</MusicFunRtmContext>;
};
