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
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.user_id = action.payload;
      localStorage.setItem('user_id', action.payload);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      localStorage.setItem('username', action.payload);
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.user_id = null;
      state.username = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
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

export const { setAccessToken, setUserId, setUsername, clearTokens } = authSlice.actions;
export const authReducer = authSlice.reducer;
