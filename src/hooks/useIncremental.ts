import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { markShown } from '../components/ui/motion';

/**
 * 목록 위치 기억 — 카드를 눌러 상세 화면에 갔다가 돌아오면 그리던 개수와 스크롤 위치 그대로
 *  - 탭마다 따로(sessionStorage), 목록 주소 + 거르기(resetKey)가 같을 때만 되살림
 *  - 되살리는 때: 브라우저 뒤로가기(POP), 또는 이 목록의 하위 화면(restoreFrom)에 다녀온 뒤 (예: "목록으로" 버튼)
 *  - 위치는 "화면 맨 위에 걸친 카드 몇 번째 + 그 카드의 화면 위 거리"로 기억
 *    (화면 밖 카드 높이를 어림하는 목록(content-visibility)이라도 같은 카드가 같은 자리에 와요)
 */
type Saved = {
  key: string;
  count: number;
  scrollY: number;
  anchorIndex: number; // 화면 맨 위에 걸친 카드 (-1이면 목록 위쪽을 보고 있었음)
  anchorTop: number;
  to?: string; // 목록을 떠나 간 주소
  at: number;
};

const STORE_PREFIX = 'hobit-list:';
const MAX_AGE_MS = 30 * 60_000;

const readSaved = (path: string): Saved | null => {
  try {
    const raw = sessionStorage.getItem(STORE_PREFIX + path);
    const s = raw ? (JSON.parse(raw) as Saved) : null;
    return s && Date.now() - s.at < MAX_AGE_MS ? s : null;
  } catch {
    return null;
  }
};
const writeSaved = (path: string, s: Saved) => {
  try {
    sessionStorage.setItem(STORE_PREFIX + path, JSON.stringify(s));
  } catch {}
};
const clearSaved = (path: string) => {
  try {
    sessionStorage.removeItem(STORE_PREFIX + path);
  } catch {}
};

/** 목록 상자 안에서 화면 맨 위(0)에 걸친 첫 카드 — 카드는 위→아래 순서라 반씩 나눠 찾음 */
const findAnchor = (list: HTMLElement): { anchorIndex: number; anchorTop: number } => {
  const kids = list.children;
  if (!kids.length || list.getBoundingClientRect().top >= 0) return { anchorIndex: -1, anchorTop: 0 };
  let lo = 0;
  let hi = kids.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (kids[mid].getBoundingClientRect().bottom > 0) hi = mid;
    else lo = mid + 1;
  }
  return { anchorIndex: lo, anchorTop: kids[lo].getBoundingClientRect().top };
};

/** 목록이 화면에 제대로 붙어 있을 때만 위치를 잼 (화면 전환 중 숨겨졌으면 높이가 0) */
const measurable = (list: HTMLElement) => list.isConnected && list.getBoundingClientRect().height > 0;

export type IncrementalOptions = {
  step?: number;
  /** 이 목록의 하위 화면(상세·수정 등) 주소 — 거기 다녀와 "목록으로"로 돌아와도 위치를 되살림. 없으면 뒤로가기 때만 */
  restoreFrom?: RegExp;
};

/**
 * 다 받아 둔 목록을 조금씩 그림 (무한 스크롤) — 처음 20개, 목록 끝 표시(sentinel)가 화면 600px 앞까지 오면 20개 더
 *  - resetKey(검색어·정렬·탭 등)가 바뀌면 다시 처음 20개부터 (기억해 둔 위치도 지움)
 *  - 쪽 번호 대신 쓰므로 고르기·전체 삭제 같은 기능은 전체 목록(items)을 그대로 쓰면 돼요
 *  - listRef를 카드들을 바로 담은 상자(grid)에 붙이면 상세 화면에 다녀와도 위치를 되살려요
 *  - 항목을 지워 items가 줄어도 그리던 개수·스크롤은 그대로 (resetKey가 같으면)
 */
export function useIncremental<T>(items: readonly T[], resetKey: unknown = null, options: IncrementalOptions = {}) {
  const { step = 20, restoreFrom } = options;
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const keyStr = String(resetKey);

  // 처음 그릴 때 되살릴 위치가 있으면 그 개수만큼 바로 그림
  const restoreRef = useRef<Saved | null | undefined>(undefined);
  if (restoreRef.current === undefined) {
    const s = readSaved(pathname);
    const ok = !!s && s.key === keyStr && (navType === 'POP' || (!!restoreFrom && !!s.to && restoreFrom.test(s.to)));
    restoreRef.current = ok ? s : null;
  }

  const [state, setState] = useState(() => {
    const want = restoreRef.current?.count ?? 0;
    return { key: resetKey, count: Math.max(step, Math.ceil(want / step) * step) };
  });
  // 거르기가 바뀌면 그리는 중에 바로 처음 개수로 (한 번 더 그리며 깜빡이지 않게)
  let count = state.count;
  if (!Object.is(state.key, resetKey)) {
    count = step;
    restoreRef.current = null;
    setState({ key: resetKey, count: step });
  }

  const total = items.length;
  const hasMore = count < total;
  const [sentinel, setSentinel] = useState<Element | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 거르기가 바뀌면 기억해 둔 위치를 지움 (처음 그릴 때는 그대로)
  const firstKey = useRef(keyStr);
  useEffect(() => {
    if (keyStr !== firstKey.current) clearSaved(pathname);
  }, [keyStr, pathname]);

  // 지금 위치를 기억 — 스크롤이 멈추면(0.15초 뒤) 한 번, 목록을 떠날 때 한 번
  const latest = useRef({ count, total, keyStr, pathname });
  latest.current = { count, total, keyStr, pathname };
  const save = useCallback((to?: string) => {
    const { count: c, total: t, keyStr: k, pathname: p } = latest.current;
    const list = listRef.current;
    if (list && !measurable(list)) {
      // 숨겨진 채로 떠나는 중 — 위치는 마지막으로 잰 값을 두고, 간 곳만 적음
      const prev = readSaved(p);
      if (prev && to && prev.key === k) writeSaved(p, { ...prev, to, at: Date.now() });
      return;
    }
    const anchor = list ? findAnchor(list) : { anchorIndex: -1, anchorTop: 0 };
    writeSaved(p, { key: k, count: Math.min(c, t), scrollY: window.scrollY, ...anchor, to, at: Date.now() });
  }, []);

  useLayoutEffect(() => {
    let timer = 0;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => save(), 150);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(timer);
      // 화면을 바꾸는 중 — 주소는 이미 새 화면이고, 카드는 아직 붙어 있음 (layout effect 정리는 DOM을 떼기 전)
      save(window.location.pathname);
    };
  }, [save]);

  // 되살리기 — 목록이 그 개수만큼 그려진 뒤, 화면에 그리기 전에 스크롤 (번쩍이지 않게). 다음 프레임에 한 번 더 맞춤
  const hasItems = total > 0;
  useLayoutEffect(() => {
    const s = restoreRef.current;
    if (!s || !hasItems) return;
    restoreRef.current = null;
    const list = listRef.current;
    const place = () => {
      const anchor = list && list.isConnected && s.anchorIndex >= 0 ? list.children[s.anchorIndex] : undefined;
      if (anchor) window.scrollBy(0, anchor.getBoundingClientRect().top - s.anchorTop);
      else window.scrollTo(0, s.scrollY); // 목록 위쪽을 보고 있었거나 지워져 카드가 줄었으면 같은 높이로
    };
    // 되살린 카드는 나타나기 움직임 없이 바로 보이게
    if (list) Array.from(list.children).forEach(markShown);
    place();
    const raf = requestAnimationFrame(place);
    return () => cancelAnimationFrame(raf);
  }, [hasItems]);

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

  return { shown: items.slice(0, count), total, hasMore, sentinelRef, showAll, listRef };
}
