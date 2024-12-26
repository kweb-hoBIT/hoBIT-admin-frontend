import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import FAQCreate from '../components/FAQCreate/FAQCreate';

const FAQCreatePage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <FAQCreate />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCreatePage;
