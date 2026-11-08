import React, { useState, useEffect } from 'react';
import SelectAnalyze from './SelectAnalyze';
import EntireAnalyzeFilter from './EntireAnalyzeFilter';
import EntireAnalyze from './EntireAnalyze';
import SpecificAnalyzeFilter from './SpecificAnalyzeFilter';
import SpecificAnalyze from './SpecificAnalyze';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { selectLogAnalysisFilter, setLogAnalyzeFilter } from '../../../redux/filterSlice';

const AnalyzeMain: React.FC = () => {
  const dispatch = useDispatch();
  const { storedLogAnalyzeFilter } = useSelector((state: RootState) => selectLogAnalysisFilter(state));

  const [selectedAnalyze, setSelectedAnalyze] = useState<'Entire' | 'Specific'>(storedLogAnalyzeFilter);

  useEffect(() => {
    dispatch(setLogAnalyzeFilter(selectedAnalyze));
  }, [selectedAnalyze, dispatch]);

  const [Entirefilters, setEntireFilters] = useState({
    searchSubject: 'frequency',
    period: 'day',
    startDate: '',
    endDate: '',
    sortOrder: '1',
    limit: '0',
  });

  const [showEntireAnalyze, setShowEntireAnalyze] = useState(false);

  const handleFilterChange = (filterValue: 'Entire' | 'Specific') => {
    setSelectedAnalyze(filterValue);
  };

  const handleApplyEntireFilter = (newFilters: any) => {
    setEntireFilters(newFilters);
    setShowEntireAnalyze(true);
  };

  const [Specificfilters, setSpecificFilters] = useState({
    faq_id: -1,
    searchSubject: '',
    period: 'day',
    startDate: '',
    endDate: '',
  });

  const [showSpecificAnalyze, setShowSpecificAnalyze] = useState(false);

  const handleApplySpecificFilter = (newFilters: any) => {
    setSpecificFilters(newFilters);
    setShowSpecificAnalyze(true);
  };

  const empty = (text: string) => (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-1 text-center">
      <p className="font-semibold text-ink-2">조건을 고르고 [검색]을 눌러 주세요</p>
      <p className="text-sm text-ink-3">{text}</p>
    </div>
  );

  return (
    <section className="panel p-4 sm:p-6">
      {/* 제목·알약은 한 줄 고정, 설명은 아래 — 알약을 바꿔도 위치가 움직이지 않게 (설명 길이에 따라 줄바꿈이 바뀌던 문제) */}
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-xl font-bold text-ink">로그 분석</h4>
        <SelectAnalyze selectedAnalyze={selectedAnalyze} onFilterChange={handleFilterChange} />
      </div>
      <p className="mb-4 mt-1 text-sm text-ink-3">
        {selectedAnalyze === 'Entire' ? '기간 안에서 많이 쓰이거나 평가가 높은·낮은 FAQ 10개를 보여 줘요.' : '고른 FAQ 하나가 기간별로 얼마나 쓰였는지 보여 줘요.'}
      </p>
      {selectedAnalyze === 'Entire' ? (
        <div className="flex flex-col gap-4">
          <EntireAnalyzeFilter onApplyFilter={handleApplyEntireFilter} />
          <div className="min-w-0 rounded-2xl border border-line p-3 sm:p-5">
            {showEntireAnalyze ? (
              <EntireAnalyze
                searchSubject={Entirefilters.searchSubject}
                period={Entirefilters.period}
                startDate={Entirefilters.startDate}
                endDate={Entirefilters.endDate}
                sortOrder={Entirefilters.sortOrder}
                limit={'10'}
              />
            ) : (
              empty('조건에 맞는 FAQ 10개를 표와 그래프로 보여 줘요.')
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <SpecificAnalyzeFilter onApplyFilter={handleApplySpecificFilter} />
          <div className="min-w-0 rounded-2xl border border-line p-3 sm:p-5">
            {showSpecificAnalyze ? (
              <SpecificAnalyze
                faq_id={Specificfilters.faq_id}
                searchSubject={Specificfilters.searchSubject}
                period={Specificfilters.period}
                startDate={Specificfilters.startDate}
                endDate={Specificfilters.endDate}
              />
            ) : (
              empty('FAQ 질문을 검색해 고르면 그 FAQ의 기간별 추이를 보여 줘요.')
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AnalyzeMain;
