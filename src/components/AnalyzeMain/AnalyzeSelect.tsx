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
    <div className="relative mt-4">
      {/* 아래에 위치한 전체 로그 데이터와 특정 로그 데이터 */}
      <div className="flex justify-center items-center mt-8 text-lg">
        {/* 전체 로그 데이터 텍스트 */}
        <span
          onClick={() => handleSelect('Entire')}
          className={`cursor-pointer font-semibold transition-colors duration-200 ${
            selectedAnalyze === 'Entire' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          전체 로그 데이터
        </span>

        {/* 구분선 */}
        <span className="text-gray-300 mx-4">|</span>

        {/* 특정 로그 데이터 텍스트 */}
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
  );
};

export default AnalyzeSelect;
