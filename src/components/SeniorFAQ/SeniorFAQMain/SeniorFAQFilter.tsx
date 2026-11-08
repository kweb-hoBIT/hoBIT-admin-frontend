import React, { useState, useMemo, useCallback } from 'react';
import { GetAllSeniorFAQResponse } from '../../../types/seniorfaq';
import Select from '../../ui/Select';

interface SeniorFAQFilterProps {
  seniorFaqs: GetAllSeniorFAQResponse['data']['seniorFaqs'];
  filter: string;
  selectedFilter: 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager';
  onFilterChange: (newFilter: string) => void;
  onSelectedFilterChange: (newSelectedFilter: SeniorFAQFilterProps['selectedFilter']) => void;
}

const SeniorFAQFilter: React.FC<SeniorFAQFilterProps> = ({
  seniorFaqs,
  filter,
  selectedFilter,
  onFilterChange,
  onSelectedFilterChange,
}) => {
  const [isSuggestedFiltersInputFocused, setSuggestedFiltersInputFocused] = useState(false);

  // 추천 검색어 — 입력칸을 눌렀을 때만 계산 (목록 거르기는 SeniorFAQMainForm에서)
  const suggestedFilters = useMemo(() => {
    if (!isSuggestedFiltersInputFocused) return [];
    const q = filter.toLowerCase();
    return Array.from(new Set(seniorFaqs.map((faq) => String(faq[selectedFilter] ?? '')).filter((v) => v.toLowerCase().includes(q))));
  }, [seniorFaqs, filter, selectedFilter, isSuggestedFiltersInputFocused]);

  const handleFocus = useCallback(() => setSuggestedFiltersInputFocused(true), []);
  const handleBlur = useCallback(() => setSuggestedFiltersInputFocused(false), []);

  return (
    <div className="p-3 sm:p-6">
      <h4 className="text-xl font-bold mb-4 text-ink">선배 FAQ 검색</h4>
      {/* 휴대폰: 고르는 칸과 검색칸을 위아래로, 둘 다 전체 너비 */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:gap-4">
        <Select
          value={selectedFilter}
          onChange={(e) => onSelectedFilterChange(e.target.value as SeniorFAQFilterProps['selectedFilter'])}
          className="p-2 rounded-xl border-2 border-line focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
        >
          <option value="maincategory_ko">주요 카테고리</option>
          <option value="subcategory_ko">하위 카테고리</option>
          <option value="detailcategory_ko">세부 카테고리</option>
          <option value="manager">관리자</option>
        </Select>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={filter}
            onFocus={handleFocus}
            onBlur={handleBlur}
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

export default SeniorFAQFilter;