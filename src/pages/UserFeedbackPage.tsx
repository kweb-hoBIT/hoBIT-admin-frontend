import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import UserFeedbackMain from '../components/UserFeedbackMain/UserFeedbackMain';

const UserFeedbackMainPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <UserFeedbackMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default UserFeedbackMainPage;
