import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SelectLogProps {
  onSelectLog: (logType: 'FAQ' | 'Question') => void;
}

const SelectLog: React.FC<SelectLogProps> = ({ onSelectLog }) => {
  const [selectedLog, setSelectedLog] = React.useState<'FAQ' | 'Question'>('FAQ');
  const navigate = useNavigate();

  const handleSelect = (logType: 'FAQ' | 'Question') => {
    setSelectedLog(logType);
    onSelectLog(logType);
  };

  const handleAnalyticsRedirect = () => {
    navigate('/logs/analytics');
  };

  return (
    <div className="p-6 bg-white-50 rounded-lg">
      <div className="relative mt-4">
        <div className="flex items-center justify-center mt-8 text-2xl">
          <button
            onClick={handleAnalyticsRedirect}
            className="absolute -top-4 right-6 mt-4 text-2xl font-semibold text-blue-600 hover:text-blue-800"
          >
            로그 분석하기
          </button>
          <div className="flex-1 text-right pr-4">
            <span
              onClick={() => handleSelect('FAQ')}
              className={`cursor-pointer font-semibold transition-colors duration-200 ${
                selectedLog === 'FAQ' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              관리자 로그
            </span>
          </div>

          <div className="w-px h-6 bg-gray-300"></div>

          <div className="flex-1 text-left pl-4">
            <span
              onClick={() => handleSelect('Question')}
              className={`cursor-pointer font-semibold transition-colors duration-200 ${
                selectedLog === 'Question' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              유저 로그
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectLog;
