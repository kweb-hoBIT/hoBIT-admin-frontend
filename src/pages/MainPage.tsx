import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header';
import Main from '../components/main/Main';
import Logout from '../components/Logout';

const MainPage: React.FC = () => {
  // Redux 상태 예시 (필요 시 사용)
  const isEmpty = useSelector((state: RootState) => state.input?.isEmpty);

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
      <Logout />
      <Main />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default MainPage;
