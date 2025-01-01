import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface AnalyzeFilterProps {
  onApplyFilter: (filters: any) => void;
}

const AnalyzeFilter: React.FC<AnalyzeFilterProps> = ({ onApplyFilter }) => {
  const [searchSubject, setSearchSubject] = useState('frequency');
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState('1');

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
      startDate: startDate ? startDate.toISOString() : '',
      endDate: endDate ? endDate.toISOString() : '',
      sortOrder,
    };
    onApplyFilter(newFilters);
  };

  return (
  <div className="p-8 rounded-3xl max-w-3xl mx-auto space-y-10">
    <h4 className="text-3xl font-semibold text-gray-800">분석 필터 설정</h4>

    <div className="space-y-4">
      {/* 검색 주제 */}
      <div>
        <label className="block text-lg font-medium text-gray-700">검색 주제</label>
        <select
          value={searchSubject}
          onChange={(e) => setSearchSubject(e.target.value)}
          className="w-full p-2 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
        >
          <option value="frequency">FAQ 검색 빈도</option>
          <option value="feedback">FAQ 피드백 점수</option>
          <option value="language">사용 언어 빈도</option>
        </select>
      </div>

      {/* 검색 주기 */}
      <div>
        <label className="block text-lg font-medium text-gray-700">검색 주기</label>
        <select
          value={period}
          onChange={(e) => {
            setPeriod(e.target.value);
            setStartDate(null);
            setEndDate(null);
          }}
          className="w-full p-2 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
        >
          <option value="day">일</option>
          <option value="week">주</option>
          <option value="month">달</option>
        </select>
      </div>

      {/* 시작 일자 */}
      <div>
        <label className="block text-lg font-medium text-gray-700">시작 일자</label>
        <DatePicker
          selected={startDate}
          onChange={(date: Date | null) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full p-2 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
          filterDate={(date) => !disableDates(date, "start")}
          placeholderText="시작 일자 선택"
          maxDate={endDate || undefined}
        />
      </div>

      {/* 종료 일자 */}
      <div>
        <label className="block text-lg font-medium text-gray-700">종료 일자</label>
        <DatePicker
          selected={endDate}
          onChange={(date: Date | null) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          className="w-full p-2 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
          filterDate={(date) => !disableDates(date, "end")}
          placeholderText="종료 일자 선택"
          minDate={startDate || undefined}
        />
      </div>

      {/* 정렬 순서 */}
      <div>
        <label className="block text-lg font-medium text-gray-700">정렬 순서</label>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="w-full p-2 rounded-xl border border-gray-300 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
        >
          <option value="1">내림차순</option>
          <option value="0">오름차순</option>
        </select>
      </div>

      {/* 검색 버튼 */}
      <div>
        <button
          onClick={handleApplyFilter}
          disabled={!startDate || !endDate}
          className={`w-full p-2 text-xl font-semibold rounded-xl mt-4 transition duration-300 ${
            !startDate || !endDate
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600'
          }`}
        >
          검색
        </button>
      </div>
    </div>
  </div>
);

};

export default AnalyzeFilter;
