import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProtectedPage from '../components/ProtectedPage';
import AnalyzeFilter from '../components/log/AnalyzeFilter';

const LogAnalyticsPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 공통 콘텐츠 영역*/}
      <main>
        <AnalyzeFilter />

      </main>
    </div>
    </ProtectedPage>
  );
};

export default LogAnalyticsPage;
