import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import SeniorFAQCreate from '../components/SeniorFAQCreate/SeniorFAQCreate';

const FAQCreatePage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <SeniorFAQCreate />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCreatePage;
