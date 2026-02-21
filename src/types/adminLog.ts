export type GetAllAdminLogRequest = {}

export type GetAllAdminLogResponse = {
  statusCode: number;
  message: string;
  data: {
    adminLogs: {
      log_id: number;
      username: string;
      unifed_faq_id: number;
      maincategory: string;
      subcategory: string;
      detailcategory: string | null;
      question: string | null;
      action_type: string;
      created_at: string;
      log_type: string;
    }[];
  };
}

export type CompareFAQLogRequest = {
  params: {
    faq_log_id: string;
  }
}

export type CompareFAQLogResponse = {
  statusCode: number;
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

export type CompareSeniorFAQLogRequest = {
  params: {
    senior_faq_log_id: string;
  }
}

export type CompareSeniorFAQLogResponse = {
  statusCode: number;
  message: string;
  data: {
    prev_senior_faq: {
      maincategory_ko: string;
      maincategory_en: string;
      subcategory_ko: string;
      subcategory_en: string;
      detailcategory_ko: string;
      detailcategory_en: string;
      answer_ko: {
        title: string;
        answer: string;
        url: string;
        map: {
          latitude: string;
          longitude: string;
        };
      }[];
      answer_en: {
        title: string;
        answer: string;
        url: string;
        map: {
          latitude: string;
          longitude: string;
        };
      }[];
      manager: string;
    }
    new_senior_faq: {
      maincategory_ko: string;
      maincategory_en: string;
      subcategory_ko: string;
      subcategory_en: string;
      detailcategory_ko: string;
      detailcategory_en: string;
      answer_ko: {
        title: string;
        answer: string;
        url: string;
        map: {
          latitude: string;
          longitude: string;
        };
      }[];
      answer_en: {
        title: string;
        answer: string;
        url: string;
        map: {
          latitude: string;
          longitude: string;
        };
      }[];
      manager: string;
    }
  };
}

export interface CountAdminLogsRequest {
  endpoint: 'adminlogs/count';
  method: 'get';
  query?: {
    before_date?: string;
  };
}

export interface CountAdminLogsResponse {
  statusCode: number;
  data: {
    count: number;
  };
}

export interface BulkDeleteAdminLogsRequest {
  body: {
    before_date?: string;
    user_id: number;
  };
}

export interface BulkDeleteAdminLogsResponse {
  statusCode: number;
  data: {
    message: string;
    deleted_count: number;
  };
}
