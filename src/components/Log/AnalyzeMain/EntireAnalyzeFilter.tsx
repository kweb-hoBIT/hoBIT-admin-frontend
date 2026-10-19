import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from 'date-fns/locale';
import Select from '../../ui/Select';

interface EntireAnalyzeFilterProps {
  onApplyFilter: (filters: any) => void;
}

const EntireAnalyzeFilter: React.FC<EntireAnalyzeFilterProps> = ({ onApplyFilter }) => {
  const [searchSubject, setSearchSubject] = useState('frequency');
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [sortOrder, setSortOrder] = useState('1');

  const disableDates = (date: Date, type: "start" | "end"): boolean => {
    if (!date) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (period === "day") {
      if (type === "start") return date > today; // 오늘 (시작)
      if (type === "end") return date > today; // 오늘 (종료)
    }

    if (period === "week") {
      if (type === "start") return date.getDay() !== 1 || date > today; // 월요일 (시작)
      if (type === "end") return date.getDay() !== 0 || date > today; // 일요일 (종료)
    }

    if (period === "month") {
      if (type === "start") return date.getDate() !== 1 || date > today; // 1일 (시작)
      if (type === "end") {
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);
        return nextDay.getDate() !== 1 || date > today; // 다음 날이 1일 (종료)
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
    <div className="flex-[0.25] w-full h-[500px] p-4 bg-card border border-line rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.1)] overflow-y-auto">
      <div className="p-4 rounded-3xl max-w-sm mx-auto space-y-4">
        <h4 className="text-xl font-semibold text-ink">분석 필터 설정</h4>
        <div className="space-y-3">
          {/* 검색 주제 */}
          <div>
            <label className="block text-sm font-medium text-ink">검색 주제</label>
            <Select
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              className="w-full p-1 rounded-xl border border-line shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-ink/40 transition ease-in-out"
            >
              <option value="frequency">FAQ 검색 빈도</option>
              <option value="feedback">FAQ 피드백 점수</option>
              <option value="language">사용 언어 빈도</option>
            </Select>
          </div>

          {/* 검색 주기 */}
          <div>
            <label className="block text-sm font-medium text-ink">검색 주기</label>
            <Select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setStartDate(null);
                setEndDate(null);
              }}
              className="w-full p-1 rounded-xl border border-line shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-ink/40 transition ease-in-out"
            >
              <option value="day">일</option>
              <option value="week">주</option>
              <option value="month">달</option>
            </Select>
          </div>

          {/* 시작 일자 */}
          <div>
            <label className="block text-sm font-medium text-ink">시작 일자</label>
            <DatePicker
              locale={ko}
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full p-1 rounded-xl border border-line shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-ink/40 transition ease-in-out"
              filterDate={(date) => !disableDates(date, "start")}
              placeholderText="시작 일자 선택"
              maxDate={endDate || undefined}
            />
          </div>

          {/* 종료 일자 */}
          <div>
            <label className="block text-sm font-medium text-ink">종료 일자</label>
            <DatePicker
              locale={ko}
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full p-1 rounded-xl border border-line shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-ink/40 transition ease-in-out"
              filterDate={(date) => !disableDates(date, "end")}
              placeholderText="종료 일자 선택"
              minDate={startDate || undefined}
            />
          </div>

          {/* 정렬 순서 */}
          <div>
            <label className="block text-sm font-medium text-ink">정렬 순서</label>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-1 rounded-xl border border-line shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-ink/40 transition ease-in-out"
            >
              <option value="1">내림차순</option>
              <option value="0">오름차순</option>
            </Select>
          </div>

          {/* 검색 버튼 */}
          <div>
            <button
              onClick={handleApplyFilter}
              disabled={!startDate || !endDate}
              className={`w-full p-2 text-sm font-semibold rounded-xl mt-4 transition duration-300 ${
                !startDate || !endDate
                  ? 'bg-card-2 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-accent/90 focus:ring-2 focus:ring-accent-ink/40'
              }`}
            >
              검색
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntireAnalyzeFilter;
