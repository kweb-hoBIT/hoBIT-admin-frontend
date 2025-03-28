import { useMutation, useQuery } from '@tanstack/react-query';
import {
  HobitAdminGetApiRequest,
  HobitAdminPostApiRequest,
  HobitAdminPutApiRequest,
  HobitAdminDeleteApiRequest,
  HobitAdminApiResponse,
} from '../types/api';
import {
  hobitGetApi,
  hobitPostApi,
  hobitPutApi,
  hobitDeleteApi,
} from '../api/api';

// GET 요청을 처리하는 훅
export function useHobitQueryGetApi<
  T extends HobitAdminGetApiRequest & {
    params?: Record<string, string>;
    query?: Record<string, string | number>;
  },
  R extends HobitAdminApiResponse,
>(path: string, req?: T) {
  return useQuery({
    queryKey: req ? [path, req] : [path],
    queryFn: async () => {
      const resp = await hobitGetApi<T, R>(path, req);
      return resp;
    },
  });
}

// POST 요청을 처리하는 훅
export function useHobitMutatePostApi<
  T extends HobitAdminPostApiRequest & { body?: Record<string, any> },
  R extends HobitAdminApiResponse,
>(path: string) {
  const { mutateAsync } = useMutation({
    mutationFn: async (req?: T) => {
      const resp = await hobitPostApi<T, R>(path, req);
      return resp;
    },
  });

  return mutateAsync;
}

// PUT 요청을 처리하는 훅
export function useHobitMutatePutApi<
  T extends HobitAdminPutApiRequest & {
    params?: Record<string, string>;
    body?: Record<string, any>;
  },
  R extends HobitAdminApiResponse,
>(path: string) {
  const { mutateAsync } = useMutation({
    mutationFn: async (req: T) => {
      const resp = await hobitPutApi<T, R>(path, req);
      return resp;
    },
  });
  return mutateAsync;
}

// DELETE 요청을 처리하는 훅
export function useHobitMutateDeleteApi<
  T extends HobitAdminDeleteApiRequest & {
    params?: Record<string, string>;
    body?: Record<string, any>;
  },
  R extends HobitAdminApiResponse,
>(path: string) {
  const { mutateAsync } = useMutation({
    mutationFn: async (req: T) => {
      const resp = await hobitDeleteApi<T, R>(path, req);
      return resp;
    },
  });
  return mutateAsync;
}
