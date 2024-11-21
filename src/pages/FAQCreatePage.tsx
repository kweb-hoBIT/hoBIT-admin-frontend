import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import FaqCreateMain from '../components/faqs/FaqCreateForm';
import ProtectedPage from '../components/ProtectedPage';

const FAQCreatePage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <ProtectedPage>
      <div>
        <Header />
        <main>
          <FaqCreateMain />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default FAQCreatePage;
