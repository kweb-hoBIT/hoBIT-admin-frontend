import React, { useState } from 'react';
import AnalyzeSelect from './AnalyzeSelect';
import EntireAnalyzeFilter from './EntireAnalyzeFilter';
import EntireAnalyze from './EntireAnalyze';
import SpecificAnalyzeFilter from './SpecificAnalyzeFilter';
import SpecificAnalyze from './SpecificAnalyze';

const AnalyzeMain: React.FC = () => {
  const [selectedAnalyze, setSelectedAnalyze] = useState<'Entire' | 'Specific'>('Entire');

  const [Entirefilters, setEntireFilters] = useState({
    searchSubject: 'frequency',
    period: 'day',
    startDate: '',
    endDate: '',
    sortOrder: '1',
    limit: '0',
  });

  const [showEntireAnalyze, setShowEntireAnalyze] = useState(false);

  const handleApplyEntireFilter = (newFilters: any) => {
    setEntireFilters(newFilters);
    setShowEntireAnalyze(true);
  };

  const [Speicificfilters, setSpeicificFilters] = useState({
    faq_id: -1,
    searchSubject: '',
    period: 'day',
    startDate: '',
    endDate: '',
  });

  const [showSpeicificAnalyze, setShowSpeicificAnalyze] = useState(false);

  const handleApplySpeicificFilter = (newFilters: any) => {
    setSpeicificFilters(newFilters);
    setShowSpeicificAnalyze(true);
  };

  return (
    <>
      <AnalyzeSelect onSelectAnalyze={(analyze) => setSelectedAnalyze(analyze)} />
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
              </div>
            )}
          </div>
          {/* Filter Section */}
          <EntireAnalyzeFilter onApplyFilter={handleApplyEntireFilter} />
        </div>
      ) : (
        <div className="max-w-[1500px] mx-auto p-8 flex justify-between items-start gap-8">
          <div className="flex-[0.75] flex flex-col gap-6 min-h-[665px] min-w-[300px] border border-[#ddd] rounded-lg p-4 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
            {/* Analysis Results and Graph Section */}
            {showSpeicificAnalyze ? (
              <SpecificAnalyze
                faq_id={Speicificfilters.faq_id}
                searchSubject={Speicificfilters.searchSubject}
                period={Speicificfilters.period}
                startDate={Speicificfilters.startDate}
                endDate={Speicificfilters.endDate}
              />
            ) : (
              <div className="text-center text-[#888]">
                <h2>검색 결과가 여기에 표시됩니다</h2>
                <p>검색 조건을 설정한 후 결과를 확인하세요.</p>
              </div>
            )}
          </div>
          {/* Filter Section */}
          <SpecificAnalyzeFilter onApplyFilter={handleApplySpeicificFilter} />
        </div>
      )}
    </>
  );
};

export default AnalyzeMain;