import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header';
import SelectLog from '../components/log/SelectLog';
import FAQLogMain from '../components/log/FAQLogMain';
import QuestionLogMain from '../components/log/QuestionLogMain';

import React, { useState } from 'react';

const LogsPage: React.FC = () => {
  // Redux 상태 예시 (필요 시 사용)
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  // `SelectLog`에서 선택된 값을 상태로 관리
  const [selectedLog, setSelectedLog] = useState<'FAQ' | 'Question'>('Question');

  return (
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 공통 콘텐츠 영역 */}
      <main>
        <SelectLog onSelectLog={(log) => setSelectedLog(log)} />
        {selectedLog === 'FAQ' ? <FAQLogMain /> : <QuestionLogMain />}
      </main>
    </div>
  );
};

export default LogsPage;
