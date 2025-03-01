import React, { useState, useEffect, useCallback } from 'react';
import { GetAllSeniorFAQResponse } from '../../types/seniorfaq';

interface SeniorFAQFilterProps {
  seniorFaqs: GetAllSeniorFAQResponse['data']['seniorFaqs'];
  filter: string;
  selectedFilter: 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager';
  onFilterChange: (newFilter: string) => void;
  onSelectedFilterChange: (newSelectedFilter: SeniorFAQFilterProps['selectedFilter']) => void;
  setFilteredseniorFaqs: (value: GetAllSeniorFAQResponse['data']['seniorFaqs']) => void;
}

const SeniorFAQFilter: React.FC<SeniorFAQFilterProps> = ({
  seniorFaqs,
  filter,
  selectedFilter,
  onFilterChange,
  onSelectedFilterChange,
  setFilteredseniorFaqs
}) => {
  const [suggestedFilters, setSuggestedFilters] = useState<string[]>([]);
  const [isSuggestedFiltersInputFocused, setSuggestedFiltersInputFocused] = useState(false);

  useEffect(() => {
    const uniqueSuggestions = Array.from(
      new Set(
        seniorFaqs
          .map((faq) => faq[selectedFilter])
          .filter((value) => value.toLowerCase().includes(filter.toLowerCase()))
      )
    );
    setSuggestedFilters(uniqueSuggestions);
    const filteredseniorFaqs = seniorFaqs.filter(seniorFaq =>
      String(seniorFaq[selectedFilter]).toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredseniorFaqs(filteredseniorFaqs);
  }, [seniorFaqs, filter, selectedFilter]);

  const handleFocus = useCallback(() => setSuggestedFiltersInputFocused(true), []);
  const handleBlur = useCallback(() => setSuggestedFiltersInputFocused(false), []);

  return (
    <div className="p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">선배 FAQ 검색</h4>
      <div className="mb-4 flex space-x-4">
        <select
          value={selectedFilter}
          onChange={(e) => onSelectedFilterChange(e.target.value as SeniorFAQFilterProps['selectedFilter'])}
          className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="maincategory_ko">주요 카테고리</option>
          <option value="subcategory_ko">하위 카테고리</option>
          <option value="detailcategory_ko">세부 카테고리</option>
          <option value="manager">관리자</option>
        </select>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={filter}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {isSuggestedFiltersInputFocused && suggestedFilters.length > 0 && (
            <ul className="absolute z-10 top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto w-full">
              {suggestedFilters.map((suggestedFilter) => (
                <li
                  key={suggestedFilter}
                  onMouseDown={() => onFilterChange(suggestedFilter)}
                  className="p-2 cursor-pointer hover:bg-indigo-100"
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