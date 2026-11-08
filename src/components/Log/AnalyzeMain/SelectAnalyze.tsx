import React from 'react';
import Segmented from '../../ui/Segmented';

interface AnalyzeSelectProps {
  selectedAnalyze: 'Entire' | 'Specific';
  onFilterChange: (filterValue: 'Entire' | 'Specific') => void;
}

/** 분석 종류 — 화면을 바꾸는 헤더 탭과 겹쳐 보이지 않게 알약 모양 */
const SelectAnalyze: React.FC<AnalyzeSelectProps> = ({ selectedAnalyze, onFilterChange }) => (
  <Segmented
    options={[
      ['Entire', 'FAQ 순위'],
      ['Specific', 'FAQ 하나 자세히'],
    ] as const}
    value={selectedAnalyze}
    onChange={onFilterChange}
    itemClassName="px-4 py-1.5 text-sm font-semibold"
    className="w-fit max-w-full"
  />
);

export default SelectAnalyze;
