import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

/**
 * 탭 선택 표시가 옆으로 "스으윽" 미끄러지는 효과 (Apple 탭 전환 느낌)
 *  - 가는 방향 쪽 끝이 먼저 출발하고 반대쪽 끝이 조금 늦게 따라옴 → 잠깐 늘어났다가 줄어드는 쫀득한 느낌
 *  - 끝에서 살짝 넘쳤다 돌아옴 (spring 곡선)
 *  - 처음 그릴 때·창 크기가 바뀔 때는 움직이지 않고 바로 그 자리에 (움직임은 탭을 바꿀 때만)
 *
 * 위치는 항상 최종 값으로 두고, 움직임만 그 위에 잠깐 재생 (Web Animations)
 *  → 도중에 화면 이동·창 크기 변화가 끼어도 표시가 두 탭에 걸친 채 멈추지 않음
 *
 * 쓰는 법: 탭들을 감싼 요소에 `relative`와 ref, 선택된 탭에 data-active="true"
 *   <div ref={ref} className="relative flex"> <SlidingIndicator containerRef={ref} activeKey={tab} className="bg-card rounded-full" /> ...탭들 </div>
 *   탭 버튼에는 `relative z-[1]` (표시 위로 글자가 보이게)
 */
type Props = {
  containerRef: React.RefObject<HTMLElement>;
  /** 선택이 바뀌면 바뀌는 값 */
  activeKey: unknown;
  className?: string;
  /** 'fill' = 탭 전체를 덮는 배경 · 'underline' = 아래 선 */
  variant?: 'fill' | 'underline';
};

type Box = { left: number; right: number; top: number; height: number };

const SPRING = 'cubic-bezier(.3, 1.35, .5, 1)'; // 살짝 넘쳤다 돌아옴
const DURATION = 620; // 이동 시간 (ms)
const LAG = 90; // 늦게 따라오는 끝의 지연 (ms)

const reduceMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const SlidingIndicator: React.FC<Props> = ({ containerRef, activeKey, className = '', variant = 'fill' }) => {
  const [box, setBox] = useState<Box | null>(null);
  const elRef = useRef<HTMLSpanElement>(null);
  const prevKey = useRef<unknown>(activeKey);

  const measure = (): Box | null => {
    const c = containerRef.current;
    const el = c?.querySelector<HTMLElement>('[data-active="true"]');
    if (!c || !el) return null;
    const left = el.offsetLeft;
    return { left, right: c.clientWidth - left - el.offsetWidth, top: el.offsetTop, height: el.offsetHeight };
  };

  // 선택이 바뀌면: 지금 보이는 위치에서 새 위치로 미끄러짐
  useLayoutEffect(() => {
    const next = measure();
    const el = elRef.current;
    const changed = prevKey.current !== activeKey;
    prevKey.current = activeKey;
    if (el && next && changed && !reduceMotion() && typeof el.animate === 'function') {
      const cs = getComputedStyle(el); // 움직이는 중이면 그 순간 위치에서 이어서
      const fromL = parseFloat(cs.left);
      const fromR = parseFloat(cs.right);
      el.getAnimations().forEach((a) => a.cancel());
      if (Number.isFinite(fromL) && Number.isFinite(fromR) && (fromL !== next.left || fromR !== next.right)) {
        const toRight = next.left > fromL;
        const opts = (lag: boolean): KeyframeAnimationOptions => ({ duration: DURATION, easing: SPRING, delay: lag ? LAG : 0, fill: 'backwards' });
        // 오른쪽으로 갈 때: 오른쪽 끝 먼저, 왼쪽 끝이 따라옴 (왼쪽으로 갈 때는 반대)
        el.animate([{ left: `${fromL}px` }, { left: `${next.left}px` }], opts(toRight));
        el.animate([{ right: `${fromR}px` }, { right: `${next.right}px` }], opts(!toRight));
      }
    }
    setBox(next);
  }, [activeKey]); // eslint-disable-line

  // 다시 그릴 때마다 위치 확인 — 배지가 새로 생기는 등 탭 너비가 바뀌어도 바로 맞춤 (같으면 그대로)
  useLayoutEffect(() => {
    const next = measure();
    setBox((b) =>
      b && next && b.left === next.left && b.right === next.right && b.top === next.top && b.height === next.height ? b : next
    );
  });

  // 크기가 바뀌면(창 크기·글자 로딩·배지 숫자) 움직임 없이 맞춤
  // useEffect(화면에 붙은 뒤)로 — 처음 그릴 때는 감싸는 칸의 ref가 이 부품의 layout effect보다 늦게 붙어서
  // 칸을 못 찾고 표시가 안 보였음 (모달처럼 다시 그려지지 않는 곳에서는 계속 비어 있었음)
  useEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    setBox(measure());
    const ro = new ResizeObserver(() => setBox(measure()));
    const watch = () => c.querySelectorAll('[role="tab"], button').forEach((el) => ro.observe(el));
    ro.observe(c);
    watch();
    // 나중에 생긴 탭(더보기로 옮겨진 메뉴 등)도 지켜봄
    const mo = new MutationObserver(watch);
    mo.observe(c, { childList: true, subtree: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, [containerRef]); // eslint-disable-line

  if (!box) return null;
  const style: React.CSSProperties =
    variant === 'underline'
      ? { left: box.left, right: box.right, bottom: -1, height: 2 } // 아래 테두리 위에 겹침
      : { left: box.left, right: box.right, top: box.top, height: box.height };

  return <span ref={elRef} aria-hidden="true" className={`sliding-indicator pointer-events-none absolute ${className}`} style={style} />;
};

export default SlidingIndicator;
