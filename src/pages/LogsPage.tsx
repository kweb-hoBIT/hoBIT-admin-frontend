import Header from '../components/Header/Header';
import ProtectedPage from '../components/ProtectedPage';
import SelectLog from '../components/LogMain/SelectLog';
import FAQLogMain from '../components/LogMain/FAQLogMain';
import QuestionLogMain from '../components/LogMain/QuestionLogMain';

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
