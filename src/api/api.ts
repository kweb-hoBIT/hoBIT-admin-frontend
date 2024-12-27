import JSONbig from 'json-bigint';
import { envs } from '../envs';
import {
  ApiResponse,
  fetchErrorPayload,
  HobitAdminGetApiRequest,
  HobitAdminPostApiRequest,
  HobitAdminPutApiRequest,
  HobitAdminDeleteApiRequest,
  HobitAdminApiResponse,
  jsonParseFailPayload,
} from '../types/api';

const endpoint = `${envs.HOBIT_BACKEND_ENDPOINT!}/api`;

export async function hobitGetApi<
  T extends HobitAdminGetApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, req?: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  let resp: Response | undefined;
  try {
    if (req) {
      const {params, query} = req;
      if(Object.keys(params).length !== 0){
        path = `${path}/${Object.values(params)}`;
      } else if(Object.keys(query).length !== 0){
        const queryParams = new URLSearchParams(
          Object.fromEntries(Object.entries(query).map(([key, value]) => [key, String(value)]))
        ).toString();
        path = `${path}?${queryParams}`;
      } else {
        path = `${path}`;
      }
      resp = await fetch(`${endpoint}/${path}`, {
        method: 'GET',
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

export async function hobitPostApi<
  T extends HobitAdminPostApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, req: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  let resp: Response | undefined;
  try {
    if (req) {
      const {body} = req;
      resp = await fetch(`${endpoint}/${path}`, {
        method: 'POST',
        mode: 'cors',
        headers,
        credentials: 'include',
        body: JSONbig.stringify(body),
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


export async function hobitPutApi<
  T extends HobitAdminPutApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, req: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  let resp: Response | undefined;
  try {
    if (req) {
      const {params, body} = req;
      console.log(params, body);
      path = `${path}/${Object.values(params)}`;
      resp = await fetch(`${endpoint}/${path}`, {
        method: 'PUT',
        mode: 'cors',
        headers,
        body: JSONbig.stringify(body),
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

export async function hobitDeleteApi<
  T extends HobitAdminDeleteApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, req?: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  let resp: Response | undefined;
  try {
    if (req) {
      const {params, body} = req;
      path = `${path}/${Object.values(params)}`;
      if(Object.keys(body).length !== 0){
        resp = await fetch(`${endpoint}/${path}`, {
          method: 'DELETE',
          mode: 'cors',
          headers,
          body: JSONbig.stringify(body),
        });
      } else{
        resp = await fetch(`${endpoint}/${path}`, {
          method: 'DELETE',
          mode: 'cors',
          headers,
        });
      }

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