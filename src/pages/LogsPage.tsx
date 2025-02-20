import Header from '../components/Header/Header';
import ProtectedPage from '../components/ProtectedPage';
import LogMain from '../components/LogMain/LogMain';

import React from 'react';

const LogsPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <LogMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogsPage;
