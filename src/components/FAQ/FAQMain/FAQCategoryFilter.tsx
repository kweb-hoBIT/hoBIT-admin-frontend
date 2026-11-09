import React, { useMemo } from 'react';
import Select from '../../ui/Select';

type Cat = { maincategory_ko: string; subcategory_ko: string };
export type CategoryPick = { main: string; sub: string };

const collator = new Intl.Collator('ko-KR');
const selectClass =
  'max-w-full p-2 rounded-xl border-2 border-line focus:outline-none focus:ring-2 focus:ring-accent-ink/40';

/** 카테고리로 모아 보기 — 주요 카테고리를 고르면 하위 카테고리 칸이 나타남 (괄호 안은 FAQ 수) */
export function filterByCategory<T extends Cat>(list: readonly T[], pick: CategoryPick): readonly T[] {
  if (!pick.main) return list;
  return list.filter((f) => f.maincategory_ko === pick.main && (!pick.sub || f.subcategory_ko === pick.sub));
}

const FAQCategoryFilter: React.FC<{ faqs: readonly Cat[]; value: CategoryPick; onChange: (v: CategoryPick) => void }> = ({
  faqs,
  value,
  onChange,
}) => {
  const mains = useMemo(() => {
    const m = new Map<string, number>();
    faqs.forEach((f) => f.maincategory_ko && m.set(f.maincategory_ko, (m.get(f.maincategory_ko) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => collator.compare(a[0], b[0]));
  }, [faqs]);
  const subs = useMemo(() => {
    if (!value.main) return [];
    const m = new Map<string, number>();
    faqs.forEach(
      (f) => f.maincategory_ko === value.main && f.subcategory_ko && m.set(f.subcategory_ko, (m.get(f.subcategory_ko) ?? 0) + 1)
    );
    return [...m.entries()].sort((a, b) => collator.compare(a[0], b[0]));
  }, [faqs, value.main]);

  return (
    <>
      <Select
        value={value.main}
        onChange={(e) => onChange({ main: e.target.value, sub: '' })}
        aria-label="주요 카테고리로 모아 보기"
        className={selectClass}
      >
        <option value="">전체 카테고리</option>
        {mains.map(([name, n]) => (
          <option key={name} value={name}>
            {name} ({n})
          </option>
        ))}
      </Select>
      {value.main && (
        <Select
          value={value.sub}
          onChange={(e) => onChange({ main: value.main, sub: e.target.value })}
          aria-label="하위 카테고리로 모아 보기"
          className={`${selectClass} animate-appear`}
        >
          <option value="">하위 전체</option>
          {subs.map(([name, n]) => (
            <option key={name} value={name}>
              {name} ({n})
            </option>
          ))}
        </Select>
      )}
    </>
  );
};

export default FAQCategoryFilter;
