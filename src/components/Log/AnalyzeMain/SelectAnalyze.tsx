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
      ['Entire', '전체 FAQ'],
      ['Specific', 'FAQ별 추이'],
    ] as const}
    value={selectedAnalyze}
    onChange={onFilterChange}
    itemClassName="min-w-[6.5rem] px-4 py-1.5 text-sm font-semibold" // 두 칸 같은 폭 — 바꿔도 알약 크기 그대로
    className="w-fit max-w-full"
  />
);

export default SelectAnalyze;
