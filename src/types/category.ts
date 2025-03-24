export type FAQCategoryField =
  | 'maincategory_ko'
  | 'maincategory_en'
  | 'subcategory_ko'
  | 'subcategory_en';

export interface ChangeFAQCategoryRequest {
  params: {
    user_feedback_id: string;
  };
  body: {
    user_id: number;
    category_field: FAQCategoryField;
    prev_category: string;
    new_category: string;
  };
}

export interface ChangeFAQCategoryResponse {
  statusCode: number;
  message: string;
}

export type SeinorFAQCategoryField =
  | 'maincategory_ko'
  | 'maincategory_en'
  | 'subcategory_ko'
  | 'subcategory_en'
  | 'detailcategory_ko'
  | 'detailcategory_en';

export interface ChangeSeniorFAQCategoryRequest {
  params: {
    user_feedback_id: string;
  };
  body: {
    user_id: number;
    category_field: SeinorFAQCategoryField;
    prev_category: string;
    new_category: string;
  };
}
export interface ChangeSeniorFAQCategoryResponse {
  statusCode: number; // HTTP status code (200 for success, 400/500 for errors)
  message: string; // Success or error message
}
