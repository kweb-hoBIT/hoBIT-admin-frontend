import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

import Header from '../components/Header';
import Main from '../components/main/Main';

const MainPage: React.FC = () => {
  // Redux 상태 예시 (필요 시 사용)
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <div>
      <Header />
      <main>
      <Main />
      </main>
    </div>
  );
};

export default MainPage;
