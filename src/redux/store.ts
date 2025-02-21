import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import { faqFilterReducer, seniorFaqFilterReducer, logFilterReducer, adminLogFilterReducer, questionLogFilterReducer, logAnalysisFilterReducer, userFeedbackFilterReducer } from './filterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    faqFilter: faqFilterReducer,
    seniorFaqFilter: seniorFaqFilterReducer,
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