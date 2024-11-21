import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import Header from '../components/Header';
import FaqEditMain from '../components/faqs/FaqEditForm';
import { useParams } from 'react-router-dom';
import ProtectedPage from '../components/ProtectedPage';

const FAQEditPage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);

  return (
    <ProtectedPage>
      <div>
        <Header />
        <main>
          <FaqEditMain faqId={faqId} />

        </main>
      </div>
    </ProtectedPage>
  );
};

export default FAQEditPage;
