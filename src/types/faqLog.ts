export type GetAllFAQLogRequest = {
  params: {};
  query: {};
}

export type GetAllFAQLogResponse = {
  status: string;
  message: string;
  data: {
    faqLogs: {
      faq_log_id: number;
      user_id: number;
      username: string;
      faq_id: number;
      faq_maincategory: string;
      faq_subcategory: string;
      faq_question: string;
      action_type: string;
      created_at: string;
    }[];
  };
}

export type GetFAQLogRequest = {
  params: {
    faq_log_id: string;
  };
  query: {};
}

export type GetFAQLogResponse = {
  status: string;
  message: string;
  data: {
    faqLog: {
      faq_log_id: number;
      user_id: number;
      username: string;
      faq_id: number;
      maincategory_ko: string;
      subcategory_ko: string;
      question_ko: string;
      action_type: string;
      created_at: string;
    };
  };
}

export type CompareFAQLogRequest = {
  params: {
    faq_log_id: string;
  }
  query: {};
}

export type CompareFAQLogResponse = {
  status: string;
  message: string;
  data: {
    prev_faq: {
      maincategory_ko: string;
      maincategory_en: string;
      subcategory_ko: string;
      subcategory_en: string;
      question_ko: string;
      question_en: string;
      answer_ko: {
        answer: string;
        url: string;
        email: string;
        phone: string;
      }[];
      answer_en: {
        answer: string;
        url: string;
        email: string;
        phone: string;
      }[];
      manager: string;
    }
    new_faq: {
      maincategory_ko: string;
      maincategory_en: string;
      subcategory_ko: string;
      subcategory_en: string;
      question_ko: string;
      question_en: string;
      answer_ko: {
        answer: string;
        url: string;
        email: string;
        phone: string;
      }[];
      answer_en: {
        answer: string;
        url: string;
        email: string;
        phone: string;
      }[];
      manager: string;
    }
  };
}