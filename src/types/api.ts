import {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  NewAccessTokenRequest,
  NewAccessTokenResponse,
  DeleteAccountReqeust,
  DeleteAccountResponse,
} from './user';

import {
  CreateFAQRequest,
  CreateFAQResponse,
  GetAllFAQRequest,
  GetAllFAQResponse,
  GetFAQRequest,
  GetFAQResponse,
  DeleteFAQRequest,
  DeleteFAQResponse,
  UpdateFAQRequest,
  UpdateFAQResponse,
  GetAllFAQCategoryRequest,
  GetAllFAQCategoryResponse,
} from './faq';

import {
  CreateSeniorFAQRequest,
  CreateSeniorFAQResponse,
  GetAllSeniorFAQRequest,
  GetAllSeniorFAQResponse,
  GetSeniorFAQRequest,
  GetSeniorFAQResponse,
  DeleteSeniorFAQRequest,
  DeleteSeniorFAQResponse,
  UpdateSeniorFAQRequest,
  UpdateSeniorFAQResponse,
  GetAllSeniorFAQCategoryRequest,
  GetAllSeniorFAQCategoryResponse,
} from './seniorfaq'

import {
  GetAllQuestionLogRequest,
  GetAllQuestionLogResponse,
  EntireFrequencyRequest,
  EntireFrequencyResponse,
  EntireFeedbackRequest,
  EntireFeedbackResponse,
  EntireLanguageRequest,
  EntireLanguageResponse,
  SpecificFrequencyRequest,
  SpecificFrequencyResponse,
  SpecificFeedbackRequest,
  SpecificFeedbackResponse,
  SpecificLanguageRequest,
  SpecificLanguageResponse,
} from './questionLog'

import {
  GetAllFAQLogRequest,
  GetAllFAQLogResponse,
  CompareFAQLogRequest,
  CompareFAQLogResponse,
} from './faqLog'

import {
  GetAllUserFeedbackRequest,
  GetAllUserFeedbackResponse,
  UpdateUserFeedbackRequest,
  UpdateUserFeedbackResponse
} from './feedback'


import {
  TranslateFAQRequest,
  TranslateFAQResponse,
} from './translate'

export type HobitAdminGetApiRequest =
  | GetAllFAQRequest
  | GetFAQRequest
  | GetAllSeniorFAQRequest
  | GetSeniorFAQRequest
  | GetAllQuestionLogRequest
  | EntireFrequencyRequest
  | EntireFeedbackRequest
  | EntireLanguageRequest
  | SpecificFrequencyRequest
  | SpecificFeedbackRequest
  | SpecificLanguageRequest
  | GetAllFAQLogRequest
  | CompareFAQLogRequest
  | GetAllUserFeedbackRequest
  | GetAllFAQCategoryRequest
  | GetAllSeniorFAQCategoryRequest;


export type HobitAdminPostApiRequest =
  | LoginRequest
  | SignupRequest
  | NewAccessTokenRequest 
  | CreateFAQRequest
  | CreateSeniorFAQRequest
  | TranslateFAQRequest;

export type HobitAdminPutApiRequest =
  | UpdateFAQRequest
  | UpdateSeniorFAQRequest
  | UpdateUserFeedbackRequest;

export type HobitAdminDeleteApiRequest =
  | DeleteAccountReqeust
  | DeleteFAQRequest
  | DeleteSeniorFAQRequest;


export type HobitAdminApiResponse =
  | LoginResponse
  | SignupResponse
  | NewAccessTokenResponse
  | DeleteAccountResponse
  | CreateFAQResponse
  | GetAllFAQResponse
  | GetFAQResponse
  | DeleteFAQResponse
  | UpdateFAQResponse
  | CreateSeniorFAQResponse
  | GetAllSeniorFAQResponse
  | GetSeniorFAQResponse
  | DeleteSeniorFAQResponse
  | UpdateSeniorFAQResponse
  | TranslateFAQResponse
  | GetAllQuestionLogResponse
  | EntireFrequencyResponse
  | EntireFeedbackResponse
  | EntireLanguageResponse
  | SpecificFrequencyResponse
  | SpecificFeedbackResponse
  | SpecificLanguageResponse
  | GetAllFAQLogResponse
  | CompareFAQLogResponse
  | GetAllUserFeedbackResponse
  | UpdateUserFeedbackResponse
  | GetAllFAQCategoryResponse
  | GetAllSeniorFAQCategoryResponse;

export type ApiResponse<P> = {
  error: ApiErrorPayload | null;
  payload: P | null;
};

export type ApiErrorPayload = {
  code: string;
  msg: string;
  note: string | null;
};

export const fetchErrorPayload: ApiErrorPayload = {
  code: 'FETCH_ERROR',
  msg: '',
  note: null,
};

export const jsonParseFailPayload: ApiErrorPayload = {
  code: 'JSON_PARSE_FAIL',
  msg: '',
  note: null,
};
