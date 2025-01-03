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
  | CompareFAQLogRequest;

export type HobitAdminPostApiRequest =
  | LoginRequest
  | SignupRequest
  | NewAccessTokenRequest 
  | CreateFAQRequest
  | CreateSeniorFAQRequest
  | TranslateFAQRequest;

export type HobitAdminPutApiRequest =
  | UpdateFAQRequest
  | UpdateSeniorFAQRequest;

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
