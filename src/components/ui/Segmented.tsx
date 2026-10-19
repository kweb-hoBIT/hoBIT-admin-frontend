import React, { useRef } from 'react';
import SlidingIndicator from './SlidingIndicator';

/** 알약 모양 선택 (예: 운영 시간 | 담당자 역할) — 선택 표시가 옆으로 미끄러짐 */
function Segmented<T extends string>({
  options,
  value,
  onChange,
  className = '',
  itemClassName = 'px-3 py-1',
  stretch = false,
}: {
  options: readonly (readonly [T, string])[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  itemClassName?: string;
  /** 칸을 똑같이 나눠 가로를 채움 */
  stretch?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className={`relative flex rounded-full bg-card p-1 ${className}`}>
      <SlidingIndicator containerRef={ref} activeKey={value} className="rounded-full bg-surface shadow-sm" />
      {options.map(([k, label]) => (
        <button
          key={k}
          type="button"
          aria-pressed={value === k}
          data-active={value === k ? 'true' : undefined}
          onClick={() => onChange(k)}
          className={`relative z-[1] rounded-full text-sm font-semibold transition-colors ${stretch ? 'flex-1' : ''} ${itemClassName} ${
            value === k ? 'text-ink' : 'text-ink-2 hover:text-ink'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default Segmented;
