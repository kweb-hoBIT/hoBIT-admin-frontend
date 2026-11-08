import React from 'react';
import { GetAllSeniorFAQResponse } from '../../../types/seniorfaq';
import Select from '../../ui/Select';

type SeniorFAQ = GetAllSeniorFAQResponse['data']['seniorFaqs'][number];

const FIELDS = ['created_at', 'maincategory_ko', 'subcategory_ko', 'detailcategory_ko'] as const;
const collator = new Intl.Collator('ko-KR');

/** 정렬 값(짝수 = 가나다·오래된순, 홀수 = 역순·최신순)대로 새 배열로 정렬 */
export function sortSeniorFAQs(list: readonly SeniorFAQ[], sort: number): SeniorFAQ[] {
  const field = FIELDS[Math.floor(sort / 2)] ?? 'created_at';
  const dir = sort % 2 === 0 ? 1 : -1;
  return [...list].sort((a, b) => dir * collator.compare(String(a[field]), String(b[field])));
}

type SeniorFAQSortProps = {
  sort: number;
  onSortChange: (value: number) => void;
};

const SeniorFAQSort: React.FC<SeniorFAQSortProps> = ({ sort, onSortChange }) => (
  <Select
    value={sort}
    onChange={(e) => onSortChange(Number(e.target.value))}
    aria-label="정렬"
    className="max-w-full p-2 rounded-xl border-2 border-line focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
  >
    <option value={1}>최신순</option>
    <option value={0}>오래된순</option>
    <option value={2}>주요 카테고리(가나다순)</option>
    <option value={3}>주요 카테고리(역순)</option>
    <option value={4}>하위 카테고리(가나다순)</option>
    <option value={5}>하위 카테고리(역순)</option>
    <option value={6}>세부 카테고리(가나다순)</option>
    <option value={7}>세부 카테고리(역순)</option>
  </Select>
);

export default SeniorFAQSort;
