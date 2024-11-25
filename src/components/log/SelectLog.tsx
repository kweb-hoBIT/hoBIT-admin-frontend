import React from 'react';

interface SelectLogProps {
  onSelectLog: (logType: 'Question' | 'FAQ') => void;
}

const SelectLog: React.FC<SelectLogProps> = ({ onSelectLog }) => {
  const [selectedLog, setSelectedLog] = React.useState<'Question' | 'FAQ'>('Question');

  const handleSelect = (logType: 'Question' | 'FAQ') => {
    setSelectedLog(logType);
    onSelectLog(logType);
  };

  return (
    <div className="flex justify-center items-center mt-4 space-x-4 text-lg">
      {/* Question 로그 버튼 */}
      <button
        className={`font-medium ${
          selectedLog === 'Question'
            ? 'text-black'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        onClick={() => handleSelect('Question')}
      >
        유저 로그
      </button>
      <span className="text-gray-300">|</span>
      {/* FAQ 로그 버튼 */}
      <button
        className={`font-medium ${
          selectedLog === 'FAQ'
            ? 'text-black'
            : 'text-gray-400 hover:text-gray-600'
        }`}
        onClick={() => handleSelect('FAQ')}
      >
        관리자 로그
      </button>
    </div>
  );
};

export default SelectLog;
