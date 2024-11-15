import { RateFaqRequest, RateFaqResponse } from './faq';
import { GetQuestionRequest, GetQuestionResponse } from './question';
import { LoginRequest, LoginResponse } from './user';

export type HobitAdminApiRequest =
  | ({ type: 'get_question' } & GetQuestionRequest)
  | ({ type: 'rate_faq' } & RateFaqRequest)
  | ({ type: 'auth' } & LoginRequest);

export type HobitAdminApiResponse =
  | ({ type: 'get_question' } & GetQuestionResponse)
  | ({ type: 'rate' } & RateFaqResponse)
  | ({ type: 'auth' } & LoginResponse);

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
