import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * 목록 데이터(react-query 저장분)를 바로 고치고 뒤에서 다시 받음 — 지우기·상태 바꾸기 뒤 새로고침 대신
 *  - 화면은 고친 목록을 바로 보여 주고(그리던 개수·스크롤 그대로), 서버 목록이 오면 조용히 바꿔 끼움
 *  - path: useHobitQueryGetApi에 준 주소 ('faqs' 등), field: 응답 data 안 목록 이름 ('faqs' 등)
 */
export function useListCache() {
  const qc = useQueryClient();

  /** 목록을 고침 (fn이 새 목록을 돌려줌). refetch=false면 저장분만 고치고 다시 받지 않음 */
  const patch = useCallback(
    <T>(path: string, field: string, fn: (list: T[]) => T[], refetch = true) => {
      qc.setQueriesData({ queryKey: [path] }, (old: any) => {
        const list = old?.payload?.data?.[field];
        if (!Array.isArray(list)) return old;
        return { ...old, payload: { ...old.payload, data: { ...old.payload.data, [field]: fn(list as T[]) } } };
      });
      if (refetch) qc.invalidateQueries({ queryKey: [path] });
    },
    [qc]
  );

  /** 그 목록을 다시 받음 (받는 동안 지금 목록을 그대로 보여 줌) */
  const refetch = useCallback((path: string) => qc.invalidateQueries({ queryKey: [path] }), [qc]);

  return { patch, refetch };
}
