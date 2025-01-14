import React from 'react';

interface SeniorFAQFilterProps {
  filter: string;
  selectedFilter: 'senior_faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager';
  onFilterChange: (newFilter: string) => void;
  onSelectedFilterChange: (newSelectedFilter: SeniorFAQFilterProps['selectedFilter']) => void;
}

const SeniorFAQFilter: React.FC<SeniorFAQFilterProps> = ({
  filter,
  selectedFilter,
  onFilterChange,
  onSelectedFilterChange,
}) => {
  return (
    <div className="p-6">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">선배 FAQ 검색</h4>
      <div className="mb-4 flex space-x-4">
        <select
          value={selectedFilter}
          onChange={(e) => onSelectedFilterChange(e.target.value as SeniorFAQFilterProps['selectedFilter'])}
          className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="senior_faq_id">FAQ ID</option>
          <option value="maincategory_ko">주요 카테고리</option>
          <option value="subcategory_ko">하위 카테고리</option>
          <option value="detailcategory_ko">세부 카테고리</option>
          <option value="manager">관리자</option>
        </select>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
};

export default SeniorFAQFilter;
