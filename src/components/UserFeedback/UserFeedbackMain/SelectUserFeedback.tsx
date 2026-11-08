import React from 'react';
import Segmented from '../../ui/Segmented';

interface SelectUserFeedbackProps {
  filter: 'unresolved' | 'resolved';
  onFilterChange: (filterValue: 'unresolved' | 'resolved') => void;
  unresolvedCount?: number;
}

/** 해결 여부 거르기 — 화면을 바꾸는 탭(헤더 아래 줄)과 겹쳐 보이지 않게 알약 모양으로 */
const SelectUserFeedback: React.FC<SelectUserFeedbackProps> = ({ filter, onFilterChange, unresolvedCount }) => (
  <div className="px-3 pt-3 sm:px-6 sm:pt-6">
    <Segmented
      options={[
        ['unresolved', `해결 안 된 피드백${unresolvedCount ? ` ${unresolvedCount}` : ''}`],
        ['resolved', '해결된 피드백'],
      ] as const}
      value={filter}
      onChange={onFilterChange}
      itemClassName="px-4 py-1.5 text-sm font-semibold"
    />
  </div>
);

export default SelectUserFeedback;
