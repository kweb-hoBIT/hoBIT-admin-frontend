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

/** 차례로 나타남 — index마다 조금씩 늦게 (촤라락) */
export const Reveal: React.FC<{ index?: number; step?: number; className?: string; children: React.ReactNode }> = ({
  index = 0,
  step = 70,
  className = '',
  children,
}) => (
  <div className={`reveal ${className}`} style={{ animationDelay: `${index * step}ms` }}>
    {children}
  </div>
);
