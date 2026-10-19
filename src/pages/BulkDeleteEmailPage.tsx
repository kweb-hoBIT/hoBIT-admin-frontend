import ProtectedPage from '../components/ProtectedPage';
import BulkDeleteEmail from '../components/Category/Email/BulkDeleteEmail';

const BulkDeleteEmailPage: React.FC = () => {
  return (
    <ProtectedPage>
      <div>
        <main>
          <BulkDeleteEmail />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BulkDeleteEmailPage;
