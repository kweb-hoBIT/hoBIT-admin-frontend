import React from 'react';
import Segmented from '../../ui/Segmented';

interface SelectUserFeedbackProps {
  filter: 'unresolved' | 'resolved';
  onFilterChange: (filterValue: 'unresolved' | 'resolved') => void;
  unresolvedCount?: number;
}

/** 해결 여부 거르기 — 화면을 바꾸는 탭(헤더 아래 줄)과 겹쳐 보이지 않게 알약 모양으로. 목록 머리줄의 둘째 줄(왼쪽)에 놓여요 */
const SelectUserFeedback: React.FC<SelectUserFeedbackProps> = ({ filter, onFilterChange, unresolvedCount }) => (
    <Segmented
      options={[
        ['unresolved', `해결 안 된 피드백${unresolvedCount ? ` ${unresolvedCount}` : ''}`],
        ['resolved', '해결된 피드백'],
      ] as const}
      value={filter}
      onChange={onFilterChange}
      itemClassName="px-4 py-1.5 text-sm font-semibold"
      className="w-fit max-w-full" // 글자 길이만큼만 (가로를 꽉 채우던 회색 바탕)
    />
);

export default SelectUserFeedback;
