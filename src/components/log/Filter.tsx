import React, { useState } from 'react';
import Analyze from './Analyze';
import InputField from '../InputField';

const Filter: React.FC = () => {
  const [searchSubject, setSearchSubject] = useState('frequency');
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState(1);
  const [limit, setLimit] = useState(0); // 기본값을 0으로 설정
  const [filters, setFilters] = useState({
    searchSubject,
    period,
    startDate,
    endDate,
    sortOrder,
    limit
  });
  const [showAnalyze, setShowAnalyze] = useState(false); // 버튼을 누르면 Analyze.tsx를 렌더링 하기 위해 설정(기본값 false)

  // 수정하고 버튼 누르면 실행
  const handleApplyFilter = () => {
    const newFilters = {
      searchSubject,
      period,
      startDate,
      endDate,
      sortOrder,
      limit
    };
    setFilters(newFilters);
    setShowAnalyze(true);
  };

  // limit 값 처리 (아무것도 없으면 자동으로 0으로 설정, 숫자만 입력가능, 숫자를 입력하면 자동으로 0이 지워지게)
  const handleLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, '');
    if (value === '') value = '0';
    setLimit(Number(value));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-xs mx-auto">
      <label className="font-medium text-gray-700 text-sm">검색 주제</label>
      <select
        value={searchSubject}
        onChange={(e) => setSearchSubject(e.target.value)}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-1"
      >
        <option value="frequency">FAQ 검색 빈도</option>
        <option value="feedback">FAQ 피드백 점수</option>
        <option value="language">사용 언어 빈도</option>
      </select>

      <label className="font-medium text-gray-700 text-sm">검색 주기</label>
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-1"
      >
        <option value="day">일</option>
        <option value="week">주</option>
        <option value="month">달</option>
      </select>

      <label className="font-medium text-gray-700 text-sm">시작 일자</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-1"
      />

      <label className="font-medium text-gray-700 text-sm">종료 일자</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-1"
      />

      <label className="font-medium text-gray-700 text-sm">정렬 순서</label>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(Number(e.target.value))}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-1"
      >
        <option value={1}>내림차순</option>
        <option value={0}>오름차순</option>
      </select>

      <label className="font-medium text-gray-700 text-sm">한 페이지 당 항목 수</label>
      <input
        type="text"
        value={limit}
        onChange={handleLimitChange}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-1"
      />

      <button
        onClick={handleApplyFilter}
        className="w-full p-1 bg-blue-500 text-white rounded-md mt-2 hover:bg-blue-600 text-sm"
      >
        검색
      </button>
      {showAnalyze && (
        <Analyze
          searchSubject={filters.searchSubject}
          period={filters.period}
          startDate={filters.startDate}
          endDate={filters.endDate}
          sortOrder={filters.sortOrder}
          limit={filters.limit}
        />
      )}
    </div>
  );
};

export default Filter;
