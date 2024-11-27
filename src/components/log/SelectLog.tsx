import React from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 사용

interface SelectLogProps {
  onSelectLog: (logType: 'Question' | 'FAQ') => void;
}

const SelectLog: React.FC<SelectLogProps> = ({ onSelectLog }) => {
  const [selectedLog, setSelectedLog] = React.useState<'Question' | 'FAQ'>('Question');
  const navigate = useNavigate(); // useNavigate 훅을 사용하여 페이지 이동

  const handleSelect = (logType: 'Question' | 'FAQ') => {
    setSelectedLog(logType);
    onSelectLog(logType);
  };

  const handleAnalyticsRedirect = () => {
    navigate('/logs/analytics'); // /logs/analytics로 이동
  };

  return (
    <div className="relative mt-4">
      {/* 오른쪽 위에 위치한 '로그 분석하기' 버튼 */}
      <button
        onClick={handleAnalyticsRedirect}
        className="absolute right-4 text-lg font-semibold text-blue-600 hover:text-blue-800"
      >
        로그 분석하기
      </button>

      {/* 아래에 위치한 유저 로그와 관리자 로그 */}
      <div className="flex justify-center items-center mt-8 text-lg">
        {/* 유저 로그 텍스트 */}
        <span
          onClick={() => handleSelect('Question')}
          className={`cursor-pointer font-semibold transition-colors duration-200 ${
            selectedLog === 'Question' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          유저 로그
        </span>

        {/* 구분선 */}
        <span className="text-gray-300 mx-4">|</span>

        {/* 관리자 로그 텍스트 */}
        <span
          onClick={() => handleSelect('FAQ')}
          className={`cursor-pointer font-semibold transition-colors duration-200 ${
            selectedLog === 'FAQ' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          관리자 로그
        </span>
      </div>
    </div>
  );
};

export default SelectLog;
