import { configureStore } from '@reduxjs/toolkit';
import upcomingReducer from './slice/upcomingSlice';

export const store = configureStore({
  reducer: {
    upcoming: upcomingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
