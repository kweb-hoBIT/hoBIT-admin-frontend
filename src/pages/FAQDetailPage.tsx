import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { useParams } from 'react-router-dom';

import Header from '../components/Header';
import FaqDetailsMain from '../components/faqs/FaqDetailsForm';
import ProtectedPage from '../components/ProtectedPage';

const FAQDetailPage: React.FC = () => {
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);
  const { id } = useParams<{ id: string }>();
  const faqId = Number(id);

  return (
    <ProtectedPage>
      <div>
        <Header />
        <main>
          <FaqDetailsMain faqId={faqId} />

        </main>
      </div>
    </ProtectedPage>
  );
};

export default FAQDetailPage;
