import ProtectedPage from '../components/ProtectedPage';
import BulkUpdateEmail from '../components/Category/Email/BulkUpdateEmail';

const BulkUpdateEmailPage: React.FC = () => {
  return (
    <ProtectedPage>
      <div>
        <main>
          <BulkUpdateEmail />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BulkUpdateEmailPage;
