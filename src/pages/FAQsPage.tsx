import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header';
import FAQFilter from '../components/faq/FAQFilter';

const FAQsPage: React.FC = () => {
  // Redux 상태 예시 (필요 시 사용)
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <ProtectedPage>
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 공통 콘텐츠 영역*/}
      <main>
        <FAQFilter />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQsPage;
