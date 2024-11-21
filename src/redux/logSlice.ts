// src/redux/slices/logSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Filters {
  beginDate: string;
  endDate: string;
  period: string;
  sortOrder: number;
  limit: number;
}

interface LogState {
  filters: Filters;
  mode: 'frequency' | 'feedback' | 'language';
}

const initialState: LogState = {
  filters: {
    beginDate: '',
    endDate: '',
    period: 'week',
    sortOrder: 0,
    limit: 5,
  },
  mode: 'frequency',
};

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },
    setMode: (
      state,
      action: PayloadAction<'frequency' | 'feedback' | 'language'>
    ) => {
      state.mode = action.payload;
    },
  },
});

export const { setFilters, setMode } = logSlice.actions;
export const logReducer = logSlice.reducer;
