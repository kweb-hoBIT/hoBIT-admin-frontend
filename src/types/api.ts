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
  UpdateFAQCategoryRequest,
  UpdateFAQCategoryResponse,
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
  UpdateSeniorFAQCategoryRequest,
  UpdateSeniorFAQCategoryResponse,
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
  CountQuestionLogsRequest,
  CountQuestionLogsResponse,
  BulkDeleteQuestionLogsRequest,
  BulkDeleteQuestionLogsResponse,
} from './questionLog';

import {
  GetAllAdminLogRequest,
  GetAllAdminLogResponse,
  CompareFAQLogRequest,
  CompareFAQLogResponse,
  CompareSeniorFAQLogRequest,
  CompareSeniorFAQLogResponse,
  CountAdminLogsRequest,
  CountAdminLogsResponse,
  BulkDeleteAdminLogsRequest,
  BulkDeleteAdminLogsResponse,
} from './adminLog';

import {
  GetAllUserFeedbackRequest,
  GetAllUserFeedbackResponse,
  UpdateUserFeedbackRequest,
  UpdateUserFeedbackResponse,
  DeleteUserFeedbackRequest,
  DeleteUserFeedbackResponse,
  CountFeedbacksRequest,
  CountFeedbacksResponse,
  BulkDeleteFeedbacksRequest,
  BulkDeleteFeedbacksResponse,
} from './feedback';

import { TranslateFAQRequest, TranslateFAQResponse } from './translate';

import { SwaggerRequest, SwaggerResponse } from './swagger';

import { BulkUpdateEmailRequest, BulkUpdateEmailResponse, GetAllEmailsRequest, GetAllEmailsResponse, BulkDeleteEmailRequest, BulkDeleteEmailResponse } from './email';

import { BulkUpdateAdminRequest, BulkUpdateAdminResponse, GetAllAdminsRequest, GetAllAdminsResponse, BulkDeleteAdminRequest, BulkDeleteAdminResponse } from './admin';

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
  | SwaggerRequest
  | GetAllEmailsRequest
  | GetAllAdminsRequest
  | CountFeedbacksRequest
  | CountAdminLogsRequest
  | CountQuestionLogsRequest;

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
  | UpdateFAQCategoryRequest
  | UpdateSeniorFAQCategoryRequest
  | UpdateFAQCategoryOrderRequest
  | UpdateSeniorFAQCategoryOrderRequest
  | BulkUpdateEmailRequest
  | BulkUpdateAdminRequest;

export type HobitAdminDeleteApiRequest =
  | DeleteAccountReqeust
  | DeleteFAQRequest
  | DeleteSeniorFAQRequest
  | BulkDeleteFeedbacksRequest
  | BulkDeleteAdminLogsRequest
  | BulkDeleteQuestionLogsRequest
  | DeleteUserFeedbackRequest
  | BulkDeleteEmailRequest
  | BulkDeleteAdminRequest;

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
  | UpdateFAQCategoryOrderResponse
  | UpdateSeniorFAQCategoryOrderResponse
  | UpdateFAQCategoryResponse
  | UpdateSeniorFAQCategoryResponse
  | SwaggerResponse
  | BulkUpdateEmailResponse
  | GetAllEmailsResponse
  | BulkDeleteEmailResponse
  | BulkUpdateAdminResponse
  | GetAllAdminsResponse
  | BulkDeleteAdminResponse
  | CountFeedbacksResponse
  | BulkDeleteFeedbacksResponse
  | CountAdminLogsResponse
  | BulkDeleteAdminLogsResponse
  | CountQuestionLogsResponse
  | BulkDeleteQuestionLogsResponse;

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
