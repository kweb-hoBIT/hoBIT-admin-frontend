import { useParams } from 'react-router-dom';
import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import FAQDetail from '../components/FAQ/FAQDetail/FAQDetail';

const FAQDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
      {id ? <FAQDetail faq_id={id} /> : <p>FAQ ID가 제공되지 않았습니다.</p>}
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQDetailPage;
