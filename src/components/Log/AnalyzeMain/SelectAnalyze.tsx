import React from 'react';
import Tabs from '../../ui/Tabs';

interface AnalyzeSelectProps {
  selectedAnalyze: 'Entire' | 'Specific';
  onFilterChange: (filterValue: 'Entire' | 'Specific') => void;
}

const SelectAnalyze: React.FC<AnalyzeSelectProps> = ({ selectedAnalyze, onFilterChange }) => (
  <Tabs
    tabs={[
      { value: 'Entire', label: '전체 로그 데이터' },
      { value: 'Specific', label: '특정 로그 데이터' },
    ]}
    value={selectedAnalyze}
    onChange={onFilterChange}
  />
);

export default SelectAnalyze;
