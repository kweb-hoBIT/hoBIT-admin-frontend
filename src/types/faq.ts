export type Faq = {
  id: number;
  maincategory_ko: string;
  maincategory_en: string;
  subcategory_ko: string;
  subcategory_en: string;
  question_ko: string;
  question_en: string;
  answer_ko: string;
  answer_en: string;
  manager: string;
  category_order: number;
  created_by: number | null;
  updated_by: number | null;
};

export type CreateFAQRequest = {
  body: {
    user_id: number;
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
  };
};

export type CreateFAQResponse = {
  statusCode: number;
  message: string;
};

export type GetAllFAQRequest = {};

export type GetAllFAQResponse = {
  statusCode: number;
  message: string;
  data: {
    faqs: {
      category_order: number;
      faq_id: number;
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
      created_at: string;
      updated_at: string;
    }[];
  };
};

export type GetFAQRequest = {
  params: {
    faq_id: string;
  };
};

export type GetFAQResponse = {
  statusCode: number;
  message: string;
  data: {
    faq: {
      faq_id: number;
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
      created_at: string;
      updated_at: string;
    };
  };
};

export type DeleteFAQRequest = {
  params: {
    faq_id: string;
  };
  body: {
    user_id: number;
  };
};

export type DeleteFAQResponse = {
  statusCode: number;
  message: string;
};

export type UpdateFAQRequest = {
  params: {
    faq_id: string;
  };
  body: {
    user_id: number;
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
  };
};

export type UpdateFAQResponse = {
  statusCode: number;
  message: string;
};

export type GetAllFAQCategoryRequest = {};

export interface GetAllFAQCategoryResponse {
  statusCode: number;
  message: string;
  data: {
    categories: {
      maincategory_ko: string;
      maincategory_en: string;
      category_order: number;
      subcategories: {
        subcategory_ko: string;
        subcategory_en: string;
        subcategory_order: number;
      }[];
    }[];
  };
}

export type CreateCheckFAQCategoryConflictRequest = {
  body: {
    maincategory_ko: string;
    maincategory_en: string;
    subcategory_ko: string;
    subcategory_en: string;
  };
};

export type UpdateCheckFAQCategoryConflictRequest = {
  body: {
    faq_id: number;
    maincategory_ko: string;
    maincategory_en: string;
    subcategory_ko: string;
    subcategory_en: string;
  };
};

export type CheckFAQCategoryConflictResponse = {
  statusCode: number;
  message: string;
  data: {
    isConflict: boolean;
    conflictedData: {
      field: string;
      input: {
        ko: string;
        en: string;
      };
      conflict: {
        ko: string;
        en: string;
      }[];
    }[];
  };
};

export interface UpdateFAQCategoryRequest {
  body: {
    user_id: number;
    category_field:
      | 'maincategory_ko'
      | 'maincategory_en'
      | 'subcategory_ko'
      | 'subcategory_en';
    prev_category: string;
    new_category: string;
  };
}

export interface UpdateFAQCategoryResponse {
  statusCode: number;
  message: string;
}

export type UpdateFAQCategoryOrderRequest = {
  body: {
    mainCategories: {
      maincategory_ko: string;
      order: number;
      subcategories?: {
        subcategory_ko: string;
        order: number;
      }[];
    }[];
  };
};

export type UpdateFAQCategoryOrderResponse = {
  statusCode: number;
  message: string;
};

export default Faq;
