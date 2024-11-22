import React, { useState } from 'react';
import Analyze from './Analyze';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Filter: React.FC = () => {
  const [searchSubject, setSearchSubject] = useState('frequency');
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState(1);
  const [limit, setLimit] = useState(0);
  const [filters, setFilters] = useState({
    searchSubject,
    period,
    startDate,
    endDate,
    sortOrder,
    limit,
  });
  const [showAnalyze, setShowAnalyze] = useState(false);

  const disableDates = (date: Date, type: "start" | "end"): boolean => {
    if (!date) return false;

    if (period === "week") {
      if (type === "start") return date.getDay() !== 1; // 월요일 (시작)
      if (type === "end") return date.getDay() !== 0; // 일요일 (종료)
    }

    if (period === "month") {
      if (type === "start") return date.getDate() !== 1; // 1일 (시작)
      if (type === "end") {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return nextDay.getDate() !== 1; // 다음 날이 1일 (종료)
      }
    }

    return false;
  };

  const handleApplyFilter = () => {
    const newFilters = {
      searchSubject,
      period,
      startDate,
      endDate,
      sortOrder,
      limit,
    };
    setFilters(newFilters);
    setShowAnalyze(true);
  };

  // 숫자만 입력되도록 처리, 기본값은 0으로 설정, 만약 다른 숫자가 입력되면 앞의 0은 자동으로 사라짐
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
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-2"
      >
        <option value="frequency">FAQ 검색 빈도</option>
        <option value="feedback">FAQ 피드백 점수</option>
        <option value="language">사용 언어 빈도</option>
      </select>

      <label className="font-medium text-gray-700 text-sm">검색 주기</label>
      <select
        value={period}
        onChange={(e) => {
          setPeriod(e.target.value); // 검색 주기 변경
          setStartDate(null); // 시작 일자 초기화
          setEndDate(null); // 종료 일자 초기화
        }}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-2"
      >
        <option value="day">일</option>
        <option value="week">주</option>
        <option value="month">달</option>
      </select>

      <div className="mb-2">
      <label className="font-medium text-gray-700 text-sm block mb-2">시작 일자</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full p-1 border border-gray-300 rounded-md text-sm"
          filterDate={(date) => !disableDates(date, "start")}
          placeholderText="시작 일자 선택"
        />
      </div>

      <div className="mb-2">
        <label className="font-medium text-gray-700 text-sm block mb-2">종료 일자</label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full p-1 border border-gray-300 rounded-md text-sm"
          filterDate={(date) => !disableDates(date, "end")}
          placeholderText="종료 일자 선택"
          minDate={startDate || undefined}
        />
      </div>

      <label className="font-medium text-gray-700 text-sm">정렬 순서</label>
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(Number(e.target.value))}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-2"
      >
        <option value={1}>내림차순</option>
        <option value={0}>오름차순</option>
      </select>

      <label className="font-medium text-gray-700 text-sm">한 페이지 당 항목 수</label>
      <input
        type="text"
        value={limit}
        onChange={handleLimitChange}
        className="w-full p-1 border border-gray-300 rounded-md text-sm mb-2"
      />
      <button
        onClick={handleApplyFilter}
        disabled={!startDate || !endDate || limit == 0}
        className={`w-full p-1 rounded-md mt-2 text-sm ${
          !startDate || !endDate || limit == 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        검색
      </button>
      {showAnalyze && (
        <Analyze
          searchSubject={filters.searchSubject}
          period={filters.period}
          startDate={String(filters.startDate)}
          endDate={String(filters.endDate)}
          sortOrder={filters.sortOrder}
          limit={filters.limit}
        />
      )}
    </div>
  );
};

export default Filter;
