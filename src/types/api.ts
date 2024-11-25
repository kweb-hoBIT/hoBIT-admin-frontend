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
  TranslateFAQRequest,
  TranslateFAQResponse,
} from './faq';

import {
  GetAllQuestionLogRequest,
  GetAllQuestionLogResponse,
  FrequencyRequest,
  FrequencyResponse,
  FeedbackRequest,
  FeedbackResponse,
  LanguageRequest,
  LanguageResponse,
} from './questionLog'

import {
  GetAllFAQLogRequest,
  GetAllFAQLogResponse,
  GetFAQLogRequest,
  GetFAQLogResponse,
  CompareFAQLogRequest,
  CompareFAQLogResponse,
} from './faqLog'

export type HobitAdminGetApiRequest =
  | GetAllFAQRequest
  | GetFAQRequest
  | GetAllQuestionLogRequest
  | FrequencyRequest
  | FeedbackRequest
  | LanguageRequest
  | GetAllFAQLogRequest
  | GetFAQLogRequest
  | CompareFAQLogRequest;

export type HobitAdminPostApiRequest =
  | LoginRequest
  | SignupRequest
  | NewAccessTokenRequest
  | CreateFAQRequest
  | TranslateFAQRequest;

export type HobitAdminPutApiRequest =
  | UpdateFAQRequest;

export type HobitAdminDeleteApiRequest =
  | DeleteAccountReqeust
  | DeleteFAQRequest;


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
  | TranslateFAQResponse
  | GetAllQuestionLogResponse
  | FrequencyResponse
  | FeedbackResponse
  | LanguageResponse
  | GetAllFAQLogResponse
  | GetFAQLogResponse
  | CompareFAQLogResponse;

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
