import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlicer';
import workerReducer from '../features/worker/workerSlicer';
import categoryReducer from '../features/categories/categoriesSlice';
import templateReducer from '../features/template/templateSlicer';

export const store = configureStore({
  reducer: {
    users: userReducer,
    workers:workerReducer,
    categories:categoryReducer,
    templates: templateReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;