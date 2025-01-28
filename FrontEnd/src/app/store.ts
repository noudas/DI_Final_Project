import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlicer';
import workerReducer from '../features/worker/workerSlicer';
import categoryReducer from '../features/categories/categoriesSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    workers:workerReducer,
    categories:categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
