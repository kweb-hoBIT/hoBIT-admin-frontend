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


export type PostFAQRequest = {
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

export type PostFAQResponse = {
  status: string;
  message: string;
};


export type GetAllFAQRequest = {
  user_id: string;
}

export type GetAllFAQResponse = {
  status: string;
  message: string;
  data? : {
    faqs? : {
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
  faq_id: number;
}

export type GetFAQResponse = {
  status: string;
  message: string;
  data?: {
    faq? : {
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
  faq_id: string;
  user_id: number;
}


export type DeleteFAQResponse = {
  status: string;
  message: string;
};

export type UpdateFAQRequest = {
  faq_id: string;
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

export type UpdateFAQResponse = {
  status: string;
  message: string;
}

export type TranslateFAQRequest = {
  text: string;
}

export type TranslateFAQResponse = {
  status: string;
  message: string;
  data?: {
    translatedText: string;
  }
}

export default Faq;