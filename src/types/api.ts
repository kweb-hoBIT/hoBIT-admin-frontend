import {
  LoginRequest,
  LoginResponse,
  LogoutRequest,
  LogoutResponse,
  SignupRequest,
  SignupResponse,
  NewAccessTokenRequest,
  NewAccessTokenResponse,
  DeleteAccountReqeust,
  DeleteAccountResponse,
  FindUserRequest,
  FindUserResponse,
  UpdatePasswordRequest,
  UpdatePasswordResponse,
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
  CreateCheckFAQCategoryConflictRequest,
  UpdateCheckFAQCategoryConflictRequest,
  CheckFAQCategoryConflictResponse,
  ChangeFAQCategoryRequest,
  ChangeFAQCategoryResponse,
  UpdateFAQCategoryOrderRequest,
  UpdateFAQCategoryOrderResponse,
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
  CreateCheckSeniorFAQCategoryConflictRequest,
  UpdateCheckSeniorFAQCategoryConflictRequest,
  CheckSeniorFAQCategoryConflictResponse,
  UpdateSeniorFAQCategoryOrderRequest,
  UpdateSeniorFAQCategoryOrderResponse,
  ChangeSeniorFAQCategoryRequest,
  ChangeSeniorFAQCategoryResponse,
} from './seniorfaq';

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
} from './questionLog';

import {
  GetAllAdminLogRequest,
  GetAllAdminLogResponse,
  CompareFAQLogRequest,
  CompareFAQLogResponse,
  CompareSeniorFAQLogRequest,
  CompareSeniorFAQLogResponse,
} from './adminLog';

import {
  GetAllUserFeedbackRequest,
  GetAllUserFeedbackResponse,
  UpdateUserFeedbackRequest,
  UpdateUserFeedbackResponse,
  DeleteUserFeedbackRequest,
  DeleteUserFeedbackResponse,
} from './feedback';

import { TranslateFAQRequest, TranslateFAQResponse } from './translate';

import { SwaggerRequest, SwaggerResponse } from './swagger';

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
  | GetAllAdminLogRequest
  | CompareFAQLogRequest
  | CompareSeniorFAQLogRequest
  | GetAllUserFeedbackRequest
  | GetAllFAQCategoryRequest
  | GetAllSeniorFAQCategoryRequest
  | SwaggerRequest;

export type HobitAdminPostApiRequest =
  | LoginRequest
  | LogoutRequest
  | SignupRequest
  | FindUserRequest
  | NewAccessTokenRequest
  | CreateFAQRequest
  | CreateSeniorFAQRequest
  | CreateCheckFAQCategoryConflictRequest
  | UpdateCheckFAQCategoryConflictRequest
  | CreateCheckSeniorFAQCategoryConflictRequest
  | UpdateCheckSeniorFAQCategoryConflictRequest
  | TranslateFAQRequest;

export type HobitAdminPutApiRequest =
  | UpdatePasswordRequest
  | UpdateFAQRequest
  | UpdateSeniorFAQRequest
  | UpdateUserFeedbackRequest
  | ChangeFAQCategoryRequest
  | ChangeSeniorFAQCategoryRequest
  | UpdateFAQCategoryOrderRequest
  | UpdateSeniorFAQCategoryOrderRequest;

export type HobitAdminDeleteApiRequest =
  | DeleteAccountReqeust
  | DeleteFAQRequest
  | DeleteSeniorFAQRequest
  | DeleteUserFeedbackRequest;

export type HobitAdminApiResponse =
  | LoginResponse
  | LogoutResponse
  | SignupResponse
  | FindUserResponse
  | UpdatePasswordResponse
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
  | GetAllAdminLogResponse
  | CompareFAQLogResponse
  | CompareSeniorFAQLogResponse
  | GetAllUserFeedbackResponse
  | UpdateUserFeedbackResponse
  | GetAllFAQCategoryResponse
  | GetAllSeniorFAQCategoryResponse
  | DeleteUserFeedbackResponse
  | CheckFAQCategoryConflictResponse
  | CheckSeniorFAQCategoryConflictResponse
  | ChangeFAQCategoryResponse
  | ChangeSeniorFAQCategoryResponse
  | SwaggerResponse;

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
