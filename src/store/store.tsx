import { configureStore } from '@reduxjs/toolkit';
import meetingStateReducer from '../slices/userVideoSlice';
import alertReducer from '../slices/alertSlice';
import startReducer from '../slices/startSlice';
import thunk from 'redux-thunk';
import joinreducer from '../slices/joinSlice';
import whiteboardReducer from '../slices/whiteboardSlice';
import { persistStore } from 'redux-persist';

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

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
