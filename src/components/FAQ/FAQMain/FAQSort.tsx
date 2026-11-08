import React from 'react';
import { GetAllFAQResponse } from '../../../types/faq';
import Select from '../../ui/Select';

type FAQ = GetAllFAQResponse['data']['faqs'][number];

const FIELDS = ['created_at', 'maincategory_ko', 'subcategory_ko', 'question_ko'] as const;
const collator = new Intl.Collator('ko-KR');

/** 정렬 값(짝수 = 가나다·오래된순, 홀수 = 역순·최신순)대로 새 배열로 정렬 */
export function sortFAQs(list: readonly FAQ[], sort: number): FAQ[] {
  const field = FIELDS[Math.floor(sort / 2)] ?? 'created_at';
  const dir = sort % 2 === 0 ? 1 : -1;
  return [...list].sort((a, b) => dir * collator.compare(String(a[field]), String(b[field])));
}

type FAQSortProps = {
  sort: number;
  onSortChange: (value: number) => void;
};

const FAQSort: React.FC<FAQSortProps> = ({ sort, onSortChange }) => (
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
    <option value={6}>질문(가나다순)</option>
    <option value={7}>질문(역순)</option>
  </Select>
);

export default FAQSort;
