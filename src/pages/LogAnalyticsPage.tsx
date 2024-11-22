import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Filter from '../components/log/Filter';

const LogAnalyticsPage: React.FC = () => {
  return (
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 공통 콘텐츠 영역*/}
      <main>
        <Filter />

      </main>
    </div>
  );
};

export default LogAnalyticsPage;
