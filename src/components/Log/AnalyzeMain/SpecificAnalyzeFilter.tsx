import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { useHobitQueryGetApi } from '../../../hooks/hobitAdmin';
import { GetAllFAQRequest, GetAllFAQResponse } from '../../../types/faq';
import "react-datepicker/dist/react-datepicker.css";

import { appAlert } from '../../ui/Dialog';
import Select from '../../ui/Select';
interface SpecificAnalyzeFilterProps {
  onApplyFilter: (filters: any) => void;
}

const SpecificAnalyzeFilter: React.FC<SpecificAnalyzeFilterProps> = ({ onApplyFilter }) => {
  const [searchSubject, setSearchSubject] = useState('frequency');
  const [faq, setFaq] = useState('');
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
  const [faqData, setFaqData] = useState<GetAllFAQResponse['data']['faqs']>([]);
  const [filteredFAQ, setFilteredFAQ] = useState<GetAllFAQResponse['data']['faqs']>([]);
  const [isFaqInputFocused, setIsFaqInputFocused] = useState(false);

  const GetFAQsApi = useHobitQueryGetApi<GetAllFAQRequest, GetAllFAQResponse>('faqs');

  useEffect(() => {
    const fetchFAQData = async () => {
      if (GetFAQsApi.data?.payload?.statusCode === 200) {
        const data = GetFAQsApi.data.payload.data.faqs;
        setFaqData(data);
      } else {
        appAlert('FAQ 데이터를 가져오는 중 오류 발생');
        console.error('FAQ 데이터를 가져오는 중 오류 발생:', GetFAQsApi.error);
      }
    };

    if (GetFAQsApi.isSuccess && GetFAQsApi.data) {
      fetchFAQData();
    }
  }, [GetFAQsApi.isSuccess, GetFAQsApi.data]);

  useEffect(() => {
    if (faq) {
      const filtered = faqData.filter((faqItem) =>
        faqItem.question_ko.includes(faq)
      );
      setFilteredFAQ(filtered);
    } else {
      setFilteredFAQ(faqData);
    }
  }, [faq, faqData]);

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
    const selectedFAQ = faqData.find(faqItem => faqItem.question_ko === faq);
    const faq_id = selectedFAQ ? selectedFAQ.faq_id : null;

    const newFilters = {
      faq_id,
      searchSubject,
      period,
      startDate: startDate ? startDate.toISOString() : '',
      endDate: endDate ? endDate.toISOString() : '',
    };
    onApplyFilter(newFilters);
  };

  const isSearchButtonEnabled = faqData.some(faqItem =>
    faqItem.question_ko === faq
  );

  return (
    // 조건은 한 줄 도구 모음 (좁으면 2칸씩 줄바꿈) — 결과는 아래에 넓게
    <div className="rounded-2xl border border-line bg-card/60 p-3 sm:p-4">
        <div className="grid grid-cols-2 items-end gap-3 md:grid-cols-[minmax(0,2fr)_repeat(4,minmax(0,1fr))_auto]">
          {/* FAQ 질문 검색 */}
          <div className="relative col-span-2 md:col-span-1">
            <label className="mb-1 block text-xs font-semibold text-ink-2">FAQ 질문 검색</label>
            <input
              type="text"
              value={faq}
              onChange={(e) => setFaq(e.target.value)}
              onFocus={() => setIsFaqInputFocused(true)}
              onBlur={() => {
                setTimeout(() => {
                  setIsFaqInputFocused(false);
                }, 100);
              }}
              placeholder="FAQ 질문을 입력하세요"
              className="h-10 w-full rounded-xl border border-line bg-surface px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent-ink/40"
            />
            {isFaqInputFocused && filteredFAQ.length > 0 && (
              <ul className="absolute left-0 right-0 top-full z-20 mt-1 max-h-[220px] overflow-y-auto rounded-xl border border-line bg-surface shadow-lg">
                {filteredFAQ.map(faqItem => (
                  <li
                    key={faqItem.faq_id}
                    onClick={() => setFaq(faqItem.question_ko)}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-card"
                  >
                    {faqItem.question_ko}
                  </li>
                ))}
              </ul>
            )}
          </div>

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

          {/* 검색 버튼 */}
          <div className="col-span-2 md:col-span-1">
            <button
              onClick={handleApplyFilter}
              disabled={!startDate || !endDate || !isSearchButtonEnabled}
              className={`h-10 w-full rounded-xl px-6 text-sm font-semibold transition duration-300 ${
                !startDate || !endDate || !isSearchButtonEnabled
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

export default SpecificAnalyzeFilter;
