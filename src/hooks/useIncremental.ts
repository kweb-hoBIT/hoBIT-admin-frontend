import { useCallback, useEffect, useState } from 'react';

/**
 * 다 받아 둔 목록을 조금씩 그림 (무한 스크롤) — 처음 20개, 목록 끝 표시(sentinel)가 화면 600px 앞까지 오면 20개 더
 *  - resetKey(검색어·정렬·탭 등)가 바뀌면 다시 처음 20개부터
 *  - 쪽 번호 대신 쓰므로 고르기·전체 삭제 같은 기능은 전체 목록(items)을 그대로 쓰면 돼요
 */
export function useIncremental<T>(items: readonly T[], resetKey: unknown = null, step = 20) {
  const [state, setState] = useState({ key: resetKey, count: step });
  // 거르기가 바뀌면 그리는 중에 바로 처음 개수로 (한 번 더 그리며 깜빡이지 않게)
  let count = state.count;
  if (!Object.is(state.key, resetKey)) {
    count = step;
    setState({ key: resetKey, count: step });
  }

  const total = items.length;
  const hasMore = count < total;
  const [sentinel, setSentinel] = useState<Element | null>(null);

  useEffect(() => {
    if (!sentinel || !hasMore || typeof IntersectionObserver === 'undefined') return;
    // 개수가 늘 때마다 새로 감시 — 화면이 길어 sentinel이 아직 보이면 바로 한 번 더 불러옴
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setState((s) => ({ ...s, count: s.count + step }));
      },
      { rootMargin: '0px 0px 600px 0px' }
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [sentinel, hasMore, count, step]);

  const sentinelRef = useCallback((el: Element | null) => setSentinel(el), []);
  const showAll = useCallback(() => setState((s) => ({ ...s, count: Number.MAX_SAFE_INTEGER })), []);

  return { shown: items.slice(0, count), total, hasMore, sentinelRef, showAll };
}
