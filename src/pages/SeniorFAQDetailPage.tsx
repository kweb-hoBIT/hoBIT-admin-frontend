import { useParams } from 'react-router-dom';
import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import SeniorFAQDetail from '../components/SeniorFAQ/SeniorFAQDetail/SeniorFAQDetail';

const FAQDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
      {id ? <SeniorFAQDetail senior_faq_id={id} /> : <p>Senior FAQ ID가 제공되지 않았습니다.</p>}
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQDetailPage;
