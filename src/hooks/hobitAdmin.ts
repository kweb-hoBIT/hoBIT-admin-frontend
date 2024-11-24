import { useMutation, useQuery } from '@tanstack/react-query';
import { HobitAdminApiRequest, HobitAdminApiResponse } from '../types/api';
import { hobitApi } from '../api/api';

// GET 요청을 처리하는 훅
export function useHobitQueryGetApi<
  T extends HobitAdminApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, req?: T) {
  return useQuery({
    queryKey: req ? [path, req] : [path],
    queryFn: async () => {
      const resp = await hobitApi<T, R>(path, req as T, 'GET');
      return resp;
    },
  });
}

// POST 요청을 처리하는 훅
export function useHobitMutatePostApi<
  T extends HobitAdminApiRequest,
  R extends HobitAdminApiResponse,
>(path: string) {
  const { mutateAsync } = useMutation({
    mutationFn: async (req: T) => {
      const resp = await hobitApi<T, R>(path, req as T, 'POST');
      return resp;
    },
  });

  return mutateAsync;
}

// PUT 요청을 처리하는 훅 (params와 body를 모두 받음)
export function useHobitMutatePutApi<
  T extends HobitAdminApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, params: T) {
  const { mutateAsync } = useMutation({
    mutationFn: async (req: T) => {
      const resp = await hobitApi<T, R>(path, {...params, ...req} as T, 'PUT');
      return resp;
    },
  });

  return mutateAsync;
}

// DELETE 요청을 처리하는 훅 (params만 받음)
export function useHobitMutateDeleteApi<
  T extends HobitAdminApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, params: T) {
  const { mutateAsync } = useMutation({
    mutationFn: async (req?: T) => {
      const resp = await hobitApi<T, R>(path, {...params, ...req }, 'DELETE');
      return resp;
    },
  });

  return mutateAsync;
}

