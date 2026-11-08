import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from './Icon';

/**
 * 목록 화면 공통 조각
 *  - ListHeader: 1줄 = 제목(+작은 설명, 총 개수) · 오른쪽 주 버튼 / 2줄 = 왼쪽 정렬·거르기 · 오른쪽 보조 버튼
 *  - ListEnd: 무한 스크롤 끝 표시(sentinel) + "모두 봤어요 (N개)"
 *  - ListSkeleton: 불러오는 동안 카드 모양 자리
 *  - LoadError: 불러오지 못했을 때 안내 + 다시 시도
 *  - ScrollTopFab: 두 화면쯤 내려가면 오른쪽 아래 "맨 위로"
 */

export const ListHeader: React.FC<{
  title: React.ReactNode;
  description?: React.ReactNode;
  count?: number;
  action?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}> = ({ title, description, count, action, left, right, className = '' }) => (
  <div className={`mb-5 flex flex-col gap-3 ${className}`}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h4 className="flex flex-wrap items-baseline gap-x-2 text-xl font-bold text-ink">
          {title}
          {count != null && <span className="text-sm font-semibold text-ink-3 tabular-nums">총 {count.toLocaleString()}개</span>}
        </h4>
        {description && <p className="mt-0.5 text-xs text-ink-3">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
    {(left || right) && (
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-2">{left}</div>
        {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
      </div>
    )}
  </div>
);

export const ListEnd: React.FC<{ hasMore: boolean; total: number; sentinelRef: (el: Element | null) => void }> = ({
  hasMore,
  total,
  sentinelRef,
}) =>
  hasMore ? (
    <div ref={sentinelRef} className="flex justify-center py-6" aria-hidden="true">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-card-3 border-t-accent-ink" />
    </div>
  ) : total > 0 ? (
    <p className="pb-14 pt-6 text-center text-sm text-ink-3 sm:pb-2">모두 봤어요 ({total.toLocaleString()}개)</p>
  ) : null;

/** 불러오는 동안 — 카드 모양 회색 자리 (내용이 들어와도 크게 밀리지 않게 비슷한 높이로) */
export const ListSkeleton: React.FC<{ count?: number; lines?: number; withHeader?: boolean; withSearch?: boolean }> = ({
  count = 6,
  lines = 3,
  withHeader = true,
  withSearch = false,
}) => (
  <div aria-busy="true" aria-label="불러오는 중">
    {withSearch && (
      // FAQ 검색 칸 자리
      <div className="p-3 sm:p-6">
        <div className="mb-4 h-7 w-28 animate-pulse rounded-lg bg-card" />
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <div className="h-11 animate-pulse rounded-xl bg-card sm:w-40" />
          <div className="h-12 flex-1 animate-pulse rounded-xl bg-card" />
        </div>
      </div>
    )}
  <div className="p-3 sm:p-6">
    {withHeader && (
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="h-7 w-40 animate-pulse rounded-lg bg-card" />
          <div className="h-10 w-16 animate-pulse rounded-xl bg-card" />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="h-10 w-32 animate-pulse rounded-xl bg-card" />
          <div className="h-10 w-24 animate-pulse rounded-xl bg-card" />
        </div>
      </div>
    )}
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse rounded-xl bg-card p-4">
          <div className="mb-3 h-5 w-3/4 rounded bg-card-2" />
          {Array.from({ length: lines }, (_, j) => (
            <div key={j} className="mb-2 h-4 rounded bg-card-2" style={{ width: `${55 - j * 8}%` }} />
          ))}
        </div>
      ))}
    </div>
  </div>
  </div>
);

export const LoadError: React.FC<{ message?: string; onRetry?: () => void }> = ({
  message = '목록을 불러오지 못했어요.',
  onRetry,
}) => (
  <div className="flex flex-col items-center gap-3 px-4 py-16 text-center" role="alert">
    <Icon name="alert" className="h-8 w-8 text-ink-3" />
    <p className="font-semibold text-ink">{message}</p>
    <p className="text-sm text-ink-3">잠시 후 다시 시도해 주세요. 계속 안 되면 서버가 켜져 있는지 확인해 주세요.</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white hover:bg-accent/90"
      >
        <Icon name="refresh" />
        다시 시도
      </button>
    )}
  </div>
);

/** 두 화면쯤 내려가면 오른쪽 아래에 "맨 위로" — 왼쪽 아래 "목록으로"(BackFab)와 같은 높이, 반대편 */
export const ScrollTopFab: React.FC = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    // 스크롤마다 그리지 않고 한 프레임에 한 번만 보고, 보임 여부가 바뀔 때만 다시 그림
    const check = () => {
      raf = 0;
      setVisible(window.scrollY > window.innerHeight * 2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  if (!visible || pathname.startsWith('/chats')) return null;
  const smooth = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' })}
      aria-label="맨 위로"
      title="맨 위로"
      className="back-fab fixed bottom-4 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-ink-2 shadow-lg transition-colors hover:border-accent-ink/40 hover:text-accent-ink sm:bottom-6 sm:right-6 sm:h-12 sm:w-12 2xl:right-10"
    >
      <Icon name="arrowUp" className="h-5 w-5" />
    </button>
  );
};

/**
 * 카드 아래 줄 — 왼쪽 '더보기'(상세 화면으로 가거나 카드 안에서 펼치기), 오른쪽 버튼들(수정·삭제·완료 등)을 한 줄에
 * (예전엔 버튼이 카드 위·아래 끝에 떨어져 있어 가운데가 비고, 글이 버튼 자리만큼 좁았음)
 */
export const CardFooter: React.FC<{
  onMore?: () => void;
  expanded?: boolean; // 펼치기 카드면 true/false, 상세 화면으로 가는 카드면 undefined
  children?: React.ReactNode;
}> = ({ onMore, expanded, children }) => (
  <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/70 pt-3">
    {onMore ? (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onMore();
        }}
        aria-expanded={expanded}
        className="-ml-1 inline-flex min-h-[36px] items-center gap-0.5 rounded-lg px-1 text-sm font-semibold text-accent-ink hover:underline"
      >
        {expanded === undefined ? '더보기' : expanded ? '접기' : '더보기'}
        <svg viewBox="0 0 20 20" className={`h-4 w-4 transition-transform ${expanded === undefined ? '-rotate-90' : expanded ? 'rotate-180' : ''}`} aria-hidden="true">
          <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    ) : (
      <span />
    )}
    {children && (
      <div className="flex shrink-0 items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    )}
  </div>
);

/** 카드 안 펼치기 상태 (id별) */
export function useExpanded<K>() {
  const [open, setOpen] = useState<Set<K>>(() => new Set());
  const toggle = (k: K) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  return { isOpen: (k: K) => open.has(k), toggle };
}
