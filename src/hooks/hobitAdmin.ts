import { useMutation, useQuery } from '@tanstack/react-query';
import { HobitAdminApiRequest, HobitAdminApiResponse } from '../types/api';
import { hobitApi } from '../api/api';

export function useHobitQueryApi<
  T extends HobitAdminApiRequest,
  R extends { type: T['type'] } & HobitAdminApiResponse,
>(req: T, queryKey?: any[]) {
  return useQuery({
    queryKey: queryKey ?? [req.type],
    queryFn: async () => {
      return hobitApi<T, R>(req);
    },
  });
}

export function useHobitMutateApi<
  T extends HobitAdminApiRequest,
  C extends T['type'],
  R extends { type: C } & HobitAdminApiResponse,
>(type: C) {
  const { mutateAsync } = useMutation({
    mutationFn: async (req?: Omit<T, 'type'>) => {
      const resp = await hobitApi<T, R>({ type, ...req } as T);
      return resp;
    },
  });

  return mutateAsync;
}
