import React from 'react';

interface AnalyzeSelectProps {
  onSelectAnalyze: (logType: 'Entire' | 'Specific') => void;
}

const AnalyzeSelect: React.FC<AnalyzeSelectProps> = ({ onSelectAnalyze }) => {
  const [selectedAnalyze, setSelectedLog] = React.useState<'Entire' | 'Specific'>('Entire');

  const handleSelect = (logType: 'Entire' | 'Specific') => {
    setSelectedLog(logType);
    onSelectAnalyze(logType);
  };

  return (
    <div className="p-6">
      <div className="relative mt-4">
        <div className="flex items-center justify-center mt-8 text-lg">
          <div className="flex-1 text-right pr-4">
            <span
              onClick={() => handleSelect('Entire')}
              className={`cursor-pointer font-semibold transition-colors duration-200 ${
                selectedAnalyze === 'Entire' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              전체 로그 데이터
            </span>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex-1 text-left pl-4">
            <span
              onClick={() => handleSelect('Specific')}
              className={`cursor-pointer font-semibold transition-colors duration-200 ${
                selectedAnalyze === 'Specific' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              특정 로그 데이터
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyzeSelect;
