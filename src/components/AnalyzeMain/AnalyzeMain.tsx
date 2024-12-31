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
    <div
      style={{
        maxWidth: '1500px',
        margin: '0 auto',
        padding: '2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '2rem',
      }}
    >
      {/* Analysis Results and Graph Section */}
      <div
        style={{
          flex: '0.75',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          minHeight: '500px',
          border: '1px solid #ddd',
          borderRadius: '1rem',
          padding: '1rem',
          backgroundColor: '#fff',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {showAnalyze ? (
          <Analyze
            searchSubject={filters.searchSubject}
            period={filters.period}
            startDate={filters.startDate}
            endDate={filters.endDate}
            sortOrder={filters.sortOrder}
            limit={'10'}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#888' }}>
            <h2>검색 결과가 여기에 표시됩니다</h2>
            <p>검색 조건을 설정한 후 결과를 확인하세요.</p>
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div
        style={{
          flex: '0.25',
          minWidth: '300px',
          minHeight: '500px',
          padding: '1rem',
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '1rem',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <AnalyzeFilter onApplyFilter={handleApplyFilter} />
      </div>
    </div>
  );
};

export default AnalyzeMain;
