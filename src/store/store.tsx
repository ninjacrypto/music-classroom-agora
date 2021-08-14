import { combineReducers, configureStore } from '@reduxjs/toolkit';
import meetingStateReducer from '../slices/userVideoSlice';
import alertReducer from '../slices/alertSlice';
import startReducer from '../slices/startSlice';
import thunk from 'redux-thunk';
import joinreducer from '../slices/joinSlice';
import whiteboardReducer from '../slices/whiteboardSlice';
import bannerReducer from '../slices/bannerSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['banner'],
};

const rootReducer = combineReducers({
  meeting: meetingStateReducer,
  alert: alertReducer,
  start: startReducer,
  join: joinreducer,
  whiteboard: whiteboardReducer,
  banner: bannerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
