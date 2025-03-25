import JSONbig from 'json-bigint';
import envs from '../config/envs';
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

const endpoint = `${envs.HOBIT_ADMIN_BACKEND_ENDPOINT!}`;

export async function hobitGetApi<
  T extends HobitAdminGetApiRequest & { params?: Record<string, string>, query?: Record<string, string | number> },
  R extends HobitAdminApiResponse,
>(path: string, req?: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };


  let resp: Response | undefined;
  try {
    const params = req?.params ? req.params : {};
    const query = req?.query ? req.query : {};
    if (req?.params && Object.keys(params).length > 0) {
      path = `${path}/${Object.values(params).join('/')}`;
    }
    // 쿼리 처리
    if (Object.keys(query).length > 0) {
      const queryParams = new URLSearchParams(
        Object.entries(query).map(([key, value]) => [key, String(value)])
      ).toString();
      path = `${path}?${queryParams}`;
    }
    
    resp = await fetch(`${endpoint}/${path}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers,
    });
    
    
    if (resp.ok) {
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
  T extends HobitAdminPostApiRequest & { body?: Record<string, any> },
  R extends HobitAdminApiResponse,
>(path: string, req?: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  let resp: Response | undefined;
  try {
    const body = req?.body ?? {};
    resp = await fetch(`${endpoint}/${path}`, {
      method: 'POST',
      mode: 'cors',
      headers,
      credentials: 'include',
      body: JSONbig.stringify(body),
    });

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
  T extends HobitAdminPutApiRequest & { params?: Record<string, string>, body?: Record<string, any> },
  R extends HobitAdminApiResponse,
>(path: string, req: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  let resp: Response | undefined;
  try {
    const params = req?.params ?? {};
    const body = req?.body ?? {};
    path = `${path}/${Object.values(params)}`;
    resp = await fetch(`${endpoint}/${path}`, {
      method: 'PUT',
      mode: 'cors',
      headers,
      credentials: 'include',
      body: JSONbig.stringify(body),
    });
    
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
  T extends HobitAdminDeleteApiRequest & { params?: Record<string, string>, body?: Record<string, any> },
  R extends HobitAdminApiResponse,
>(path: string, req: T): Promise<ApiResponse<R>> {
  const headers: Record<string, string> = {
    'Content-type': 'application/json',
  };

  let resp: Response | undefined;
  try {
    const params = req.params ?? {};
    const body = req.body ?? {};
    path = `${path}/${Object.values(params)}`;
    if(Object.keys(body).length !== 0){
      resp = await fetch(`${endpoint}/${path}`, {
        method: 'DELETE',
        mode: 'cors',
        headers,
        credentials: 'include',
        body: JSONbig.stringify(body),
      });
    } else{
      resp = await fetch(`${endpoint}/${path}`, {
        method: 'DELETE',
        mode: 'cors',
        credentials: 'include',
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