import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProtectedPage from '../components/ProtectedPage';
import Filter from '../components/log/Filter';

const LogAnalyticsPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 공통 콘텐츠 영역*/}
      <main>
        <Filter />

      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogAnalyticsPage;
