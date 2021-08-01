import { configureStore } from '@reduxjs/toolkit';
import meetingStateReducer from '../slices/userVideoSlice';
import alertReducer from '../slices/alertSlice';
import startReducer from '../slices/startSlice';
import thunk from 'redux-thunk';
import joinreducer from '../slices/joinSlice';
import whiteboardReducer from '../slices/whiteboardSlice';
export const store = configureStore({
  reducer: {
    meeting: meetingStateReducer,
    alert: alertReducer,
    start: startReducer,
    join: joinreducer,
    whiteboard: whiteboardReducer,
  },
  middleware: [thunk],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
