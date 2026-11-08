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
  // 처음에는 최근 30일 (일 단위) — 날짜를 고르지 않아도 바로 검색
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 29);
    return d;
  });
  const [endDate, setEndDate] = useState<Date | null>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
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
    // 조건은 한 줄 도구 모음 (좁으면 2칸씩 줄바꿈) — 결과는 아래에 넓게
    <div className="rounded-2xl border border-line bg-card/60 p-3 sm:p-4">
        <div className="grid grid-cols-2 items-end gap-3 md:grid-cols-[repeat(5,minmax(0,1fr))_auto]">
          {/* 검색 주제 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-2">검색 주제</label>
            <Select
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
            >
              <option value="frequency">FAQ 검색 빈도</option>
              <option value="feedback">FAQ 피드백 점수</option>
              <option value="language">사용 언어 빈도</option>
            </Select>
          </div>

          {/* 검색 주기 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-2">검색 주기</label>
            <Select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setStartDate(null);
                setEndDate(null);
              }}
              className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
            >
              <option value="day">일</option>
              <option value="week">주</option>
              <option value="month">달</option>
            </Select>
          </div>

          {/* 시작 일자 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-2">시작 일자</label>
            <DatePicker
              locale={ko}
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              wrapperClassName="w-full"
              className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
              filterDate={(date) => !disableDates(date, "start")}
              placeholderText="시작 일자 선택"
              maxDate={endDate || undefined}
            />
          </div>

          {/* 종료 일자 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-2">종료 일자</label>
            <DatePicker
              locale={ko}
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              wrapperClassName="w-full"
              className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
              filterDate={(date) => !disableDates(date, "end")}
              placeholderText="종료 일자 선택"
              minDate={startDate || undefined}
            />
          </div>

          {/* 정렬 순서 */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-2">정렬 순서</label>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
            >
              <option value="1">내림차순</option>
              <option value="0">오름차순</option>
            </Select>
          </div>

          {/* 검색 버튼 */}
          <div className="col-span-2 md:col-span-1">
            <button
              onClick={handleApplyFilter}
              disabled={!startDate || !endDate}
              className={`h-10 w-full rounded-xl px-6 text-sm font-semibold transition duration-300 ${
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
  );
};

export default EntireAnalyzeFilter;
