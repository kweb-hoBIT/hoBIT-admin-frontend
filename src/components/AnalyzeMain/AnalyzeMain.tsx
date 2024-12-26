import React, { useState } from 'react';
import AnalyzeFilter from './AnalyzeFilter';
import Analyze from './Analyze';

const AnalyzeMain: React.FC = () => {
  const [filters, setFilters] = useState({
    searchSubject: 'frequency',
    period: 'day',
    startDate: '',
    endDate: '',
    sortOrder: '1',
    limit: '0',
  });

  const [showAnalyze, setShowAnalyze] = useState(false);

  const handleApplyFilter = (newFilters: any) => {
    setFilters(newFilters);
    setShowAnalyze(true); // 필터 적용 후 분석 결과 표시
  };

  return (
    <div className="analyze-main">
      <AnalyzeFilter onApplyFilter={handleApplyFilter} />
      {showAnalyze && (
        <Analyze
          searchSubject={filters.searchSubject}
          period={filters.period}
          startDate={filters.startDate}
          endDate={filters.endDate}
          sortOrder={filters.sortOrder}
          limit={filters.limit}
        />
      )}
    </div>
  );
};

export default AnalyzeMain;
