import { configureStore } from '@reduxjs/toolkit';
import meetingStateReducer from '../slices/userVideoSlice';
import alertReducer from '../slices/alertSlice';
import startReducer from '../slices/startSlice';
import thunk from 'redux-thunk';
import joinreducer from '../slices/joinSlice';
export const store = configureStore({
  reducer: {
    meeting: meetingStateReducer,
    alert: alertReducer,
    start: startReducer,
    join: joinreducer,
  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
