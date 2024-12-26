import React, { useState } from 'react';
import FAQFilter from './FAQFilter';
import FAQList from './FAQList';

const FAQMainComponent: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager'>('question_ko');
  const handleFilterChange = (newFilter: string) => setFilter(newFilter);
  const handleSelectedFilterChange = (newSelectedFilter: 'faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'question_ko' | 'manager') =>
    setSelectedFilter(newSelectedFilter);

  return (
    <div className="faq-main-component p-6 bg-gray-50 rounded-lg">
      <FAQFilter
        filter={filter}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        onSelectedFilterChange={handleSelectedFilterChange}
      />
      <FAQList filter={filter} selectedFilter={selectedFilter} />
    </div>
  );
};

export default FAQMainComponent;
