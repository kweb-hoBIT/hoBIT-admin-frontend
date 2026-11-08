import ProtectedPage from '../components/ProtectedPage';
import LogMain from '../components/Log/LogMain/LogMain';

import React from 'react';

const LogsPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <LogMain view="question" />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogsPage;
