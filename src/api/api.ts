import JSONbig from 'json-bigint';
import { envs } from '../envs';
import {
  ApiResponse,
  fetchErrorPayload,
  HobitAdminApiRequest,
  HobitAdminApiResponse,
  jsonParseFailPayload,
} from '../types/api';

const endpoint = `${envs.HOBIT_BACKEND_ENDPOINT!}/api`;

export async function hobitApi<
  T extends HobitAdminApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, req?: T, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST'): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  let resp: Response | undefined;
  try {
    if (method === 'GET') {
      if (req) {
        const queryParams = new URLSearchParams(req).toString();
        path = `${path}?${queryParams}`;
        resp = await fetch(`${endpoint}/${path}`, {
          method: 'GET',
          mode: 'cors',
          headers,
        });
      } else {
        path = `${path}`;
        resp = await fetch(`${endpoint}/${path}`, {
          method: 'GET',
          mode: 'cors',
          headers,
        });
      }
    } else if (method === 'POST') {
      path = `${path}`;
      resp = await fetch(`${endpoint}/${path}`, {
        method: 'POST',
        mode: 'cors',
        headers,
        body: JSONbig.stringify(req),
      });
    } else if (method === 'PUT') {
      if (req) {
        const [[paramKey, paramValue], ...rest] = Object.entries(req);
        const remainingBody = Object.fromEntries(rest);

        path = `${path}/${paramValue}`;
        resp = await fetch(`${endpoint}/${path}`, {
          method: 'PUT',
          mode: 'cors',
          headers,
          body: JSONbig.stringify(remainingBody),
        });
      } else {
        throw new Error('PUT 요청에는 req가 필요합니다.');
      }
    } else if (method === 'DELETE') {
      if (req) {
        const [[paramKey, paramValue]] = Object.entries(req);
        path = `${path}/${paramValue}`;
      }
      resp = await fetch(`${endpoint}/${path}`, {
        method: 'DELETE',
        mode: 'cors',
        headers,
      });
    }

    if (resp) {
      try {
        const json = await resp.json();
        return {
          error: null,
          payload: json as R,
        };
      } catch (err) {
        return { error: jsonParseFailPayload, payload: null };
      }
    } else {
      return {
        error: fetchErrorPayload,
        payload: null,
      };
    }
  } catch (err) {
    return {
      error: fetchErrorPayload,
      payload: null,
    };
  }
}