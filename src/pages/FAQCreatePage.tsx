import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import FaqCreateTitle from '../components/faqs/FaqCreateTitle';
import FaqCreateMain from '../components/faqs/FaqCreateMain';

const FAQCreatePage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <div>
      <Header />
      <main>
        <FaqCreateTitle />
        <FaqCreateMain />
      </main>
    </div>
  );
};

export default FAQCreatePage;
