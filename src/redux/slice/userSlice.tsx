import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  email: string | null;
  userName: string | null;
  avatar?: string;
  provider?: 'email' | 'google' | 'line';
  accessToken?: string;
  refreshToken?: string;
}

const initialState: UserState = {
  id: null,
  email: null,
  userName: null,
  avatar: '',
  provider: 'email'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    clearUser() {
      return initialState;
    }
  }
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
