import React from 'react';
import Select from './Select';

/**
 * 시각 고르기 (HH:MM, 24시간) — 브라우저 기본 시간 선택(파란 오전/오후 칸) 대신 앱의 선택 상자 두 개
 * 분은 5분 단위 (저장된 값이 5분 단위가 아니면 그 값도 목록에 넣어 둠)
 */
const pad = (n: number) => String(n).padStart(2, '0');
const HOURS = Array.from({ length: 24 }, (_, i) => pad(i));
const MINUTES = Array.from({ length: 12 }, (_, i) => pad(i * 5));

const TimeInput: React.FC<{ value: string; onChange: (v: string) => void; 'aria-label'?: string }> = ({ value, onChange, ...rest }) => {
  const [h = '09', m = '00'] = (value || '09:00').split(':');
  const minutes = MINUTES.includes(m) ? MINUTES : [...MINUTES, m].sort();
  const label = rest['aria-label'];
  return (
    <span className="inline-flex items-center gap-1" role="group" aria-label={label}>
      <Select value={h} onChange={(e) => onChange(`${e.target.value}:${m}`)} aria-label={label ? `${label} 시` : '시'} className="w-[5.25rem] px-3 py-1.5 tabular-nums">
        {HOURS.map((x) => (
          <option key={x} value={x}>
            {x}시
          </option>
        ))}
      </Select>
      <span className="text-ink-3">:</span>
      <Select value={m} onChange={(e) => onChange(`${h}:${e.target.value}`)} aria-label={label ? `${label} 분` : '분'} className="w-[5.25rem] px-3 py-1.5 tabular-nums">
        {minutes.map((x) => (
          <option key={x} value={x}>
            {x}분
          </option>
        ))}
      </Select>
    </span>
  );
};

export default TimeInput;
