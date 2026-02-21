import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import BulkDeleteEmail from '../components/Category/Email/BulkDeleteEmail';

const BulkDeleteEmailPage: React.FC = () => {
  return (
    <ProtectedPage>
      <div>
        <Header />
        <main>
          <BulkDeleteEmail />
        </main>
      </div>
    </ProtectedPage>
  );
};

export default BulkDeleteEmailPage;
