import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import BulkUpdateEmail from '../components/Category/Email/BulkUpdateEmail';

const BulkUpdateEmailPage: React.FC = () => {
  return (
    <ProtectedPage>
      <div>
        <Header />
        <main>
          <BulkUpdateEmail />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BulkUpdateEmailPage;
