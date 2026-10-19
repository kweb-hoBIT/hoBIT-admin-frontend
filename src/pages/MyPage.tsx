import ProtectedPage from '../components/ProtectedPage';
import MyPage from '../components/User/MyPage/MyPage';

const MyPagePage: React.FC = () => (
  <ProtectedPage>
    <main>
      <MyPage />
    </main>
  </ProtectedPage>
);

export default MyPagePage;
