import React from 'react';
import Tabs from '../../ui/Tabs';

interface SelectUserFeedbackProps {
  filter: 'unresolved' | 'resolved';
  onFilterChange: (filterValue: 'unresolved' | 'resolved') => void;
  unresolvedCount?: number;
}

const SelectUserFeedback: React.FC<SelectUserFeedbackProps> = ({ filter, onFilterChange, unresolvedCount }) => (
  <Tabs
    tabs={[
      { value: 'unresolved', label: '해결되지 않은 피드백', badge: unresolvedCount },
      { value: 'resolved', label: '해결된 피드백' },
    ]}
    value={filter}
    onChange={onFilterChange}
  />
);

export default SelectUserFeedback;
