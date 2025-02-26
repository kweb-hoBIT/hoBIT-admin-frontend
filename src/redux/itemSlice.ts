import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';

interface ItemState {
  itemsPerPage: number;
}

const loadItemsPerPage = (key: string): number => {
  const saved = localStorage.getItem(key);
  return saved ? parseInt(saved, 10) : 4;
};

const createItemSlice = (name: string, storageKey: string) => {
  const initialState: ItemState = {
    itemsPerPage: loadItemsPerPage(storageKey),
  };

  return createSlice({
    name,
    initialState,
    reducers: {
      setItemsPerPage(state, action: PayloadAction<number>) {
        state.itemsPerPage = action.payload;
        localStorage.setItem(storageKey, action.payload.toString());
      },
    },
  });
};

export const faqItemSlice = createItemSlice('faqItem', 'faqItemsPerPage');
export const seniorFaqItemSlice = createItemSlice(
  'seniorFaqItem',
  'seniorFaqItemsPerPage'
);
export const logItemSlice = createItemSlice('logItem', 'logItemsPerPage');
export const questionLogItemSlice = createItemSlice(
  'questionLogItem',
  'questionLogItemsPerPage'
);
export const userFeedbackItemSlice = createItemSlice(
  'userFeedbackItem',
  'userFeedbackItemsPerPage'
);

export const { setItemsPerPage: setFAQItemsPerPage } = faqItemSlice.actions;
export const { setItemsPerPage: setSeniorFAQItemsPerPage } =
  seniorFaqItemSlice.actions;
export const { setItemsPerPage: setLogItemsPerPage } = logItemSlice.actions;
export const { setItemsPerPage: setQuestionLogItemsPerPage } =
  questionLogItemSlice.actions;
export const { setItemsPerPage: setUserFeedbackItemsPerPage } =
  userFeedbackItemSlice.actions;

export const selectFAQItemsPerPage = (state: RootState) =>
  state.faqItem.itemsPerPage;
export const selectSeniorFAQItemsPerPage = (state: RootState) =>
  state.seniorFaqItem.itemsPerPage;
export const selectLogItemsPerPage = (state: RootState) =>
  state.logItem.itemsPerPage;
export const selectQuestionLogItemsPerPage = (state: RootState) =>
  state.questionLogItem.itemsPerPage;
export const selectUserFeedbackItemsPerPage = (state: RootState) =>
  state.userFeedbackItem.itemsPerPage;

export const faqItemReducer = faqItemSlice.reducer;
export const seniorFaqItemReducer = seniorFaqItemSlice.reducer;
export const logItemReducer = logItemSlice.reducer;
export const questionLogItemReducer = questionLogItemSlice.reducer;
export const userFeedbackItemReducer = userFeedbackItemSlice.reducer;
