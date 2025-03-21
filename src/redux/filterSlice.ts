import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { RootState } from './store';
import { set } from 'react-datepicker/dist/date_utils';
import { clear } from 'console';

// FAQ 필터 상태 정의
interface FAQFilterState {
  storedCurrentPage: number;
  storedFilterContent: string;
  storedFilterName: 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager';
}

// FAQ 순서 필터 상태 정의
interface FAQSortState {
  storedSortValue: number;
}

// Senior FAQ 순서 필터 상태 정의
interface FAQSortState {
  storedSortValue: number;
}

// Senior FAQ 필터 상태 정의
interface SeniorFAQFilterState {
  storedCurrentPage: number;
  storedFilterContent: string;
  storedFilterName: 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager';
}

// Log 선택 필터 상태 정의
interface LogFilterState {
  storedLogFilter: 'FAQ' | 'Question';
}

// Admin Log 필터 상태 정의
interface AdminLogFilterState {
  storedCurrentPage: number;
}

// Question Log 필터 상태 정의
interface QuestionLogFilterState {
  storedCurrentPage: number;
}

// Log Analysis 필터 상태 정의
interface LogAnalysisFilterState {
  storedLogAnalyzeFilter: 'Entire' | 'Specific';
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

const initialFAQSortState: FAQSortState = {
  storedSortValue: parseInt(localStorage.getItem('faqSortValue') || '1', 10),
};

const initialSeniorFAQSortState: FAQSortState = {
  storedSortValue: parseInt(localStorage.getItem('seniorFaqSortValue') || '1', 10),
};

const initialSeniorFAQFilterState: SeniorFAQFilterState = {
  storedCurrentPage: Number(localStorage.getItem('seniorFaqCurrentPage')) || 1,
  storedFilterContent: localStorage.getItem('seniorFaqFilterContent') || '',
  storedFilterName: (localStorage.getItem('seniorFaqFilterName') as 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager') || 'detailcategory_ko',
};

const initialLogFilterState: LogFilterState = {
  storedLogFilter: localStorage.getItem('logFilter') as 'FAQ' | 'Question' || 'FAQ',
};

const initialAdminLogFilterState: AdminLogFilterState = {
  storedCurrentPage: Number(localStorage.getItem('adminLogCurrentPage')) || 1
};

const initialQuestionLogFilterState: QuestionLogFilterState = {
  storedCurrentPage: Number(localStorage.getItem('questionLogCurrentPage')) || 1
};

const initialLogAnalysisFilterState: LogAnalysisFilterState = {
  storedLogAnalyzeFilter: localStorage.getItem('logAnalyzeFilter') as 'Entire' | 'Specific' || 'Entire',
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

const faqSortSlice = createSlice({
  name: 'faqSort',
  initialState: initialFAQSortState,
  reducers: {
    setSortValue: (state, action: PayloadAction<number>) => {
      state.storedSortValue = action.payload;
      localStorage.setItem('faqSortValue', action.payload.toString());
    },
    clearFAQSortState: (state) => {
      state.storedSortValue = 1;
      localStorage.removeItem('faqSortValue');
    }
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

const seniorFaqSortSlice = createSlice({
  name: 'seniorFaqSort',
  initialState: initialSeniorFAQSortState,
  reducers: {
    setSeniorSortValue: (state, action: PayloadAction<number>) => {
      state.storedSortValue = action.payload;
      localStorage.setItem('seniorFaqSortValue', action.payload.toString());
    },
    clearSeniorFAQSortState: (state) => {
      state.storedSortValue = 1;
      localStorage.removeItem('seniorFaqSortValue');
    }
  },
});

const logFilterSlice = createSlice({
  name: 'logFilter',
  initialState: initialLogFilterState,
  reducers: {
    setLogFilter: (state, action: PayloadAction<'FAQ' | 'Question'>) => {
      state.storedLogFilter = action.payload;
      localStorage.setItem('logFilter', action.payload);
    },
    clearLogFilterState: (state) => {
      state.storedLogFilter = 'FAQ';
      localStorage.removeItem('logFilter');
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

const logAnalysisFilterSlice = createSlice({
  name: 'logAnalysisFilter',
  initialState: initialLogAnalysisFilterState,
  reducers: {
    setLogAnalyzeFilter: (state, action: PayloadAction<'Entire' | 'Specific'>) => {
      state.storedLogAnalyzeFilter = action.payload;
      localStorage.setItem('logAnalyzeFilter', action.payload);
    },
    clearLogAnalysisFilterState: (state) => {
      state.storedLogAnalyzeFilter = 'Entire';
      localStorage.removeItem('logAnalyzeFilter');
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

// FAQ 순서 필터 상태 선택자
export const selectFAQSortState = (state: RootState) => state.faqSort;
export const selectFAQSort = createSelector(
  [selectFAQSortState],
  (faqSortState) => ({
    storedSortValue: faqSortState.storedSortValue,
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

// Senior FAQ 순서 필터 상태 선택자
export const selectSeniorFAQSortState = (state: RootState) => state.seniorFaqSort;
export const selectSeniorFAQSort = createSelector(
  [selectSeniorFAQSortState],
  (seniorFaqSortState) => ({
    storedSortValue: seniorFaqSortState.storedSortValue,
  })
);

// Log 필터 상태 선택자
export const selectLogFilterState = (state: RootState) => state.logFilter;
export const selectLogFilter = createSelector(
  [selectLogFilterState],
  (logFilterState) => ({
    storedLogFilter: logFilterState.storedLogFilter,
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

// Log Analysis 필터 상태 선택자
export const selectLogAnalysisFilterState = (state: RootState) => state.logAnalysisFilter;
export const selectLogAnalysisFilter = createSelector(
  [selectLogAnalysisFilterState],
  (logAnalysisFilterState) => ({
    storedLogAnalyzeFilter: logAnalysisFilterState.storedLogAnalyzeFilter,
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
  setSortValue,
  clearFAQSortState,
} = faqSortSlice.actions;

export const {
  setSeniorFAQCurrentPage,
  setSeniorFAQFilterContent,
  setSeniorFAQFilterName,
  clearSeniorFAQFilterState,
} = seniorFaqFilterSlice.actions;

export const {
  setSeniorSortValue,
  clearSeniorFAQSortState,
} = seniorFaqSortSlice.actions;

export const {
  setLogFilter,
  clearLogFilterState,
} = logFilterSlice.actions;

export const {
  setAdminLogCurrentPage,
  clearAdminLogFilterState,
} = adminLogFilterSlice.actions;

export const {
  setQuestionLogCurrentPage,
  clearQuestionLogFilterState,
} = questionLogFilterSlice.actions;

export const {
  setLogAnalyzeFilter,
  clearLogAnalysisFilterState,
} = logAnalysisFilterSlice.actions;

export const {
  setUnresolvedFeedbackCurrentPage,
  setResolvedFeedbackCurrentPage,
  setUserFeedbackFilterName,
  clearFeedbackFilterState,
} = userFeedbackFilterSlice.actions;

export const faqFilterReducer = faqFilterSlice.reducer;
export const faqSortReducer = faqSortSlice.reducer;
export const seniorFaqFilterReducer = seniorFaqFilterSlice.reducer;
export const seniorFaqSortReducer = seniorFaqSortSlice.reducer;
export const logFilterReducer = logFilterSlice.reducer;
export const adminLogFilterReducer = adminLogFilterSlice.reducer;
export const questionLogFilterReducer = questionLogFilterSlice.reducer;
export const logAnalysisFilterReducer = logAnalysisFilterSlice.reducer;
export const userFeedbackFilterReducer = userFeedbackFilterSlice.reducer;