import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from './store';
import { set } from 'react-datepicker/dist/date_utils';

// FAQ 필터 상태 정의
interface FAQFilterState {
  storedCurrentPage: number;
  storedFilterContent: string;
  storedFilterName: 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager';
}

// Senior FAQ 필터 상태 정의
interface SeniorFAQFilterState {
  storedCurrentPage: number;
  storedFilterContent: string;
  storedFilterName: 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager';
}

// Admin Log 필터 상태 정의
interface AdminLogFilterState {
  storedCurrentPage: number;
}

// Question Log 필터 상태 정의
interface QuestionLogFilterState {
  storedCurrentPage: number;
}

// User Feedback 필터 상태 정의
interface UserFeedbackFilterState {
  storedUnresolvedCurrentPage: number;
  storedResolvedCurrentPage: number;
  storedFilterName: 'unresolved' | 'resolved';
}

const initialFAQFilterState: FAQFilterState = {
  storedCurrentPage: parseInt(localStorage.getItem('faqCurrentPage') || '1', 10),
  storedFilterContent: localStorage.getItem('faqFilterContent') || '',
  storedFilterName: (localStorage.getItem('faqFilterName') as 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager') || 'question_ko',
};

const initialSeniorFAQFilterState: SeniorFAQFilterState = {
  storedCurrentPage: Number(localStorage.getItem('seniorFaqCurrentPage')) || 1,
  storedFilterContent: localStorage.getItem('seniorFaqFilterContent') || '',
  storedFilterName: (localStorage.getItem('seniorFaqFilterName') as 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager') || 'detailcategory_ko',
};

const initialAdminLogFilterState: AdminLogFilterState = {
  storedCurrentPage: Number(localStorage.getItem('adminLogCurrentPage')) || 1
};

const initialQuestionLogFilterState: QuestionLogFilterState = {
  storedCurrentPage: Number(localStorage.getItem('questionLogCurrentPage')) || 1
};

const initialUserFeedbackFilterState: UserFeedbackFilterState = {
  storedUnresolvedCurrentPage: Number(localStorage.getItem('unresolvedFeedbackCurrentPage')) || 1,
  storedResolvedCurrentPage: Number(localStorage.getItem('resolvedFeedbackCurrentPage')) || 1,
  storedFilterName: (localStorage.getItem('userFeedbackFilterName') as 'unresolved' | 'resolved') || 'unresolved',
};

const faqFilterSlice = createSlice({
  name: 'faqFilter',
  initialState: initialFAQFilterState,
  reducers: {
    setFAQCurrentPage: (state, action: PayloadAction<number>) => {
      state.storedCurrentPage = action.payload;
      localStorage.setItem('faqCurrentPage', action.payload.toString());
    },
    setFAQFilterContent: (state, action: PayloadAction<string>) => {
      state.storedFilterContent = action.payload;
      localStorage.setItem('faqFilterContent', action.payload);
    },
    setFAQFilterName: (state, action: PayloadAction<'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager'>) => {
      state.storedFilterName = action.payload;
      localStorage.setItem('faqFilterName', action.payload);
    },
    clearFAQFilterState: (state) => {
      state.storedCurrentPage = 1;
      state.storedFilterContent = '';
      state.storedFilterName = 'question_ko';
      localStorage.removeItem('faqCurrentPage');
      localStorage.removeItem('faqFilterContent');
      localStorage.removeItem('faqFilterName');
    },
  },
});

const seniorFaqFilterSlice = createSlice({
  name: 'seniorFaqFilter',
  initialState: initialSeniorFAQFilterState,
  reducers: {
    setSeniorFAQCurrentPage: (state, action: PayloadAction<number>) => {
      state.storedCurrentPage = action.payload;
      localStorage.setItem('seniorFaqCurrentPage', action.payload.toString());
    },
    setSeniorFAQFilterContent: (state, action: PayloadAction<string>) => {
      state.storedFilterContent = action.payload;
      localStorage.setItem('seniorFaqFilterContent', action.payload);
    },
    setSeniorFAQFilterName: (state, action: PayloadAction<'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager'>) => {
      state.storedFilterName = action.payload;
      localStorage.setItem('seniorFaqFilterName', action.payload);
    },
    clearSeniorFAQFilterState: (state) => {
      state.storedCurrentPage = 1;
      state.storedFilterContent = '';
      state.storedFilterName = 'detailcategory_ko';
      localStorage.removeItem('seniorFaqCurrentPage');
      localStorage.removeItem('seniorFaqFilterContent');
      localStorage.removeItem('seniorFaqFilterName');
    },
  },
});

const adminLogFilterSlice = createSlice({
  name: 'adminLogFilter',
  initialState: initialAdminLogFilterState,
  reducers: {
    setAdminLogCurrentPage: (state, action: PayloadAction<number>) => {
      state.storedCurrentPage = action.payload;
      localStorage.setItem('adminLogCurrentPage', action.payload.toString());
    },
    clearAdminLogFilterState: (state) => {
      state.storedCurrentPage = 1;
      localStorage.removeItem('adminLogCurrentPage');
    },
  },
});

const questionLogFilterSlice = createSlice({
  name: 'questionLogFilter',
  initialState: initialQuestionLogFilterState,
  reducers: {
    setQuestionLogCurrentPage: (state, action: PayloadAction<number>) => {
      state.storedCurrentPage = action.payload;
      localStorage.setItem('questionLogCurrentPage', action.payload.toString());
    },
    clearQuestionLogFilterState: (state) => {
      state.storedCurrentPage = 1;
      localStorage.removeItem('questionLogCurrentPage');
    },
  },
});

const userFeedbackFilterSlice = createSlice({
  name: 'userFeedbackFilter',
  initialState: initialUserFeedbackFilterState,
  reducers: {
    setUnresolvedFeedbackCurrentPage: (state, action: PayloadAction<number>) => {
      state.storedUnresolvedCurrentPage = action.payload;
      localStorage.setItem('unresolvedFeedbackCurrentPage', action.payload.toString());
    },
    setResolvedFeedbackCurrentPage: (state, action: PayloadAction<number>) => {
      state.storedResolvedCurrentPage = action.payload;
      localStorage.setItem('resolvedFeedbackCurrentPage', action.payload.toString());
    },
    setUserFeedbackFilterName: (state, action: PayloadAction<'unresolved' | 'resolved'>) => {
      state.storedFilterName = action.payload;
      localStorage.setItem('userFeedbackFilterName', action.payload);
    },
    clearFeedbackFilterState: (state) => {
      state.storedUnresolvedCurrentPage = 1;
      state.storedResolvedCurrentPage = 1;
      localStorage.removeItem('unresolvedFeedbackCurrentPage');
      localStorage.removeItem('resolvedFeedbackCurrentPage');
    },
  },
});

// FAQ 필터 상태 선택자
export const selectFAQFilterState = (state: RootState) => state.faqFilter;
export const selectFAQFilter = createSelector(
  [selectFAQFilterState],
  (faqFilterState) => ({
    storedCurrentPage: faqFilterState.storedCurrentPage,
    storedFilterContent: faqFilterState.storedFilterContent,
    storedFilterName: faqFilterState.storedFilterName,
  })
);

// Senior FAQ 필터 상태 선택자
export const selectSeniorFAQFilterState = (state: RootState) => state.seniorFaqFilter;
export const selectSeniorFAQFilter = createSelector(
  [selectSeniorFAQFilterState],
  (seniorFaqFilterState) => ({
    storedCurrentPage: seniorFaqFilterState.storedCurrentPage,
    storedFilterContent: seniorFaqFilterState.storedFilterContent,
    storedFilterName: seniorFaqFilterState.storedFilterName,
  })
);

// Admin Log 필터 상태 선택자
export const selectAdminLogFilterState = (state: RootState) => state.adminLogFilter;
export const selectAdminLogFilter = createSelector(
  [selectAdminLogFilterState],
  (adminLogFilterState) => ({
    storedCurrentPage: adminLogFilterState.storedCurrentPage,
  })
);

// Question Log 필터 상태 선택자
export const selectQuestionLogFilterState = (state: RootState) => state.questionLogFilter;
export const selectQuestionLogFilter = createSelector(
  [selectQuestionLogFilterState],
  (questionLogFilterState) => ({
    storedCurrentPage: questionLogFilterState.storedCurrentPage,
  })
);

// User Feedback 필터 상태 선택자
export const selectUserFeedbackFilterState = (state: RootState) => state.userFeedbackFilter;
export const selectUserFeedbackFilter = createSelector(
  [selectUserFeedbackFilterState],
  (userFeedbackFilterState) => ({
    storedUnresolvedCurrentPage: userFeedbackFilterState.storedUnresolvedCurrentPage,
    storedResolvedCurrentPage: userFeedbackFilterState.storedResolvedCurrentPage,
    storedFilterName: userFeedbackFilterState.storedFilterName,
  })
);

export const {
  setFAQCurrentPage,
  setFAQFilterContent,
  setFAQFilterName,
  clearFAQFilterState,
} = faqFilterSlice.actions;

export const {
  setSeniorFAQCurrentPage,
  setSeniorFAQFilterContent,
  setSeniorFAQFilterName,
  clearSeniorFAQFilterState,
} = seniorFaqFilterSlice.actions;

export const {
  setAdminLogCurrentPage,
  clearAdminLogFilterState,
} = adminLogFilterSlice.actions;

export const {
  setQuestionLogCurrentPage,
  clearQuestionLogFilterState,
} = questionLogFilterSlice.actions;

export const {
  setUnresolvedFeedbackCurrentPage,
  setResolvedFeedbackCurrentPage,
  setUserFeedbackFilterName,
  clearFeedbackFilterState,
} = userFeedbackFilterSlice.actions;

export const faqFilterReducer = faqFilterSlice.reducer;
export const seniorFaqFilterReducer = seniorFaqFilterSlice.reducer;
export const adminLogFilterReducer = adminLogFilterSlice.reducer;
export const questionLogFilterReducer = questionLogFilterSlice.reducer;
export const userFeedbackFilterReducer = userFeedbackFilterSlice.reducer;