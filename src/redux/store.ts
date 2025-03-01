import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import {
  faqItemReducer,
  seniorFaqItemReducer,
  logItemReducer,
  questionLogItemReducer,
  userFeedbackItemReducer,
} from './itemSlice';
import {
  faqFilterReducer,
  faqSortReducer,
  seniorFaqFilterReducer,
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
    logFilter: logFilterReducer,
    adminLogFilter: adminLogFilterReducer,
    questionLogFilter: questionLogFilterReducer,
    logAnalysisFilter: logAnalysisFilterReducer,
    userFeedbackFilter: userFeedbackFilterReducer,
    faqItem: faqItemReducer,
    seniorFaqItem: seniorFaqItemReducer,
    logItem: logItemReducer,
    questionLogItem: questionLogItemReducer,
    userFeedbackItem: userFeedbackItemReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
