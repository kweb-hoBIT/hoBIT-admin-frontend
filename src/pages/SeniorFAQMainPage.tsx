import ProtectedPage from '../components/ProtectedPage';
import Header from '../components/Header/Header';
import SeniorFAQMain from '../components/SeniorFAQ/SeniorFAQMain/SeniorFAQMain';

const FAQsPage: React.FC = () => {
  return (
    <ProtectedPage>
    <div>
      <Header />
      <main>
        <SeniorFAQMain />
      </main>
    </div>
    </ProtectedPage>
  );
};

export default FAQsPage;