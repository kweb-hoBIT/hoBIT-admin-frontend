import React from 'react';
import { Link } from 'react-router-dom';
import Tabs from '../../ui/Tabs';
import { prefetchRoute } from '../../../routes';

interface SelectLogProps {
  selectedLog: 'FAQ' | 'Question';
  onFilterChange: (filterValue: 'FAQ' | 'Question') => void;
}

const SelectLog: React.FC<SelectLogProps> = ({ selectedLog, onFilterChange }) => (
  <Tabs
    tabs={[
      { value: 'FAQ', label: '관리자 로그' },
      { value: 'Question', label: '유저 로그' },
    ]}
    value={selectedLog}
    onChange={onFilterChange}
    right={
      <Link
        to="/logs/analytics"
        onMouseEnter={() => prefetchRoute('/logs/analytics')}
        className="rounded-full px-4 py-2 text-sm font-semibold text-accent-ink hover:bg-card"
      >
        로그 분석 →
      </Link>
    }
  />
);

export default SelectLog;
