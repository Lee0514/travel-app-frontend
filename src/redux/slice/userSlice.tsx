import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  email: string | null;
  userName: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  avatar?: string;
  provider?: 'email' | 'google' | 'line';
}

const initialState: UserState = {
  id: null,
  email: null,
  userName: null,
  accessToken: null,
  refreshToken: null,
  avatar: '',
  provider: 'email'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return initialState;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
