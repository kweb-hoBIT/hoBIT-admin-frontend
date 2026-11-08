import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import {
  faqFilterReducer,
  faqSortReducer,
  seniorFaqFilterReducer,
  seniorFaqSortReducer,
  logFilterReducer,
  adminLogFilterReducer,
  questionLogFilterReducer,
  logAnalysisFilterReducer,
  userFeedbackFilterReducer,
} from './filterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    faqFilter: faqFilterReducer,
    faqSort: faqSortReducer,
    seniorFaqFilter: seniorFaqFilterReducer,
    seniorFaqSort: seniorFaqSortReducer,
    logFilter: logFilterReducer,
    adminLogFilter: adminLogFilterReducer,
    questionLogFilter: questionLogFilterReducer,
    logAnalysisFilter: logAnalysisFilterReducer,
    userFeedbackFilter: userFeedbackFilterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
