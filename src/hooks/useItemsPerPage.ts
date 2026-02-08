import { useCallback } from 'react';
import { useAppDispatch } from '../redux/store';
import type { AnyAction } from '@reduxjs/toolkit';

interface UseItemsPerPageOpts {
  actionCreator: (n: number) => AnyAction;
  resetters: React.Dispatch<React.SetStateAction<number>>[];
}

export function useItemsPerPage({
  actionCreator,
  resetters,
}: UseItemsPerPageOpts) {
  const dispatch = useAppDispatch();

  const handleItemsPerPage = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const n = Number(e.target.value);
      dispatch(actionCreator(n));
      resetters.forEach((set) => set(1));
    },
    [dispatch, actionCreator, resetters],
  );

  return { handleItemsPerPage };
}
