import React, { useState, useEffect } from 'react';
import { GetAllFAQResponse } from '../../../types/faq';

type FAQFilterProps = {
  faqs: GetAllFAQResponse['data']['faqs'];
  filter: string;
  selectedFilter: 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager';
  onFilterChange: (value: string) => void;
  onSelectedFilterChange: (value: FAQFilterProps['selectedFilter']) => void;
  setFilteredFaqs: (value: GetAllFAQResponse['data']['faqs']) => void;
};

const FAQFilter: React.FC<FAQFilterProps> = ({
  faqs,
  filter,
  selectedFilter,
  onFilterChange,
  onSelectedFilterChange,
  setFilteredFaqs
}) => {
  const [suggestedFilters, setSuggestedFilters] = useState<string[]>([]);
  const [isSuggestedFiltersInputFocused, setSuggestedFiltersInputFocused] = useState(false);

  useEffect(() => {
    const filteredValues = faqs
      .map((faq) => faq[selectedFilter])
      .filter((value) => value.toLowerCase().includes(filter.toLowerCase()));
    setSuggestedFilters(Array.from(new Set(filteredValues)));

    const filteredFaqs = faqs.filter(faq =>
      String(faq[selectedFilter]).toLowerCase().includes(filter.toLowerCase())
    );
    setFilteredFaqs(filteredFaqs);

  }, [faqs, filter, selectedFilter]);

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setSuggestedFiltersInputFocused(false);
    }
  };

  return (
    <div className="p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">FAQ 검색</h4>
      <div className="mb-4 flex space-x-4">
        <select
          value={selectedFilter}
          onChange={(e) => onSelectedFilterChange(e.target.value as FAQFilterProps['selectedFilter'])}
          className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="maincategory_ko">주요 카테고리</option>
          <option value="subcategory_ko">하위 카테고리</option>
          <option value="question_ko">질문</option>
          <option value="manager">관리자</option>
        </select>
        <div className="relative w-full">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={filter}
            onFocus={() => setSuggestedFiltersInputFocused(true)}
            onBlur={handleInputBlur}
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

export default FAQFilter;
