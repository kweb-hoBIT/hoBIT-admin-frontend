import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header';
import FAQCreate from '../components/faq/FAQCreate';

const FAQCreatePage: React.FC = () => {
  // Redux 상태 예시 (필요 시 사용)
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 공통 콘텐츠 영역*/}
      <main>
        <FAQCreate />
      </main>
    </div>
  );
};

export default FAQCreatePage;
