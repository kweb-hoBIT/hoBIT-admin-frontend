import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header';

const FAQDetailPage: React.FC = () => {
  // Redux 상태 예시 (필요 시 사용)
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <div>
      {/* 공통 헤더 */}
      <Header />

      {/* 공통 콘텐츠 영역*/}
      <main>
        
      </main>
    </div>
  );
};

export default FAQDetailPage;
