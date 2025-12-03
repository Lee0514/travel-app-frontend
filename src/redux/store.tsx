import { configureStore } from '@reduxjs/toolkit';
import upcomingReducer from './slice/upcomingSlice';
import collectionsReducer from './slice/collectionsSlice';
import userReducer from './slice/userSlice';

export const store = configureStore({
  reducer: {
    upcoming: upcomingReducer,
    collections: collectionsReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
