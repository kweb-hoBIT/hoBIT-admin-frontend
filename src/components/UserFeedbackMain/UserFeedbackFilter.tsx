import React from 'react';

interface FilterProps {
  filter: 'unresolved' | 'all';
  onFilterChange: (filterValue: 'unresolved' | 'all') => void;
}

const UserFeedbackFilter: React.FC<FilterProps> = ({ filter, onFilterChange }) => {
  return (
    <div className="mb-4 flex space-x-4">
      <button
        onClick={() => onFilterChange('unresolved')}
        className={`px-4 py-2 rounded-md text-sm font-semibold ${
          filter === 'unresolved' 
            ? 'bg-blue-600 text-white border-2 border-blue-600' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-2 border-transparent'
        }`}
      >
        해결되지 않은 피드백
      </button>
      <button
        onClick={() => onFilterChange('all')}
        className={`px-4 py-2 rounded-md text-sm font-semibold ${
          filter === 'all' 
            ? 'bg-blue-600 text-white border-2 border-blue-600' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300 border-2 border-transparent'
        }`}
      >
        전체 보기
      </button>
    </div>
  );
};

export default UserFeedbackFilter;
