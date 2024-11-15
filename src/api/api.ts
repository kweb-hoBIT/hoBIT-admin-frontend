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
  R extends { type: T['type'] } & HobitAdminApiResponse,
>(req: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  const path = req.type;

  let resp;
  try {
    resp = await fetch(`${endpoint}/${path}`, {
      method: 'POST',
      mode: 'cors',
      headers,
      body: JSONbig.stringify(req),
    });
  } catch (err) {
    return {
      error: fetchErrorPayload,
      payload: null,
    };
  }

  try {
    const json = await resp.json();
    return {
      error: null,
      payload: json as R,
    };
  } catch (err) {
    return { error: jsonParseFailPayload, payload: null };
  }
}
