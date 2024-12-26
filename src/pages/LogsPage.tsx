import Header from '../components/Header/Header';
import ProtectedPage from '../components/ProtectedPage';
import SelectLog from '../components/SelectLog/SelectLog';
import FAQLogMain from '../components/FAQLogMain/FAQLogMain';
import QuestionLogMain from '../components/QuestionLogMain/QuestionLogMain';

import React, { useState } from 'react';

const LogsPage: React.FC = () => {

  const [selectedLog, setSelectedLog] = useState<'FAQ' | 'Question'>('FAQ');

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <SelectLog onSelectLog={(log) => setSelectedLog(log)} />
        {selectedLog === 'FAQ' ? <FAQLogMain /> : <QuestionLogMain />}
      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogsPage;
