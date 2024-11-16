import { LoginRequest, LoginResponse, SignupRequest, SignupResponse } from './user';

export type HobitAdminApiRequest =
  | ({ type: 'auth' } & LoginRequest)
  | ({ type: 'users' } & SignupRequest);


export type HobitAdminApiResponse =
  | ({ type: 'auth' } & LoginResponse)
  | ({ type: 'users' } & SignupResponse);

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
