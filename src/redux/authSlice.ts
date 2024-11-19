import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from './store';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  username: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  username: localStorage.getItem('username') || null, // 초기값 설정
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
      localStorage.setItem('refreshToken', action.payload);
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
      localStorage.setItem('username', action.payload); // localStorage 저장
    },
    clearTokens: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.username = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
    },
  },
});

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuth = createSelector(
  [selectAuthState],
  (authState) => ({
    accessToken: authState.accessToken,
    refreshToken: authState.refreshToken,
    username: authState.username,
    isAuthenticated: !!authState.accessToken,
  })
);

export const { setAccessToken, setRefreshToken, setUsername, clearTokens } = authSlice.actions;
export const authReducer = authSlice.reducer;
