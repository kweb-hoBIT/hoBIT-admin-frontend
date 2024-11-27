import { useParams } from 'react-router-dom';
import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header';
import FAQLogDetail from '../components/log/FAQLogDetail';

const FAQLogDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
      {id ? <FAQLogDetail faq_log_id={id} /> : <p>FAQ ID가 제공되지 않았습니다.</p>}
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQLogDetailPage;
