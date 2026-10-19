import ProtectedPage from '../components/ProtectedPage';
import SeniorFAQMain from '../components/SeniorFAQ/SeniorFAQMain/SeniorFAQMain';

const FAQsPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <main>
        <SeniorFAQMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQsPage;