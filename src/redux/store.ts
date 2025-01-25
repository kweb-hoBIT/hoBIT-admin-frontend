import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './authSlice';
import { faqFilterReducer, seniorFaqFilterReducer, adminLogFilterReducer, questionLogFilterReducer, userFeedbackFilterReducer } from './filterSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    faqFilter: faqFilterReducer,
    seniorFaqFilter: seniorFaqFilterReducer,
    adminLogFilter: adminLogFilterReducer,
    questionLogFilter: questionLogFilterReducer,
    userFeedbackFilter: userFeedbackFilterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;