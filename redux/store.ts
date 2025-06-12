
import { configureStore } from '@reduxjs/toolkit';
import { studiesApi } from './studiesApi';

export const store = configureStore({
  reducer: {
    [studiesApi.reducerPath]: studiesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(studiesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
