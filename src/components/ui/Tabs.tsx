import React, { useRef } from 'react';
import SlidingIndicator from './SlidingIndicator';

/**
 * 카드 위쪽 탭 줄 — 목록과 한 카드로 붙여 씀 (예전엔 탭만 따로 큰 카드였음)
 *   <section className="panel"> <Tabs .../> <div className="p-6">목록</div> </section>
 */
type Tab<T extends string> = { value: T; label: string; badge?: number };

interface TabsProps<T extends string> {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  right?: React.ReactNode; // 오른쪽 끝 (예: 로그 분석하기)
}

function Tabs<T extends string>({ tabs, value, onChange, right }: TabsProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="relative flex items-center gap-6 border-b border-line px-6" role="tablist">
      <SlidingIndicator containerRef={ref} activeKey={value} variant="underline" className="bg-accent-ink" />
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            data-active={active ? 'true' : undefined}
            onClick={() => onChange(tab.value)}
            className={`flex items-center gap-2 py-4 text-[17px] font-semibold transition-colors ${
              active ? 'text-accent-ink' : 'text-ink-2 hover:text-ink'
            }`}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">{tab.badge}</span>
            )}
          </button>
        );
      })}
      {right && <div className="ml-auto">{right}</div>}
    </div>
  );
}

export default Tabs;
