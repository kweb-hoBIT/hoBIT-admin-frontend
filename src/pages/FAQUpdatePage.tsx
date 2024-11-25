import { useParams } from 'react-router-dom';
import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header';
import FAQUpdate from '../components/faq/FAQUpdate';

const FAQUpdatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
 

  return (
    <ProtectedPage>
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 공통 콘텐츠 영역*/}
      <main>
      {id ? <FAQUpdate faq_id={id} /> : <p>FAQ ID가 제공되지 않았습니다.</p>}
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQUpdatePage;
