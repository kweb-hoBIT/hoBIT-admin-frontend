export type GetAllQuestionLogRequest = {
  params: {};
  query: {};
}

export type GetAllQuestionLogResponse = {
  status: string;
  message: string;
  data: {
    questionLogs: {
      question_log_id: number;
      user_question: string;
      feedback_score: number;
      feedback: string;
      created_at: string;
      faq_id: number;
      faq_question: string;
      faq_maincategory: string;
      faq_subcategory: string;
    }[];
  };
}

export type FrequencyRequest = {
  params: {};
  query: {
    startDate: string;
    endDate: string;
    period: string;
    sortOrder: string;
    limit : string;
  };
};

export type FrequencyResponse = {
  status: string;
  message: string;          
  data?: {
    logData?: {
      startDate?: string;
      endDate?: string;
      groupData?: {
          startDate?: string;
          endDate?: string;
          data?: {
              rank?: number;
              faq_id?: number;
              question_ko?: string;
              count?: number;
          }[];
      }[];
    };
  };
};

export type FeedbackRequest = {
  params: {};
  query: {
    startDate: string;
    endDate: string;
    period: string;
    sortOrder: string;
    limit: string;
  };
};

export type FeedbackResponse = {
  status: string;
  message: string;          
  data?: {
    logData?: {
      startDate?: string;
      endDate?: string;
      groupData?: {
          startDate?: string;
          endDate?: string;
          data?: {
              rank?: number;
              faq_id?: number;
              question_ko?: string;
              count?: number;
          }[];
      }[];
    };
  };
};

export type LanguageRequest = {
  params: {};
  query: {
    startDate: string;
    endDate: string;
    period: string;
    sortOrder: string;
    limit: string;
  };
};

export type LanguageResponse = {
  status: string;
  message: string;          
  data?: {
    logData?: {
      startDate?: string;
      endDate?: string;
      groupData?: {
        startDate?: string;
        endDate?: string;
        data?: {
          ko_frequency?: number;
          en_frequency?: number;
        }
      }[];
    }
  };
};


