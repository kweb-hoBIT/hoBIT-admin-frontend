import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from './store';

interface AuthState {
  accessToken: string | null;
  user_id: string | null;
  username: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken') || null,
  user_id: localStorage.getItem('user_id') || null,
  username: localStorage.getItem('username') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
      localStorage.setItem('user_id', action.payload);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      localStorage.setItem('username', action.payload);
    },
  },
});

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuth = createSelector(
  [selectAuthState],
  (authState) => ({
    accessToken: authState.accessToken,
    user_id: authState.user_id,
    username: authState.username,
  })
);

export const { setUserId, setUsername } = authSlice.actions;
export const authReducer = authSlice.reducer;
