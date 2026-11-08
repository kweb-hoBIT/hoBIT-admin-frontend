import React, { useMemo, useState } from 'react';
import { GetAllFAQResponse } from '../../../types/faq';
import Select from '../../ui/Select';

type FAQFilterProps = {
  faqs: GetAllFAQResponse['data']['faqs'];
  filter: string;
  selectedFilter: 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager';
  onFilterChange: (value: string) => void;
  onSelectedFilterChange: (value: FAQFilterProps['selectedFilter']) => void;
};

const FAQFilter: React.FC<FAQFilterProps> = ({
  faqs,
  filter,
  selectedFilter,
  onFilterChange,
  onSelectedFilterChange,
}) => {
  const [isSuggestedFiltersInputFocused, setSuggestedFiltersInputFocused] = useState(false);

  // 추천 검색어 — 입력칸을 눌렀을 때만 계산 (목록 거르기는 FAQMainForm에서)
  const suggestedFilters = useMemo(() => {
    if (!isSuggestedFiltersInputFocused) return [];
    const q = filter.toLowerCase();
    return Array.from(new Set(faqs.map((faq) => String(faq[selectedFilter] ?? '')).filter((v) => v.toLowerCase().includes(q))));
  }, [faqs, filter, selectedFilter, isSuggestedFiltersInputFocused]);

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setSuggestedFiltersInputFocused(false);
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <h4 className="text-xl font-bold mb-4 text-ink">FAQ 검색</h4>
      {/* 휴대폰: 고르는 칸과 검색칸을 위아래로, 둘 다 전체 너비 */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
        <Select
          value={selectedFilter}
          onChange={(e) => onSelectedFilterChange(e.target.value as FAQFilterProps['selectedFilter'])}
          className="p-2 rounded-xl border-2 border-line focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
        >
          <option value="maincategory_ko">주요 카테고리</option>
          <option value="subcategory_ko">하위 카테고리</option>
          <option value="question_ko">질문</option>
          <option value="manager">관리자</option>
        </Select>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={filter}
            onFocus={() => setSuggestedFiltersInputFocused(true)}
            onBlur={handleInputBlur}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full p-3 rounded-xl border-2 border-line focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
          />
          {isSuggestedFiltersInputFocused && suggestedFilters.length > 0 && (
            <ul className="absolute z-10 top-full left-0 mt-1 bg-surface border border-line rounded-xl shadow-md max-h-[120px] overflow-y-auto w-full">
              {suggestedFilters.map((suggestedFilter) => (
                <li
                  key={suggestedFilter}
                  onMouseDown={() => onFilterChange(suggestedFilter)}
                  className="p-2 cursor-pointer hover:bg-card"
                >
                  {suggestedFilter}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQFilter;
