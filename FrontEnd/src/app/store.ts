import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlicer';
import workerReducer from '../features/worker/workerSlicer';

export const store = configureStore({
  reducer: {
    users: userReducer,
    workers:workerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
