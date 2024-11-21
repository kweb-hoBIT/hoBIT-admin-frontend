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
}

export type FaqDeleteResponse = {
  status: string;
  message: string;
}

export type FaqGetRequest = {
  faq_id: string;
  user_id: string;
}

export type FaqGetResponse = {
  faq: Faq;
  status: string;
  message: string;
};

export type FaqPostResponse = {
  status: string;
  message: string;
  text: string;
};

export type FaqPostRequest = {
  text: string;
};

export type FaqPutRequest = {

};

export type FaqPutResponse = {
    status: string;
    message: string;
};

export default Faq;
