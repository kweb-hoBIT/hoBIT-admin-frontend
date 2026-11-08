import React, { useEffect, useRef, useState } from 'react';

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** 숫자가 0부터 목표값까지 차르륵 올라감 (ease-out). 움직임 줄이기 설정이면 바로 목표값 */
export function useCountUp(target: number, duration = 900, delay = 0): number {
  const [value, setValue] = useState(reducedMotion() ? target : 0);
  const from = useRef(0);
  useEffect(() => {
    if (reducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay;
    const begin = from.current;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(begin + (target - begin) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay]);
  return value;
}

export const CountUp: React.FC<{ value: number; delay?: number; className?: string }> = ({ value, delay, className }) => {
  const v = useCountUp(value, 900, delay);
  return <span className={className}>{v.toLocaleString()}</span>;
};

/* ── 스크롤 위치에 따라 나타나기 ─────────────────────────────────────────────
 * 화면 전체가 감시자(IntersectionObserver) 하나를 같이 씀 — 항목마다 따로 만들지 않아요.
 * 쓰는 법: <li ref={revealRef}> — 처음 보이는 화면 안의 항목은 위에서부터 차례로(촤라락),
 * 아래 항목은 스크롤해서 화면에 들어올 때 살짝 떠오르며 나타나요. 한 번 나타나면 더 보지 않아요.
 * 무한 스크롤로 새로 붙은 항목도 같은 방식으로 나타나고, 이미 보인 항목은 다시 움직이지 않아요.
 * 움직임 줄이기 설정이면 바로 보여요.
 */
const STAGGER_MS = 70;
const STAGGER_MAX_MS = 560;
let sharedObserver: IntersectionObserver | null = null;
const watching = new Set<Element>();
let sweepQueued = false;

// 나타나기가 끝나면 애니메이션을 떼어 냄 — 남아 있으면 카드 안 확인창(fixed)이 다음 카드 밑에 깔릴 수 있음
const show = (el: Element, delay = 0, animate = true) => {
  if (!animate) {
    el.setAttribute('data-shown', 'done');
    return;
  }
  (el as HTMLElement).style.setProperty('--sr-delay', `${delay}ms`);
  const done = (e: Event) => {
    if (e.target !== el) return; // 안쪽 요소의 애니메이션이 끝난 건 무시
    el.removeEventListener('animationend', done);
    el.setAttribute('data-shown', 'done');
  };
  el.addEventListener('animationend', done);
  el.setAttribute('data-shown', 'in');
};

function getObserver(): IntersectionObserver | null {
  if (sharedObserver) return sharedObserver;
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return null;
  sharedObserver = new IntersectionObserver(
    (entries) => {
      // 같이 들어온 항목끼리 화면 위→아래, 왼→오 순서로 조금씩 늦게
      const hits = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
      hits.forEach((e, i) => {
        sharedObserver?.unobserve(e.target);
        watching.delete(e.target);
        show(e.target, Math.min(i * STAGGER_MS, STAGGER_MAX_MS));
      });
    },
    { rootMargin: '0px 0px -24px 0px' }
  );
  return sharedObserver;
}

/** 화면에서 빠진(목록이 바뀐) 항목은 감시를 그만둠 */
const sweep = () => {
  sweepQueued = false;
  watching.forEach((el) => {
    if (!el.isConnected) {
      sharedObserver?.unobserve(el);
      watching.delete(el);
    }
  });
};

export const revealRef = (el: HTMLElement | null) => {
  if (!el || el.hasAttribute('data-sr')) return;
  el.setAttribute('data-sr', '');
  const io = reducedMotion() ? null : getObserver();
  if (!io) {
    show(el, 0, false);
    return;
  }
  watching.add(el);
  io.observe(el);
  if (!sweepQueued) {
    sweepQueued = true;
    window.setTimeout(sweep, 1000);
  }
};

/** 스크롤해서 보일 때 나타나는 묶음 상자 (index·step은 예전 호출과 맞추려고 남겨 둔 것 — 순서는 화면 위치로 정해요) */
export const Reveal: React.FC<{ index?: number; step?: number; className?: string; children: React.ReactNode }> = ({
  className = '',
  children,
}) => (
  <div ref={revealRef} className={className}>
    {children}
  </div>
);
