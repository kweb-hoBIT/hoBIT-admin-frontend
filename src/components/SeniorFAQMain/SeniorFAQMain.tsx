import React, { useState } from 'react';
import SeniorFAQFilter from './SeniorFAQFilter';
import SeniorFAQList from './SeniorFAQList';

const SeniorFAQMainComponent: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'senior_faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager'>('detailcategory_ko');
  
  const handleFilterChange = (newFilter: string) => setFilter(newFilter);
  const handleSelectedFilterChange = (newSelectedFilter: 'senior_faq_id' | 'maincategory_ko' | 'subcategory_ko' | 'detailcategory_ko' | 'manager') =>
    setSelectedFilter(newSelectedFilter);

  return (
    <div className="senior-faq-main-component p-6 bg-gray-50 rounded-lg">
      <SeniorFAQFilter
        filter={filter}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        onSelectedFilterChange={handleSelectedFilterChange}
      />
      <SeniorFAQList filter={filter} selectedFilter={selectedFilter} />
    </div>
  );
};

export default SeniorFAQMainComponent;
