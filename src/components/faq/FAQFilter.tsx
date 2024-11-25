import React, { useState } from 'react';
import FAQMain from './FAQMain';

const FAQFilter: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager'>('question_ko'); // 기본 필터는 'question_ko'

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value as 'faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager');
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-md">
      <h4 className="text-2xl font-bold mb-6 text-gray-800">FAQ 검색</h4>
      
      <div className="mb-4 flex space-x-4">
        <select
          value={selectedFilter}
          onChange={handleSelectChange}
          className="p-2 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="faq_id">FAQ ID</option>
          <option value="maincategory_ko">주요 카테고리</option>
          <option value="subcategory_ko">하위 카테고리</option>
          <option value="question_ko">질문</option>
          <option value="manager">관리자</option>
        </select>
        
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={filter}
          onChange={handleFilterChange}
          className="w-full p-3 rounded-md border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <FAQMain filter={filter} selectedFilter={selectedFilter} />
    </div>
  );
};

export default FAQFilter;
