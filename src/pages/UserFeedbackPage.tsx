import ProtectedPage from '../components/ProtectedPage';
import UserFeedbackMain from '../components/UserFeedback/UserFeedbackMain/UserFeedbackMain';

const UserFeedbackMainPage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <UserFeedbackMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default UserFeedbackMainPage;
