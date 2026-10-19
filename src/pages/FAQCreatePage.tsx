import ProtectedPage from '../components/ProtectedPage';
import FAQCreate from '../components/FAQ/FAQCreate/FAQCreate';

const FAQCreatePage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <FAQCreate />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCreatePage;
