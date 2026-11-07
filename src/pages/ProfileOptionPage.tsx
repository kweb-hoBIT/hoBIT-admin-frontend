import ProtectedPage from '../components/ProtectedPage';
import ProfileOptionMain from '../components/ProfileOption/ProfileOptionMain';

const ProfileOptionPage: React.FC = () => (
  <ProtectedPage>
    <main>
      <ProfileOptionMain />
    </main>
  </ProtectedPage>
);

export default ProfileOptionPage;
