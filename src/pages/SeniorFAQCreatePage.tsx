import ProtectedPage from '../components/ProtectedPage';
import SeniorFAQCreate from '../components/SeniorFAQ/SeniorFAQCreate/SeniorFAQCreate';

const FAQCreatePage: React.FC = () => {

  return (
    <ProtectedPage>
    <div>
      <main>
        <SeniorFAQCreate />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQCreatePage;
