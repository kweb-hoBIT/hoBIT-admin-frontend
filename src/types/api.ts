import { LoginRequest, LoginResponse, SignupRequest, SignupResponse, NewAccessTokenRequest, NewAccessTokenResponse, DeleteAccountReqeust, DeleteAccountResponse } from './user';
import { FaqDeleteResponse, FaqDeleteRequest, FaqGetRequest, FaqGetResponse, FaqPostRequest, FaqPostResponse, FaqPutRequest, FaqTranslateRequest, FaqTranslateResponse } from './faq';

export type HobitAdminApiRequest =
  | LoginRequest
  | SignupRequest
  | NewAccessTokenRequest
  | DeleteAccountReqeust
  | FaqGetRequest
  | FaqPostRequest
  | FaqPutRequest
  | FaqTranslateRequest
  | FaqDeleteRequest;


export type HobitAdminApiResponse =
  | LoginResponse
  | SignupResponse
  | NewAccessTokenResponse
  | DeleteAccountResponse
  | FaqGetResponse
  | FaqPostResponse
  | FaqPostResponse
  |FaqTranslateResponse
  | FaqDeleteResponse;

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
