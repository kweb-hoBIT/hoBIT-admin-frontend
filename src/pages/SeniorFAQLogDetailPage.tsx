import { useParams } from 'react-router-dom';
import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import SeniorFAQLogDetail from '../components/AdminLogDetail/SeniorFAQLogDetail';

const FAQLogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
      {id ? <SeniorFAQLogDetail senior_faq_log_id={id} /> : <p>Senior FAQ ID가 제공되지 않았습니다.</p>}
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQLogDetailPage;
