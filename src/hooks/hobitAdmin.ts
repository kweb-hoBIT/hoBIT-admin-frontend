// hooks.ts 파일

import { useMutation, useQuery } from '@tanstack/react-query';
import { HobitAdminApiRequest, HobitAdminApiResponse } from '../types/api';
import { hobitApi } from '../api/api';

export function useHobitQueryApi<
  T extends HobitAdminApiRequest,
  R extends HobitAdminApiResponse,
>(path: string, req: T, queryKey?: any[]) {
  return useQuery({
    queryKey: queryKey ?? [path],
    queryFn: async () => {
      return hobitApi<T, R>(path, req);
    },
  });
}

export function useHobitMutateApi<
  T extends HobitAdminApiRequest,
  R extends HobitAdminApiResponse,
>(path: string) {
  const { mutateAsync } = useMutation({
    mutationFn: async (req?: T) => {
      const resp = await hobitApi<T, R>(path, req!);
      return resp;
    },
  });

  return mutateAsync;
}
