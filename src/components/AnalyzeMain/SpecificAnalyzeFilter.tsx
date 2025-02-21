import React, { useState, useEffect } from 'react';
import DatePicker from "react-datepicker";
import { useHobitQueryGetApi } from '../../hooks/hobitAdmin';
import { GetAllFAQRequest, GetAllFAQResponse } from '../../types/faq';
import "react-datepicker/dist/react-datepicker.css";

interface SpecificAnalyzeFilterProps {
  onApplyFilter: (filters: any) => void;
}

const SpecificAnalyzeFilter: React.FC<SpecificAnalyzeFilterProps> = ({ onApplyFilter }) => {
  const [searchSubject, setSearchSubject] = useState('frequency');
  const [faq, setFaq] = useState('');
  const [period, setPeriod] = useState('day');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
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
        alert('FAQ 데이터를 가져오는 중 오류 발생');
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
    <div className="flex-[0.25] w-full h-[500px] p-4 bg-[#f9f9f9] border border-[#ddd] rounded-lg shadow-[0_2px_6px_rgba(0,0,0,0.1)] overflow-y-auto">
      <div className="p-4 rounded-3xl max-w-sm mx-auto space-y-4">
        <h4 className="text-xl font-semibold text-gray-800">분석 필터 설정</h4>
        <div className="space-y-3">
          {/* FAQ 질문 검색 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">FAQ 질문 검색</label>
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
              className="w-full p-1 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
            />
            {isFaqInputFocused && filteredFAQ.length > 0 && (
              <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md max-h-[120px] overflow-y-auto">
                {filteredFAQ.map(faqItem => (
                  <li
                    key={faqItem.faq_id}
                    onClick={() => setFaq(faqItem.question_ko)}
                    className="p-2 cursor-pointer hover:bg-indigo-100"
                  >
                    {faqItem.question_ko}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 검색 주제 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">검색 주제</label>
            <select
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              className="w-full p-1 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
            >
              <option value="frequency">FAQ 검색 빈도</option>
              <option value="feedback">FAQ 피드백 점수</option>
              <option value="language">사용 언어 빈도</option>
            </select>
          </div>

          {/* 검색 주기 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">검색 주기</label>
            <select
              value={period}
              onChange={(e) => {
                setPeriod(e.target.value);
                setStartDate(null);
                setEndDate(null);
              }}
              className="w-full p-1 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
            >
              <option value="day">일</option>
              <option value="week">주</option>
              <option value="month">달</option>
            </select>
          </div>

          {/* 시작 일자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">시작 일자</label>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full p-1 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
              filterDate={(date) => !disableDates(date, "start")}
              placeholderText="시작 일자 선택"
              maxDate={endDate || undefined}
            />
          </div>

          {/* 종료 일자 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">종료 일자</label>
            <DatePicker
              selected={endDate}
              onChange={(date: Date | null) => setEndDate(date)}
              dateFormat="yyyy-MM-dd"
              className="w-full p-1 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 transition ease-in-out"
              filterDate={(date) => !disableDates(date, "end")}
              placeholderText="종료 일자 선택"
              minDate={startDate || undefined}
            />
          </div>

          {/* 검색 버튼 */}
          <div>
            <button
              onClick={handleApplyFilter}
              disabled={!startDate || !endDate || !isSearchButtonEnabled}
              className={`w-full p-2 text-sm font-semibold rounded-xl mt-4 transition duration-300 ${
                !startDate || !endDate || !isSearchButtonEnabled
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600'
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

export default SpecificAnalyzeFilter;
