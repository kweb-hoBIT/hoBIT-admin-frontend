


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


