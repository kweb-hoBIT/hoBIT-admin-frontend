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
  }
};

export type CreateFAQResponse = {
  status: string;
  message: string;
};


export type GetAllFAQRequest = {
  params: {};
  query: {};
}

export type GetAllFAQResponse = {
  status: string;
  message: string;
  data : {
    faqs : {
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
  }
};

export type GetFAQRequest = {
  params: {
    faq_id: string;
  };
  query: {};
}

export type GetFAQResponse = {
  status: string;
  message: string;
  data: {
    faq : {
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
  }
};


export type DeleteFAQRequest = {
  params: {
    faq_id: string;
  }
  body: {
    user_id: number;
  }
}


export type DeleteFAQResponse = {
  status: string;
  message: string;
};


export type UpdateFAQRequest = {
  params: {
    faq_id: string;
  }
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
  }
}

export type UpdateFAQResponse = {
  status: string;
  message: string;
}

export type TranslateFAQRequest = {
  body: {
    text: string;
  }
}

export type TranslateFAQResponse = {
  status: string;
  message: string;
  data: {
    translatedText: string;
  }
}

export default Faq;
