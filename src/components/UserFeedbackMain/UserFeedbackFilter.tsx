import React from 'react';

interface FilterProps {
  filter: 'all' | 'unresolved';
  onFilterChange: (filterValue: 'all' | 'unresolved') => void;
}

const UserFeedbackFilter: React.FC<FilterProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="mb-4 flex space-x-4">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold ${
          filter === 'all' ? 'bg-blue-500 text-white' : 'text-gray-700'
        }`}
      >
        전체 보기
      </button>
      <button
        onClick={() => onFilterChange('unresolved')}
        className={`px-4 py-2 bg-gray-300 rounded-md text-sm font-semibold ${
          filter === 'unresolved' ? 'bg-blue-500 text-white' : 'text-gray-700'
        }`}
      >
        해결되지 않은 피드백
      </button>
    </div>
  );
};

export default UserFeedbackFilter;
