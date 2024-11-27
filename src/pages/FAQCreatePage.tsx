import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header';
import FAQCreate from '../components/faq/FAQCreate';

const FAQCreatePage: React.FC = () => {

  return (
    <ProtectedPage>
      <div>
        {/* 공통 헤더 */}
        <Header />

        {/* 공통 콘텐츠 영역*/}
        <main>
          <FAQCreate />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default FAQCreatePage;
