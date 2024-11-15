import { configureStore } from '@reduxjs/toolkit';
import { inputReducer } from './inputSlice';
import { authReducer } from './authSlice';

const store = configureStore({
  reducer: {
    input: inputReducer,
    auth: authReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;