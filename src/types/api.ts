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
  FrequencyRequest,
  FrequencyResponse,
  FeedbackRequest,
  FeedbackResponse,
  LanguageRequest,
  LanguageResponse,
} from './questionLog'


export type HobitAdminApiRequest =
  | LoginRequest
  | SignupRequest
  | NewAccessTokenRequest
  | DeleteAccountReqeust
  | CreateFAQRequest
  | GetAllFAQRequest
  | GetFAQRequest
  | DeleteFAQRequest
  | UpdateFAQRequest
  | TranslateFAQRequest
  | FrequencyRequest
  | FeedbackRequest
  | LanguageRequest;

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
  | FrequencyResponse
  | FeedbackResponse
  | LanguageResponse;

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
