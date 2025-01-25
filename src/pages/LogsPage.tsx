import Header from '../components/Header/Header';
import ProtectedPage from '../components/ProtectedPage';
import SelectLog from '../components/LogMain/SelectLog';
import AdminLogMain from '../components/LogMain/AdminLogMain';
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
        {selectedLog === 'FAQ' ? <AdminLogMain /> : <QuestionLogMain />}
      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogsPage;
