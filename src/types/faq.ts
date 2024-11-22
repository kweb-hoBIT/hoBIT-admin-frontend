export type RateFaqRequest = {
  faq_id: string;
  rating: number;
};

export type RateFaqResponse = {
  success: boolean;
};

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

export type FaqDeleteRequest = {
  faq_id: string;
  user_id: string;
  status: string;
  message: string;
}

export type FaqDeleteResponse = {
  status: string;
  message: string;
}

export type FaqGetRequest = {
  faq_id: string;
  user_id: string;
  status: string;
  message: string;
}

export type FaqGetResponse = {
  faq: Faq;
  status: string;
  message: string;
};

export type FaqPostResponse = {
  status: string;
  message: string;
};

export type FaqPostRequest = {
  user_id: string | null;
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

export type FaqPutRequest = {
  user_id: string | null;
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

export type FaqTranslateRequest = {
  text: string;
};

export type FaqTranslateResponse = {
  translatedText: string;
  status: string;
  message: string;
};

export type FaqPutResponse = {
  status: string;
  message: string;
};

export default Faq;
