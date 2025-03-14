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

  return (
    <>
      <SelectAnalyze selectedAnalyze={selectedAnalyze} onFilterChange={handleFilterChange}/>
      {selectedAnalyze === 'Entire' ? (
        <div className="max-w-[1500px] mx-auto p-8 flex justify-between items-start gap-8">
          <div className="flex-[0.75] flex flex-col gap-6 min-h-[500px] min-w-[300px] border border-[#ddd] rounded-lg p-4 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
            {/* Analysis Results and Graph Section */}
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
              <div className="text-center text-[#888]">
                <h2>검색 결과가 여기에 표시됩니다</h2>
                <p>검색 조건을 설정한 후 결과를 확인하세요.</p>
                <p>조건에 맞는 Top 10의 FAQ를 보여줍니다.</p>
              </div>
            )}
          </div>
          {/* Filter Section */}
          <EntireAnalyzeFilter onApplyFilter={handleApplyEntireFilter} />
        </div>
      ) : (
        <div className="max-w-[1500px] mx-auto p-8 flex justify-between items-start gap-8">
          <div className="flex-[0.75] flex flex-col gap-6 min-h-[500px] min-w-[300px] border border-[#ddd] rounded-lg p-4 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
            {/* Analysis Results and Graph Section */}
            {showSpecificAnalyze ? (
              <SpecificAnalyze
                faq_id={Specificfilters.faq_id}
                searchSubject={Specificfilters.searchSubject}
                period={Specificfilters.period}
                startDate={Specificfilters.startDate}
                endDate={Specificfilters.endDate}
              />
            ) : (
              <div className="text-center text-[#888]">
                <h2>검색 결과가 여기에 표시됩니다</h2>
                <p>검색 조건을 설정한 후 결과를 확인하세요.</p>
                <p>해당 FAQ에 대한 분석 결과를 보여줍니다.</p>
              </div>
            )}
          </div>
          {/* Filter Section */}
          <SpecificAnalyzeFilter onApplyFilter={handleApplySpecificFilter} />
        </div>
      )}
    </>
  );
};

export default AnalyzeMain;
