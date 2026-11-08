import React from 'react';
import Segmented from '../../ui/Segmented';

export type AnalyzeKind = 'Entire' | 'Specific' | 'Scope';

interface AnalyzeSelectProps {
  selectedAnalyze: AnalyzeKind;
  onFilterChange: (filterValue: AnalyzeKind) => void;
}

/** 분석 종류 — 화면을 바꾸는 헤더 탭과 겹쳐 보이지 않게 알약 모양 */
const SelectAnalyze: React.FC<AnalyzeSelectProps> = ({ selectedAnalyze, onFilterChange }) => (
  <Segmented
    options={[
      ['Entire', '전체 FAQ'],
      ['Specific', 'FAQ별 추이'],
      ['Scope', '검색 범위'],
    ] as const}
    value={selectedAnalyze}
    onChange={onFilterChange}
    itemClassName="min-w-[5.5rem] px-3 sm:min-w-[6.5rem] sm:px-4 py-1.5 text-sm font-semibold" // 두 칸 같은 폭 — 바꿔도 알약 크기 그대로 (휴대폰은 세 칸이 들어가게 조금 좁게)
    className="w-fit max-w-full"
  />
);

export default SelectAnalyze;
